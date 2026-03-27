import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/core/db/db";
import { creditLedger, creditWallet } from "@/core/db/db.schema";
import { serverEnv } from "@/shared/config/env.server";
import type { LedgerKind } from "./credits.schema";

function createId() {
  return crypto.randomUUID();
}

function isMissingDatabaseFieldError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("column") ||
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("failed query")
  );
}

type DbExecutor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

async function lockWalletRow(tx: DbExecutor, userId: string) {
  await tx.execute(sql`select id from credit_wallet where user_id = ${userId} for update`);
}

export async function ensureWalletForUser(userId: string) {
  const existing = await db.query.creditWallet.findFirst({
    where: eq(creditWallet.userId, userId),
  });

  if (existing) return existing;

  await db
    .insert(creditWallet)
    .values({
      id: createId(),
      userId,
    })
    .onConflictDoNothing({ target: creditWallet.userId });

  return db.query.creditWallet
    .findFirst({
      where: eq(creditWallet.userId, userId),
    })
    .then((wallet) => {
      if (!wallet) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create wallet" });
      }

      return wallet;
    });
}

export async function listLedgerEntries(userId: string, limit = 20) {
  await ensureWalletForUser(userId);

  try {
    return await db.query.creditLedger.findMany({
      where: eq(creditLedger.userId, userId),
      orderBy: desc(creditLedger.createdAt),
      limit,
    });
  } catch (error) {
    if (isMissingDatabaseFieldError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getWalletSummary(userId: string) {
  const wallet = await ensureWalletForUser(userId);
  const recentLedger = await listLedgerEntries(userId, 10);

  return {
    ...wallet,
    recentLedger,
  };
}

async function insertLedgerEntry(
  tx: DbExecutor,
  input: {
    walletId: string;
    userId: string;
    kind: LedgerKind;
    source: string;
    sourceRef?: string | null;
    deltaCredits: number;
    balanceAfterCredits: number;
    threadId?: string | null;
    messageId?: string | null;
    note?: string;
  },
) {
  await tx.insert(creditLedger).values({
    id: createId(),
    walletId: input.walletId,
    userId: input.userId,
    threadId: input.threadId ?? null,
    messageId: input.messageId ?? null,
    kind: input.kind,
    source: input.source,
    sourceRef: input.sourceRef ?? null,
    deltaCredits: input.deltaCredits,
    balanceAfterCredits: input.balanceAfterCredits,
    note: input.note,
  });
}

export async function grantStarterCreditsIfEligible(userId: string) {
  const starterCredits = Math.max(0, serverEnv.STARTER_CREDITS);
  const wallet = await ensureWalletForUser(userId);

  if (starterCredits === 0) return wallet;

  const existingGrant = await db.query.creditLedger.findFirst({
    where: and(eq(creditLedger.userId, userId), eq(creditLedger.kind, "starter_grant")),
  });

  if (existingGrant) return wallet;

  return db.transaction(async (tx) => {
    await lockWalletRow(tx, userId);

    const currentWallet = await tx.query.creditWallet.findFirst({
      where: eq(creditWallet.userId, userId),
    });

    if (!currentWallet) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Wallet missing during starter grant" });
    }

    const duplicateCheck = await tx.query.creditLedger.findFirst({
      where: and(eq(creditLedger.userId, userId), eq(creditLedger.kind, "starter_grant")),
    });

    if (duplicateCheck) return currentWallet;

    const nextBalance = currentWallet.balanceCredits + starterCredits;

    await tx
      .update(creditWallet)
      .set({
        balanceCredits: nextBalance,
        lifetimeGrantedCredits: currentWallet.lifetimeGrantedCredits + starterCredits,
      })
      .where(eq(creditWallet.id, currentWallet.id));

    await tx
      .insert(creditLedger)
      .values({
        id: createId(),
        walletId: currentWallet.id,
        userId,
        kind: "starter_grant",
        source: "auth:first-login",
        sourceRef: `starter:${userId}`,
        deltaCredits: starterCredits,
        balanceAfterCredits: nextBalance,
        note: "Starter credits granted on first login",
      })
      .onConflictDoNothing({ target: creditLedger.sourceRef });

    return {
      ...currentWallet,
      balanceCredits: nextBalance,
      lifetimeGrantedCredits: currentWallet.lifetimeGrantedCredits + starterCredits,
    };
  });
}

export async function reserveCredits(input: {
  userId: string;
  amountCredits: number;
  threadId?: string | null;
  messageId?: string | null;
  note?: string;
}) {
  const amountCredits = Math.max(0, Math.trunc(input.amountCredits));
  if (amountCredits === 0) {
    return {
      reservedCredits: 0,
      wallet: await ensureWalletForUser(input.userId),
    };
  }

  await ensureWalletForUser(input.userId);

  return db.transaction(async (tx) => {
    await lockWalletRow(tx, input.userId);

    const wallet = await tx.query.creditWallet.findFirst({
      where: eq(creditWallet.userId, input.userId),
    });

    if (!wallet) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Wallet not found" });
    }

    if (wallet.balanceCredits < amountCredits) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Insufficient credits to send this message",
      });
    }

    const nextBalance = wallet.balanceCredits - amountCredits;

    await tx
      .update(creditWallet)
      .set({
        balanceCredits: nextBalance,
      })
      .where(eq(creditWallet.id, wallet.id));

    await insertLedgerEntry(tx, {
      walletId: wallet.id,
      userId: input.userId,
      threadId: input.threadId,
      messageId: input.messageId,
      kind: "reservation",
      source: "ai:message-send",
      sourceRef: input.messageId ? `reservation:${input.messageId}` : null,
      deltaCredits: -amountCredits,
      balanceAfterCredits: nextBalance,
      note: input.note ?? "Credits reserved before model inference",
    });

    return {
      reservedCredits: amountCredits,
      wallet: {
        ...wallet,
        balanceCredits: nextBalance,
      },
    };
  });
}

