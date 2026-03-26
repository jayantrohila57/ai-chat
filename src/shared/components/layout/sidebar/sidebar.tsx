"use client";

import { Badge } from "../../ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "../../ui/sidebar";
import { NavMain } from "./sidebar.navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="p-2 h-12 group-data-[collapsible=icon]:p-2!  group-data-[collapsible=icon]:h-12! w-full group-data-[collapsible=icon]:w-12!"
            >
              <div className="flex items-center gap-2  w-full">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SidebarTrigger />
                </div>
                <div className="flex flex-row items-center text-left text-sm w-full justify-between leading-tight">
                  <span className="truncate text-xl font-semibold">{"AI Chat App v1"}</span>
                  <Badge variant="outline" className="text-xs">
                    Starter
                  </Badge>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
