import { render } from "@react-email/render";
import { sendEmail } from "@/core/mail/resend.client";
import { siteConfig } from "@/shared/config/site";
import { DeleteAccountEmail } from "./mail.email-delete-account";
import { ResetPasswordEmail } from "./mail.email-reset-password";
import { VerifyEmail } from "./mail.email-verification";
import { WelcomeEmail } from "./mail.welcome-user";

export interface EmailPropsType {
  user: { name: string; email: string };
  url?: string;
}

export async function sendEmailVerificationEmail({ user, url }: EmailPropsType) {
  const html = await render(<VerifyEmail name={user.name} url={url!} />);
  const text = await render(<VerifyEmail name={user.name} url={url!} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Verify your ${siteConfig.name} email address`,
    html,
    text,
  });
}

export async function sendPasswordResetEmail({ user, url }: EmailPropsType) {
  const html = await render(<ResetPasswordEmail name={user.name} url={url!} />);
  const text = await render(<ResetPasswordEmail name={user.name} url={url!} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Reset your ${siteConfig.name} password`,
    html,
    text,
  });
}

export async function sendWelcomeEmail({ user }: EmailPropsType) {
  const html = await render(<WelcomeEmail name={user.name} />);
  const text = await render(<WelcomeEmail name={user.name} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Welcome to ${siteConfig.name}!`,
    html,
    text,
  });
}

export async function sendDeleteAccountEmail({ user, url }: EmailPropsType) {
  const html = await render(<DeleteAccountEmail name={user.name} url={url!} />);
  const text = await render(<DeleteAccountEmail name={user.name} url={url!} />, {
    plainText: true,
  });

  await sendEmail({
    to: user.email,
    from: `${siteConfig.email.from.name} <${siteConfig.email.from.address}>`,
    subject: `Confirm your ${siteConfig.name} account deletion`,
    html,
    text,
  });
}
