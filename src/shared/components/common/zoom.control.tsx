"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";

const MIN_ZOOM = 50;
const MAX_ZOOM = 150;
const STEP = 10;

export function ZoomControl() {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const stored = localStorage.getItem("app-zoom");
    if (stored) {
      applyZoom(Number(stored));
      setZoom(Number(stored));
    }
  }, []);

  function applyZoom(value: number) {
    document.documentElement.style.zoom = `${value}%`;
    localStorage.setItem("app-zoom", String(value));
  }

  function increase() {
    const newZoom = Math.min(MAX_ZOOM, zoom + STEP);
    setZoom(newZoom);
    applyZoom(newZoom);
  }

  function decrease() {
    const newZoom = Math.max(MIN_ZOOM, zoom - STEP);
    setZoom(newZoom);
    applyZoom(newZoom);
  }

  return (
    <div className="flex items-center gap-4">
      <Button size="icon" variant="outline" onClick={decrease}>
        <Minus />
      </Button>

      <div className="w-16 text-center font-medium">{zoom}%</div>

      <Button size="icon" variant="outline" onClick={increase}>
        <Plus />
      </Button>
    </div>
  );
}
