"use client";

import { type LucideIcon, Monitor, Settings, Shield, UserIcon } from "lucide-react";
import React, { createContext, type ReactNode, useContext, useState } from "react";
import { useSession } from "@/core/auth/auth.client";
import { GeneralSettings } from "@/module/account/account.general";
import { HelpSettings } from "@/module/account/account.help";
import { SessionManagement } from "@/module/account/account.session";
import { AccountSettings } from "@/module/account/account.settings";
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

export type SettingsTab = "general" | "sessions" | "account" | "help";

type SettingsContextType = {
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettingsDialog() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettingsDialog must be used inside GlobalModalProvider");
  return ctx;
}

const data = {
  nav: [
    {
      id: "general",
      name: "General",
      icon: Settings,
      description: "General settings for the app",
    },
    {
      id: "account",
      name: "Account",
      icon: UserIcon,
      description: "Account settings for the app",
    },
    {
      id: "sessions",
      name: "Sessions",
      icon: Monitor,
      description: "Session management for the app",
    },
    {
      id: "help",
      name: "Get Help",
      icon: Shield,
      description: "Help resources, support, and documentation",
    },
  ] as {
    id: SettingsTab;
    name: string;
    icon: LucideIcon;
    description: string;
  }[],
};

export function GlobalModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<SettingsTab>("general");
  const { data: session } = useSession();
  const isSessionValid = !!session;
  function openSettings(targetTab: SettingsTab = "general") {
    setTab(targetTab);
    setOpen(true);
  }

  function closeSettings() {
    setOpen(false);
  }

  const activeItem = data.nav.find((item) => item.id === tab);

  return (
    <SettingsContext.Provider value={{ openSettings, closeSettings }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl p-0 overflow-hidden w-full h-[calc(100vh-8rem)]">
          <DialogTitle className="sr-only">Settings</DialogTitle>
          <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>

          <SidebarProvider className="items-start">
            {/* Sidebar */}
            <Sidebar collapsible="none" variant="inset" className="hidden md:flex">
              <SidebarContent className="pt-2">
                <SidebarGroup>
                  <SidebarGroupLabel>Menu</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {data.nav.map((item) => {
                        if (item.id === "sessions" && !session) return null;
                        if (item.id === "account" && !session) return null;
                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton isActive={tab === item.id} onClick={() => setTab(item.id)}>
                              <item.icon />
                              <span>{item.name}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            {/* Content */}
            <SidebarInset>
              <Card className="h-full w-full pr-2">
                <CardHeader className="h-16">
                  <CardTitle className="text-3xl font-semibold">{activeItem?.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{activeItem?.description}</CardDescription>
                </CardHeader>
                <CardContent className="bg-background h-[calc(100vh-14.5rem)] overflow-hidden w-full rounded-2xl p-0">
                  <ScrollArea className="h-[calc(100vh-14.6rem)] w-full overflow-y-auto  rounded-2xl  p-4">
                    {activeItem && renderSettingsContent(activeItem.id, isSessionValid)}
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
