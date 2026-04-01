import { CHAT_ARCHIVED_THREADS_LIMIT, CHAT_RECENT_THREADS_LIMIT } from "@/module/chat/chat.data";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";

/** Fixed widths for skeleton items (deterministic to avoid hydration mismatch). */
const SKELETON_WIDTHS = ["70%", "85%", "60%", "75%", "65%", "80%", "55%", "72%", "68%", "90%"] as const;

function getSkeletonWidth(index: number): string {
  return SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];
}

interface SidebarNavSkeletonProps {
  archived?: boolean;
}

export function SidebarNavSkeleton({ archived = false }: SidebarNavSkeletonProps) {
  // Use same limits as actual data to minimize layout shift
  const itemCount = archived ? CHAT_ARCHIVED_THREADS_LIMIT : CHAT_RECENT_THREADS_LIMIT;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden border-b p-2 min-h-16 px-4">
      <SidebarGroupLabel>
        <Skeleton className="h-4 w-24" />
      </SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: itemCount }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
        {/* Add one more for the "...more" button placeholder */}
        <SidebarMenuItem>
          <Skeleton className="h-4 w-16" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
