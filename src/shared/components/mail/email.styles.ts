import { siteConfig } from "@/shared/config/site";

// Base email styles
export const emailStyles = {
  body: {
    backgroundColor: siteConfig.colors.background,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    margin: 0,
    padding: 0,
    width: "100%",
  },

  container: {
    backgroundColor: "#ffffff",
    padding: "32px 24px",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "40px auto",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },

  heading: {
    color: siteConfig.colors.text,
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 16px 0",
    lineHeight: "1.2",
  },

  text: {
    color: siteConfig.colors.text,
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
  },

  mutedText: {
    color: siteConfig.colors.textMuted,
    fontSize: "14px",
    lineHeight: "1.4",
    margin: "0 0 16px 0",
  },

  button: {
    backgroundColor: siteConfig.colors.primary,
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "16px",
    margin: "16px 0",
  },

  successButton: {
    backgroundColor: siteConfig.colors.success,
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "16px",
    margin: "16px 0",
  },

  warningButton: {
    backgroundColor: siteConfig.colors.warning,
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "16px",
    margin: "16px 0",
  },

  errorButton: {
    backgroundColor: siteConfig.colors.error,
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "16px",
    margin: "16px 0",
  },

  footer: {
    borderTop: `1px solid #e5e7eb`,
    paddingTop: "24px",
    marginTop: "32px",
    fontSize: "12px",
    color: siteConfig.colors.textMuted,
    textAlign: "center" as const,
  },

  footerLink: {
    color: siteConfig.colors.primary,
    textDecoration: "underline",
  },
};

// Email content helpers
export const emailContent = {
  greeting: (name: string) => `Hello ${name},`,

  signOff: () => `Best regards,\nThe ${siteConfig.name} Team`,

  securityNotice: () =>
    "If you didn't request this action, please ignore this email or contact our support team immediately.",

  linkExpiry: () => "This link will expire in 24 hours for security reasons.",

  supportInfo: () =>
    `If you have any questions, please contact our support team at ${siteConfig.contact.supportEmail} or visit ${siteConfig.urls.support}.`,

  companyInfo: () =>
    `${siteConfig.legal.companyName}\n${siteConfig.contact.address.line1}\n${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.postalCode}\n${siteConfig.contact.address.country}`,
};