export async function settleReservedCredits(input: {
  userId: string;
  reservedCredits: number;
  actualCredits: number;
  threadId?: string | null;
  messageId?: string | null;
}) {
  const reservedCredits = Math.max(0, Math.trunc(input.reservedCredits));
  const actualCredits = Math.max(0, Math.trunc(input.actualCredits));

  await ensureWalletForUser(input.userId);

  return db.transaction(async (tx) => {
    await lockWalletRow(tx, input.userId);

    const wallet = await tx.query.creditWallet.findFirst({
      where: eq(creditWallet.userId, input.userId),
    });

    if (!wallet) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Wallet not found during settlement" });
    }

    const refundCredits = Math.max(0, reservedCredits - actualCredits);
    const extraChargeRequested = Math.max(0, actualCredits - reservedCredits);
    const extraChargeApplied = Math.min(extraChargeRequested, wallet.balanceCredits);
    const finalChargedCredits = reservedCredits - refundCredits + extraChargeApplied;
    const nextBalance = wallet.balanceCredits + refundCredits - extraChargeApplied;

    await tx
      .update(creditWallet)
      .set({
        balanceCredits: nextBalance,
        lifetimeSpentCredits: wallet.lifetimeSpentCredits + finalChargedCredits,
      })
      .where(eq(creditWallet.id, wallet.id));

    if (extraChargeApplied > 0) {
      await insertLedgerEntry(tx, {
        walletId: wallet.id,
        userId: input.userId,
        threadId: input.threadId,
        messageId: input.messageId,
        kind: "settlement",
        source: "ai:message-complete",
        sourceRef: input.messageId ? `settlement:${input.messageId}` : null,
        deltaCredits: -extraChargeApplied,
        balanceAfterCredits: wallet.balanceCredits - extraChargeApplied,
        note: "Additional credits charged after completion",
      });
    }

    if (refundCredits > 0) {
      await insertLedgerEntry(tx, {
        walletId: wallet.id,
        userId: input.userId,
        threadId: input.threadId,
        messageId: input.messageId,
        kind: "refund",
        source: "ai:message-complete",
        sourceRef: input.messageId ? `refund:${input.messageId}` : null,
        deltaCredits: refundCredits,
        balanceAfterCredits: nextBalance,
        note: "Unused reserved credits refunded",
      });
    }

    return {
      reservedCredits,
      actualCredits,
      chargedCredits: finalChargedCredits,
      refundedCredits: refundCredits,
      additionalCreditsCharged: extraChargeApplied,
      wallet: {
        ...wallet,
        balanceCredits: nextBalance,
        lifetimeSpentCredits: wallet.lifetimeSpentCredits + finalChargedCredits,
      },
    };
  });
}

