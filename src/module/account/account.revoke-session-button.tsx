"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { revokeOtherSessions } from "@/core/auth/auth.client";
import { Button } from "@/shared/components/ui/button";
import { debugError } from "@/shared/utils/lib/logger.utils";

export function RevokeSessionButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRevokeOtherSessions = () => {
    startTransition(async () => {
      const toastId = toast.loading("Revoking other sessions...");

      try {
        await revokeOtherSessions(undefined, {
          onSuccess: () => {
            router.refresh();
          },
        });

        toast.success("All other sessions revoked", { id: toastId });
      } catch (error) {
        debugError("REVOKE_SESSIONS_ERROR", error);
        toast.error("Failed to revoke sessions", { id: toastId });
      } finally {
        toast.dismiss(toastId);
        router.refresh();
      }
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRevokeOtherSessions} disabled={isPending}>
      {isPending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Revoking...
        </>
      ) : (
        "Revoke all Sessions"
      )}
    </Button>
  );
}
