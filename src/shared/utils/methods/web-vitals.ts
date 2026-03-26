"use client";

import { useReportWebVitals } from "next/web-vitals";
import { debugLog } from "@/shared/utils/lib/logger.utils";

export function WebVitals() {
  useReportWebVitals((metric) => {
    debugLog("WEB_VITALS", metric);
  });
  return null;
}
