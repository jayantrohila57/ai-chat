"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/components/ui/skeleton";

const DynamicModeToggle = dynamic(() => import("@/core/theme/theme.selector").then((mod) => mod.ModeToggle), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
});

export function ThemeToggle() {
  return <DynamicModeToggle />;
}
