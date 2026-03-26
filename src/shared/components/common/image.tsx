"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import * as React from "react";
import { getImageSrc, PLACEHOLDER_IMAGE } from "@/shared/utils/lib/image.utils";
import { cn } from "@/shared/utils/lib/utils";

interface BlurImageProps extends Omit<ComponentProps<typeof Image>, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

function normalizeSrc(value?: string | null) {
  const safe = getImageSrc(value);
  if (!safe) return null;

  // Absolute URL
  if (/^https?:\/\//.test(safe)) return safe;

  // Root-relative
  if (safe.startsWith("/")) return safe;

  // If it's something like "uploads/image.jpg"
  return `/${safe}`;
}

const safeFallback = (s?: string) => (s && s.trim() ? s : PLACEHOLDER_IMAGE);

export function BlurImage({ className, alt, src, fallbackSrc = PLACEHOLDER_IMAGE, ...props }: BlurImageProps) {
  const resolvedFallback = safeFallback(fallbackSrc);
  const safeInitialSrc = normalizeSrc(src) ?? resolvedFallback;

  const [currentSrc, setCurrentSrc] = React.useState(() => safeInitialSrc);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const normalized = normalizeSrc(src) ?? resolvedFallback;
    setCurrentSrc(normalized);
    setLoading(false);
  }, [src, resolvedFallback]);

  const handleError = () => {
    if (currentSrc !== resolvedFallback) {
      setCurrentSrc(resolvedFallback);
    }
    setLoading(false);
  };

  const srcToUse = currentSrc ?? resolvedFallback;

  return (
    <Image
      {...props}
      alt={alt ?? ""}
      src={srcToUse}
      className={cn(
        className,
        "transition-all duration-300",
        isLoading ? "animate-shimmer blur-xs" : "blur-0",
        currentSrc === fallbackSrc && "bg-input/30",
      )}
      onLoad={() => setLoading(false)}
      onError={handleError}
    />
  );
}
