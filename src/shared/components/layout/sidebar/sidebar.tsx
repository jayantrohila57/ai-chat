"use client";

import { LogIn, MessageCircle } from "lucide-react";
import { getClientSession, useSession } from "@/core/auth/auth.client";
import { getServerSession } from "@/core/auth/auth.server";
import { ModeToggle } from "@/core/theme/theme.selector";
import { Separator } from "../../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../../ui/sidebar";
import { UserDropdown } from "../user/nav-user";
import { NavRecentChats } from "./sidebar.nav-chats";
import { NavSecondary } from "./sidebar.nav-secondary";
import { NavMain } from "./sidebar.navigation";

export function AppSidebar() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="bg-background rounded-t-xl shadow-sm ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent group data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                <MessageCircle className="size-4 fill-current block group-data-[state=collapsed]:hidden" />
                <SidebarTrigger asChild className="size-4 hidden group-data-[state=collapsed]:block" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">AI Chat App</span>
                <span className="truncate text-xs text-muted-foreground font-mono">v1.0.0</span>
              </div>
              <SidebarTrigger asChild />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="h-auto bg-background shadow-sm">
        {isAuthenticated && <NavMain />}
        {isAuthenticated && <NavRecentChats />}
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-b-xl shadow-sm ">
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
          <Separator className="my-2" />
          <SidebarMenuItem>
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent group data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                      <LogIn className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Sign In</span>
                      <span className="truncate text-xs text-muted-foreground font-mono">Access chatting with AI.</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
