"use client";

import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/utils/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { useSidebarSections } from "./sidebar.nav-items";
import { SidebarNavSkeleton } from "./sidebar.nav-skeleton";

function useIsActive() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (url: string, strict = false) => {
    const [targetPath, targetQuery = ""] = url.split("?");
    // strict match: exact path only
    if (strict) return pathname === targetPath;
    // relaxed match: match if pathname ends with the subpath (not just prefix)
    if (!pathname.endsWith(targetPath)) return false;
    if (targetQuery) {
      const query = new URLSearchParams(targetQuery);
      for (const [key, value] of query.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
    }
    return true;
  };
}

export function NavMain() {
  const isActive = useIsActive();
  const collapsibleId = useId();
  const { sections, isPending } = useSidebarSections();

  const [openStates, setOpenStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections?.forEach((section, sectionIndex) => {
      section.section.forEach((item, itemIndex) => {
        const itemId = `${collapsibleId}-${sectionIndex}-${itemIndex}`;
        const hasActiveChild = item.items?.some((sub) => isActive(sub.url, true)) || false;
        const isItemActive = isActive(item.url, true) || hasActiveChild;
        initial[itemId] = !!isItemActive;
      });
    });
    return initial;
  });

  if (isPending) {
    return <SidebarNavSkeleton />;
  }

  return sections && sections?.length > 0
    ? sections.map((section, sectionIndex) => (
        <SidebarGroup key={sectionIndex} className="border-b p-2 min-h-16 px-4">
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu key={sectionIndex}>
            {section.section.map((item, itemIndex) => {
              const hasChildren = !!item.items?.length;
              const hasActiveChild = item.items?.some((sub) => isActive(sub.url, true)) || false;
              const isItemActive = isActive(item.url, true) || hasActiveChild;
              const itemId = `${collapsibleId}-${sectionIndex}-${itemIndex}`;

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url as Route}>
                      <SidebarMenuButton isActive={isItemActive} tooltip={item.title}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              }

              const open = !!openStates[itemId];

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  open={open}
                  onOpenChange={(next) => setOpenStates((prev) => ({ ...prev, [itemId]: next }))}
                  id={itemId}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isItemActive}
                        tooltip={item.title}
                        data-active={isItemActive ? "true" : "false"}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="truncate">{item.title}</span>
                        <ChevronRight
                          className={cn("ml-auto h-4 w-4 transition-transform duration-200", open && "rotate-90")}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubItemActive = isActive(subItem.url, true);
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                                <Link href={subItem.url as Route}>
                                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))
    : null;
}
