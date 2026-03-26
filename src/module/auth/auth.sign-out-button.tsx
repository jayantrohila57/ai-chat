"use client";

import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { signOut } from "@/core/auth/auth.client";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { debugError } from "@/shared/utils/lib/logger.utils";

export const AuthSignOutButton = () => {
  const [isLoading, startTransition] = useTransition();

  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      const toastId = toast.loading("Signing Out");
      try {
        await signOut();
        toast.success("Signed Out", { id: toastId });
        router.push(PATH.SITE.ROOT);
      } catch (error) {
        debugError("SIGNOUT ERROR", { error });
        toast.error("Failed to Sign Out", { id: toastId });
      }
    });
  };
  return (
    <Button onClick={handleSignOut} size="lg" variant="outline">
      {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {isLoading ? "Signing Out" : "Sign Out"}
    </Button>
  );
};
