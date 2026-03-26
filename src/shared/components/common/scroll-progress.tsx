"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/lib/utils";

export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className={cn("fixed top-0 left-0 z-[9999] h-[1px] w-full", className)}>
      <div className="bg-primary h-full transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}
