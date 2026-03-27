"use client";

import {
  type LucideIcon,
  CreditCard,
  HelpCircle,
  Monitor,
  Receipt,
  Settings,
  Shield,
  UserIcon,
  Wallet,
} from "lucide-react";
import React, { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { useSession } from "@/core/auth/auth.client";
import { GeneralSettings } from "@/module/account/account.general";
import { HelpSettings } from "@/module/account/account.help";
import { SessionManagement } from "@/module/account/account.session";
import { AccountSettings } from "@/module/account/account.settings";
import {
  BillingOrdersSettings,
  BillingPaymentsSettings,
  BillingSubscriptionSettings,
  BillingUsageSettings,
} from "@/module/billing/billing.customer";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export type SettingsTab =
  | "general"
  | "subscription"
  | "usage"
  | "payments"
  | "orders"
  | "sessions"
  | "account"
  | "help";

type SettingsContextType = {
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
};

type NavItem = {
  id: SettingsTab;
  name: string;
  icon: LucideIcon;
  description: string;
  requiresSession?: boolean;
  group: "workspace" | "billing" | "account" | "support";
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettingsDialog() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettingsDialog must be used inside GlobalModalProvider");
  return ctx;
}

const navItems: NavItem[] = [
  {
    id: "general",
    name: "General",
    icon: Settings,
    description: "General settings for the app",
    group: "workspace",
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: CreditCard,
    description: "Current plan, renewal state, and subscription actions",
    requiresSession: true,
    group: "billing",
  },
  {
    id: "usage",
    name: "Usage",
    icon: Wallet,
    description: "Credits, token usage, and ledger activity",
    requiresSession: true,
    group: "billing",
  },
  {
    id: "payments",
    name: "Payments",
    icon: Monitor,
    description: "Normalized payment events and billing activity",
    requiresSession: true,
    group: "billing",
  },
  {
    id: "orders",
    name: "Orders",
    icon: Receipt,
    description: "Subscription checkout and order lifecycle history",
    requiresSession: true,
    group: "billing",
  },
  {
    id: "account",
    name: "Account",
    icon: UserIcon,
    description: "Profile, plan, wallet, and account details",
    requiresSession: true,
    group: "account",
  },
  {
    id: "sessions",
    name: "Sessions",
    icon: Shield,
    description: "Session management for the app",
    requiresSession: true,
    group: "account",
  },
  {
    id: "help",
    name: "Get Help",
    icon: HelpCircle,
    description: "Help resources, support, and documentation",
    group: "support",
  },
];

const groupLabels: Record<NavItem["group"], string> = {
  workspace: "Workspace",
  billing: "Billing",
  account: "Account",
  support: "Support",
};

export function GlobalModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<SettingsTab>("general");
  const { data: session } = useSession();
  const isSessionValid = !!session;

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => !item.requiresSession || isSessionValid),
    [isSessionValid],
  );

  function openSettings(targetTab: SettingsTab = "general") {
    setTab(targetTab);
    setOpen(true);
  }

  function closeSettings() {
    setOpen(false);
  }

  const activeItem = visibleNavItems.find((item) => item.id === tab) ?? visibleNavItems[0];

  return (
    <SettingsContext.Provider value={{ openSettings, closeSettings }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[calc(100vh-8rem)] max-w-7xl overflow-hidden p-0">
          <DialogTitle className="sr-only">Settings</DialogTitle>
          <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>

          <SidebarProvider className="items-start">
            <Sidebar collapsible="none" variant="inset" className="hidden md:flex">
              <SidebarContent className="pt-2">
                {(["workspace", "billing", "account", "support"] as NavItem["group"][]).map((group) => {
                  const items = visibleNavItems.filter((item) => item.group === group);
                  if (items.length === 0) return null;

                  return (
                    <SidebarGroup key={group}>
                      <SidebarGroupLabel>{groupLabels[group]}</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {items.map((item) => (
                            <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton isActive={tab === item.id} onClick={() => setTab(item.id)}>
                                <item.icon />
                                <span>{item.name}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  );
                })}
              </SidebarContent>
            </Sidebar>

            <SidebarInset>
              <Card className="h-full w-full pr-2">
                <CardHeader className="h-16">
                  <CardTitle className="text-3xl font-semibold">{activeItem?.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{activeItem?.description}</CardDescription>
                </CardHeader>
                <CardContent className="bg-background h-[calc(100vh-14.5rem)] w-full overflow-hidden rounded-2xl p-0">
                  <ScrollArea className="h-[calc(100vh-14.6rem)] w-full overflow-y-auto rounded-2xl p-4">
                    {activeItem ? renderSettingsContent(activeItem.id, isSessionValid) : null}
                  </ScrollArea>
                </CardContent>
              </Card>
            </SidebarInset>
          </SidebarProvider>
        </DialogContent>
      </Dialog>
    </SettingsContext.Provider>
  );
}

function renderSettingsContent(tab: SettingsTab, isSessionValid: boolean) {
  switch (tab) {
    case "general":
      return <GeneralSettings />;

    case "subscription":
      if (!isSessionValid) return null;
      return <BillingSubscriptionSettings />;

    case "usage":
      if (!isSessionValid) return null;
      return <BillingUsageSettings />;

    case "payments":
      if (!isSessionValid) return null;
      return <BillingPaymentsSettings />;

    case "orders":
      if (!isSessionValid) return null;
      return <BillingOrdersSettings />;

    case "sessions":
      if (!isSessionValid) return null;
      return <SessionManagement />;

    case "account":
      if (!isSessionValid) return null;
      return <AccountSettings />;

    case "help":
      return <HelpSettings />;

    default:
      return null;
  }
}
