import { Resend } from "resend";
import { serverEnv } from "@/shared/config/env.server";
import { siteConfig } from "@/shared/config/site";

const mail = new Resend(serverEnv.RESEND_API_KEY);

export default mail;

export function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}) {
  return mail.emails.send({
    from: from || `${siteConfig.email.from.name} <${serverEnv.RESEND_FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
}
