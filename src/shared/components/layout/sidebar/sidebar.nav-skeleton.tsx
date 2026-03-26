import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";

const SECTION_CONFIG = [1, 4, 3, 2] as const;
/** Fixed widths for skeleton items (deterministic to avoid hydration mismatch). */
const SKELETON_WIDTHS = ["70%", "85%", "60%", "75%", "65%", "80%", "55%", "72%", "68%", "90%"] as const;

function getFlatIndex(sectionIndex: number, itemIndex: number): number {
  return SECTION_CONFIG.slice(0, sectionIndex).reduce((a, c) => a + c, 0) + itemIndex;
}

export function SidebarNavSkeleton() {
  return (
    <>
      {SECTION_CONFIG.map((itemCount, sectionIndex) => (
        <SidebarGroup key={sectionIndex} className="border-b p-2 min-h-16 px-4">
          <SidebarGroupLabel>
            <Skeleton className="h-4 w-24" />
          </SidebarGroupLabel>
          <SidebarMenu>
            {Array.from({ length: itemCount }).map((_, itemIndex) => {
              const width = SKELETON_WIDTHS[getFlatIndex(sectionIndex, itemIndex) % SKELETON_WIDTHS.length];
              return (
                <SidebarMenuItem key={itemIndex}>
                  <SidebarMenuSkeleton showIcon width={width} />
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
