import { Link, type LucideIcon, MessageCircle, MoreHorizontal } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

const chats = [
  {
    name: "Chat 1",
    url: "/chat/1",
  },
  {
    name: "Chat 2",
    url: "/chat/2",
  },
];
export function NavRecentChats() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent chats</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats?.map((chat) => (
            <SidebarMenuItem key={chat.name}>
              <SidebarMenuButton>
                <MessageCircle className="size-4" />
                <span>{chat.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
