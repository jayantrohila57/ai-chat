import { clientEnv } from "./env.client";

export const siteConfig = {
  name: "AI Chat App v1",
  domain: "localhost",
  description:
    "AI Chat App v1 is a clean AI chat starter built on Next.js, Better Auth, tRPC, Drizzle, uploads, and rate limiting.",
  contact: {
    email: "support@aichat.local",
    supportEmail: "support@aichat.local",
    noreplyEmail: "noreply@aichat.local",
    phone: "+1 (555) 000-0000",
    address: {
      line1: "Starter Workspace",
      line2: "AI Team",
      city: "Remote",
      state: "NA",
      postalCode: "00000",
      country: "Internet",
    },
  },
  urls: {
    base: clientEnv.NEXT_PUBLIC_BASE_URL,
    website: clientEnv.NEXT_PUBLIC_BASE_URL,
    support: `${clientEnv.NEXT_PUBLIC_BASE_URL}/auth`,
    privacy: `${clientEnv.NEXT_PUBLIC_BASE_URL}/privacy`,
    terms: `${clientEnv.NEXT_PUBLIC_BASE_URL}/terms`,
  },
  email: {
    from: {
      name: "AI Chat App v1",
      address: "noreply@aichat.local",
    },
    support: {
      name: "AI Chat App v1 Support",
      address: "support@aichat.local",
    },
    replyTo: "support@aichat.local",
    footer: {
      company: "AI Chat App v1",
      address: "Starter Workspace, Remote, Internet",
      unsubscribe: "Starter emails are only here to support authentication flows.",
      privacy: "Privacy",
      terms: "Terms",
    },
  },
  colors: {
    primary: "#2563eb",
    secondary: "#0f172a",
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
    info: "#0891b2",
    background: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
  },
  legal: {
    companyName: "AI Chat App v1",
    taxId: "starter",
    lastUpdated: "March 2026",
  },
};

export const site = {
  name: siteConfig.name,
  address: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.postalCode}`,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  description: siteConfig.description,
  url: clientEnv.NEXT_PUBLIC_BASE_URL,
  legalUpdate: siteConfig.legal.lastUpdated,
  apiTitle: `${siteConfig.name} API`,
  apiVersion: "1.0.0",
  socialLinks: [],
};

export type SiteConfig = typeof siteConfig;
