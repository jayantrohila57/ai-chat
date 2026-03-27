import { CreditCard, HelpCircle, type LucideIcon, Settings } from "lucide-react";
import { type SettingsTab, useSettingsDialog } from "../../provider/global-modal.provider";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

const items = [
  {
    id: "general",
    title: "Settings",
    icon: Settings,
  },
  {
    id: "subscription",
    title: "Subscription",
    icon: CreditCard,
  },
  {
    id: "help",
    title: "Get Help",
    icon: HelpCircle,
  },
] as {
  id: SettingsTab;
  title: string;
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
