"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent group data-[state=open]:text-sidebar-accent-foreground"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <MoonIcon
                className="shrink-0 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100"
                aria-hidden="true"
              />
              <SunIcon
                className="absolute shrink-0 scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0"
                aria-hidden="true"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Toggle Theme</span>
            </div>
          </SidebarMenuButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
