"use client";

import { Github, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { signIn } from "@/core/auth/auth.client";
import { SUPPORTED_OAUTH_PROVIDER_DETAILS } from "@/core/auth/auth.providers";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import { debugError } from "@/shared/utils/lib/logger.utils";

export function GitHubSignIn() {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const handleSignIn = () => {
    startTransition(async () => {
      const toastId = toast.loading("Signing in...");
      try {
        await signIn.social({
          provider: "github",
          callbackURL: PATH.STUDIO.ROOT,
        });
        toast.success("Signed in successfully", { id: toastId });
      } catch (error) {
        debugError("SIGNIN ERROR GOOGLE", error);
        toast.error("Something went wrong", { id: toastId });
      } finally {
        toast.dismiss(toastId);
        router.push(PATH.STUDIO.ROOT);
      }
    });
  };

  return (
    <Button variant="outline" onClick={handleSignIn} disabled={isLoading} className="flex w-full items-center gap-2">
      {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
      {isLoading ? "Connecting…" : SUPPORTED_OAUTH_PROVIDER_DETAILS.github.name}
    </Button>
  );
}
