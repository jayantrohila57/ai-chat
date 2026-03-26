import { LayoutDashboard, type LucideIcon, Sparkles } from "lucide-react";
import { useSession } from "@/core/auth/auth.client";
import { normalizeRole, roleCanAccessStudio } from "@/core/auth/auth.roles";
import { PATH } from "@/shared/config/routes";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavSection {
  title: string;
  section: NavItem[];
}

export function useSidebarSections(): { sections: NavSection[]; isPending: boolean } {
  const { data: session, isPending } = useSession();
  const role = normalizeRole(session?.user?.role);
  const canSeeStudio = roleCanAccessStudio(role);

  if (isPending || !canSeeStudio) {
    return { sections: [], isPending };
  }

  return {
    sections: [
      {
        title: "Workspace",
        section: [
          {
            title: "Overview",
            url: PATH.STUDIO.ROOT,
            icon: LayoutDashboard,
          },
        ],
      },
      {
        title: "Status",
        section: [
          {
            title: "Starter State",
            url: PATH.STUDIO.ROOT,
            icon: Sparkles,
          },
        ],
      },
    ],
    isPending: false,
  };
}
