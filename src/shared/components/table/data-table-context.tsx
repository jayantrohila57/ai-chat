"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import type { BulkAction } from "./custom-action/bulk-operations.factory";

type FacetOption = {
  label: string;
  value: string;
  color: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface ExtraFilterConfig {
  key: string;
  title: string;
  options: FacetOption[];
}

export interface DataTableContextValue<TData> {
  table: Table<TData>;
  displayKey: keyof TData;
  selectedRows: TData[];
  hasSelectedRows: boolean;
  clearSelection: () => void;

  typeOptions?: FacetOption[];
  statusOptions?: FacetOption[];
  visibilityOptions?: FacetOption[];
  featuredOptions?: FacetOption[];
  deletionOptions?: FacetOption[];
  extraFilters?: ExtraFilterConfig[];

  // URL State & Sync
  filters?: Record<string, string | null>;
  setFilter?: (key: string, value: string | null) => void;
  setSearch?: (q: string) => void;
  clearFilters?: (keysToRemove?: string[]) => void;
  setSorting?: (sortBy: string | null, sortDir: "asc" | "desc" | null) => void;

  bulkActions?: BulkAction<TData>[];
  runBulkAction?: (actionId: string) => void;
  isBulkActionLoading?: boolean;
  rowCount?: number;
}

const DataTableContext = React.createContext<DataTableContextValue<unknown> | null>(null);

export function DataTableProvider<TData>({
  value,
  children,
}: {
  value: DataTableContextValue<TData>;
  children: React.ReactNode;
}) {
  return (
    <DataTableContext.Provider value={value as unknown as DataTableContextValue<unknown>}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<TData>() {
  const ctx = React.useContext(DataTableContext);
  if (!ctx) throw new Error("useDataTableContext must be used within <DataTableProvider />");
  return ctx as DataTableContextValue<TData>;
}
