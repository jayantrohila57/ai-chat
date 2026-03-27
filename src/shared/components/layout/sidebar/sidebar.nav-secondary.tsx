import { HelpCircle, Link, type LucideIcon, MessageCircle, MoreHorizontal, Search, Settings } from "lucide-react";
import { type SettingsTab, useSettingsDialog } from "../../provider/global-modal.provider";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

const items = [
  {
    id: "general",
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    id: "help",
    title: "Get Help",
    url: "#",
    icon: HelpCircle,
  },
] as {
  id: SettingsTab;
  title: string;
  url: string;
  icon: LucideIcon;
}[];
export function NavSecondary() {
  const { openSettings } = useSettingsDialog();
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Help & Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton onClick={() => openSettings(item.id)}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
