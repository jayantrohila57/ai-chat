import { MessageCircle } from "lucide-react";
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
        <NavMain />
        <NavRecentChats />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-b-xl shadow-sm ">
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
          <Separator className="my-2" />
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
