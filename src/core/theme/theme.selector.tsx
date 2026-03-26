"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="group data-[state=on]:hover:bg-transparent size-9 rounded-full transition-all bg-transparent"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <MoonIcon
              size={16}
              className="shrink-0 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100"
              aria-hidden="true"
            />
            <SunIcon
              size={16}
              className="absolute shrink-0 scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0"
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
