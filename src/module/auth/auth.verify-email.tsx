"use client";

import { useEffect, useRef, useState } from "react";
import { sendVerificationEmail } from "@/core/auth/auth.client";
import { Button } from "@/shared/components/ui/button";

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  const startEmailVerificationCountdown = (time = 30) => {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;
        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startEmailVerificationCountdown(60);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleResendEmail = () => {
    startEmailVerificationCountdown();
    void sendVerificationEmail({
      email,
    });
  };

  return (
    <div className="space-y-4">
      <p className="mt-2 text-sm">
        We sent you a verification link. Please check your email and click the link to verify your account.
      </p>

      <Button variant="outline" className="w-full" disabled={timeToNextResend > 0} onClick={handleResendEmail}>
        {timeToNextResend > 0 ? `Resend Email (${timeToNextResend})` : "Resend Email"}
      </Button>
    </div>
  );
}
