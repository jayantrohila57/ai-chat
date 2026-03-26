"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useTableUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // Always reset to page 1 when filters/search change, unless page is explicitly provided
      if (!params.page && !Object.keys(params).every((k) => k === "page" || k === "limit")) {
        current.delete("page");
      }

      const query = current.toString();
      const url = `${pathname}${query ? `?${query}` : ""}` as Route;
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setFilter = useCallback(
    (key: string, value: string | null | undefined) => {
      updateUrl({ [key]: value });
    },
    [updateUrl],
  );

  const setPagination = useCallback(
    (page: number, limit: number) => {
      updateUrl({ page, limit });
    },
    [updateUrl],
  );

  const setSearch = useCallback(
    (q: string) => {
      updateUrl({ q });
    },
    [updateUrl],
  );

  const setSorting = useCallback(
    (sortBy: string | null | undefined, sortDir: "asc" | "desc" | null | undefined) => {
      updateUrl({
        sortBy,
        sortDir,
      });
    },
    [updateUrl],
  );

  const clearFilters = useCallback(
    (keysToRemove?: string[]) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const defaultKeys = [
        "status",
        "visibility",
        "displayType",
        "color",
        "contentType",
        "isFeatured",
        "deleted",
        "categorySlug",
        "subcategorySlug",
        "stockStatus",
        "hasReserved",
        "hasIncoming",
        "status",
        "carrier",
        "paymentStatus",
        "provider",
        "role",
        "banned",
        "emailVerified",
        "pageFilter",
        "section",
        "isActive",
        "q",
        "page",
        "sortBy",
        "sortDir",
      ];
      const keys = keysToRemove && keysToRemove.length > 0 ? keysToRemove : defaultKeys;
      for (const key of keys) {
        current.delete(key);
      }

      const query = current.toString();
      const url = `${pathname}${query ? `?${query}` : ""}` as Route;
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return {
    setFilter,
    setPagination,
    setSearch,
    setSorting,
    clearFilters,
  };
}
