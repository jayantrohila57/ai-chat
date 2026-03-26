"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type z from "zod/v3";
import { requestPasswordReset } from "@/core/auth/auth.client";
import Form from "@/shared/components/form/form";
import { Separator } from "@/shared/components/ui/separator";
import { AuthSchema } from "./auth-schema";

type FormValues = z.infer<typeof AuthSchema.FORGOT_PASSWORD.INPUT>;

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      await requestPasswordReset(
        {
          ...data,
          redirectTo: "/auth/reset-password",
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to send password reset email");
          },
          onSuccess: () => {
            toast.success("Password reset email sent");
          },
        },
      );
    });
  }

  return (
    <Form
      defaultValues={{ email: "" }}
      schema={AuthSchema.FORGOT_PASSWORD.INPUT}
      onSubmitAction={onSubmit}
      className="grid h-auto grid-cols-1 gap-4 p-1"
    >
      <Form.Field
        {...{
          name: "email",
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        }}
      />
      <Separator />
      <Form.Submit disabled={pending} isLoading={pending} />
    </Form>
  );
}
