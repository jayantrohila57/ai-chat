"use client";

import { requestPasswordReset } from "@/core/auth/auth.client";
import { Button } from "@/shared/components/ui/button";

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        void requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        });
      }}
    >
      Send Password Reset Email
    </Button>
  );
}