export async function adjustCredits(input: { userId: string; amountCredits: number; note?: string; source?: string }) {
  await ensureWalletForUser(input.userId);

  return db.transaction(async (tx) => {
    await lockWalletRow(tx, input.userId);

    const wallet = await tx.query.creditWallet.findFirst({
      where: eq(creditWallet.userId, input.userId),
    });

    if (!wallet) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Wallet not found during adjustment" });
    }

    const nextBalance = wallet.balanceCredits + input.amountCredits;

    if (nextBalance < 0) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Credit adjustment would create a negative balance",
      });
    }

    await tx
      .update(creditWallet)
      .set({
        balanceCredits: nextBalance,
        lifetimeGrantedCredits:
          input.amountCredits > 0 ? wallet.lifetimeGrantedCredits + input.amountCredits : wallet.lifetimeGrantedCredits,
      })
      .where(eq(creditWallet.id, wallet.id));

    await insertLedgerEntry(tx, {
      walletId: wallet.id,
      userId: input.userId,
      kind: "manual_adjustment",
      source: input.source ?? "staff:manual-adjustment",
      sourceRef: null,
      deltaCredits: input.amountCredits,
      balanceAfterCredits: nextBalance,
      note: input.note,
    });

    return {
      ...wallet,
      balanceCredits: nextBalance,
    };
  });
}

export async function grantSubscriptionCredits(input: {
  userId: string;
  amountCredits: number;
  source: string;
  sourceRef: string;
  note?: string;
}) {
  await ensureWalletForUser(input.userId);

  const existingEntry = await db.query.creditLedger.findFirst({
    where: eq(creditLedger.sourceRef, input.sourceRef),
  });

  if (existingEntry) {
    return existingEntry;
  }

  return db.transaction(async (tx) => {
    await lockWalletRow(tx, input.userId);

    const wallet = await tx.query.creditWallet.findFirst({
      where: eq(creditWallet.userId, input.userId),
    });

    if (!wallet) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Wallet not found during subscription grant" });
    }

    const duplicateCheck = await tx.query.creditLedger.findFirst({
      where: eq(creditLedger.sourceRef, input.sourceRef),
    });

    if (duplicateCheck) return duplicateCheck;

    const nextBalance = wallet.balanceCredits + input.amountCredits;

    await tx
      .update(creditWallet)
      .set({
        balanceCredits: nextBalance,
        lifetimeGrantedCredits: wallet.lifetimeGrantedCredits + input.amountCredits,
      })
      .where(eq(creditWallet.id, wallet.id));

    await insertLedgerEntry(tx, {
      walletId: wallet.id,
      userId: input.userId,
      kind: "subscription_grant",
      source: input.source,
      sourceRef: input.sourceRef,
      deltaCredits: input.amountCredits,
      balanceAfterCredits: nextBalance,
      note: input.note,
    });

    return tx.query.creditLedger.findFirst({
      where: eq(creditLedger.sourceRef, input.sourceRef),
    });
  });
}
