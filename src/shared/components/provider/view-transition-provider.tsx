"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    if (!document.startViewTransition) return;
  }, [pathname]);

  return <>{children}</>;
}
