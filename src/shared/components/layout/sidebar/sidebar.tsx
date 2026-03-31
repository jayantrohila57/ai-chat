"use client";

import { LogIn, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/core/auth/auth.client";
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
import { NavArchivedChats, NavRecentChats } from "./sidebar.nav-chats";
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
                <Link href="/" className="truncate font-medium hover:underline">
                  AI Chat App
                </Link>
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
        {isAuthenticated && <NavArchivedChats />}
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-b-xl shadow-sm ">
        <SidebarMenu>
          <Separator className="my-2" />
          <SidebarMenuItem>
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="data-[state=open]:bg-sidebar-accent group data-[state=open]:text-sidebar-accent-foreground"
                    size="lg"
                  >
                    <Link href="/auth/sign-in">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                        <LogIn className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Sign In</span>
                        <span className="truncate text-xs text-muted-foreground font-mono">
                          Access chatting with AI.
                        </span>
                      </div>
                    </Link>
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
