export { emailContent, emailStyles } from "./email.styles";
export { DeleteAccountEmail } from "./mail.email-delete-account";
export { ResetPasswordEmail } from "./mail.email-reset-password";
export { VerifyEmail } from "./mail.email-verification";
export type { EmailPropsType } from "./mail.methods";
export {
  sendDeleteAccountEmail,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "./mail.methods";
export { WelcomeEmail } from "./mail.welcome-user";
