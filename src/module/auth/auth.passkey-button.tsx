"use client";

import { KeyIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { signIn, useSession } from "@/core/auth/auth.client";
import { Button } from "@/shared/components/ui/button";
import { debugError } from "@/shared/utils/lib/logger.utils";

export function PasskeyButton() {
  const router = useRouter();
  const { refetch } = useSession();
  const [isPending, startTransition] = useTransition();

  async function handleSignIn() {
    startTransition(async () => {
      const toastId = toast.loading("Signing in...");
      try {
        await signIn.passkey(
          { autoFill: true },
          {
            onSuccess() {
              refetch();
              toast.success("Signed in successfully", { id: toastId });
              router.push("/");
            },
          },
        );
      } catch (error) {
        debugError("SIGNIN ERROR PASSKEY", error);
        toast.error("Something went wrong", { id: toastId });
      }
    });
  }

  return (
    <Button variant="outline" className="w-full" onClick={() => void handleSignIn()} disabled={isPending}>
      {isPending ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Connecting…
        </>
      ) : (
        <>
          <KeyIcon className="h-4 w-4" />
          Use Passkey
        </>
      )}
    </Button>
  );
}
