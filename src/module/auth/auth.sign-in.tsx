"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import type z from "zod/v3";
import { signIn } from "@/core/auth/auth.client";
import Form from "@/shared/components/form/form";
import { PATH } from "@/shared/config/routes";
import { AuthSchema } from "./auth-schema";

type FormValues = z.infer<typeof AuthSchema.SIGN_IN.INPUT>;

export function SignInForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const toastId = toast.loading("Signing In");
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe === "true",
      });
      if (result?.error) {
        if (result.error.code === "EMAIL_NOT_VERIFIED") {
          router.push(`${PATH.AUTH.VERIFY_EMAIL}?email=${data.email}`);
        }
        toast.error(result.error.message || "Failed to sign in");
      } else {
        toast.success("Signed in successfully!", { id: toastId });
        router.push(PATH.ROOT);
      }
    });
  };

  return (
    <Form
      defaultValues={{ email: "", password: "", rememberMe: "true" }}
      schema={AuthSchema.SIGN_IN.INPUT}
      onSubmitAction={onSubmit}
      className="grid h-auto grid-cols-1 gap-4 px-1"
    >
      <Form.Field
        {...{
          name: "email",
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        }}
      />
      <Form.Field
        {...{
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "********",
        }}
      />
      <Form.Field
        {...{
          name: "rememberMe",
          label: "Remember Me",
          type: "checkbox",
          options: [
            {
              label: "You can stay signed in for longer.",
              value: "true",
            },
          ],
        }}
      />
      <Form.Submit disabled={pending} isLoading={pending} />
    </Form>
  );
}
