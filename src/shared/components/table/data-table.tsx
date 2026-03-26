"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type ComponentType, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTableUrlSync } from "@/shared/utils/hooks/use-table-url-sync";
import { EmptyState } from "../common/empty-state";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import type { BulkAction } from "./custom-action/bulk-operations.factory";
import { useBulkActions } from "./custom-action/bulk-operations.factory";
import { DataTableProvider, type ExtraFilterConfig } from "./data-table-context";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  typeOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  statusOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  visibilityOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  featuredOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  extraFilters?: ExtraFilterConfig[];
  displayKey: keyof TData;
  bulkActions?: BulkAction<TData>[];
  deletionOptions?: {
    label: string;
    value: string;
    color: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  pageCount?: number;
  rowCount?: number;
  initialPageIndex?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDir?: "asc" | "desc";
  emptyState?: {
    title: string;
    description: string;
    icons?: LucideIcon[];
    action: {
      label: string;
      url: string;
    };
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  typeOptions,
  statusOptions,
  visibilityOptions,
  featuredOptions,
  deletionOptions,
  extraFilters,
  displayKey,
  bulkActions,
  pageCount,
  rowCount,
  initialPageIndex,
  initialPageSize,
  initialSortBy,
  initialSortDir,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSortingState] = useState<SortingState>(() => {
    if (initialSortBy && initialSortDir) {
      return [{ id: initialSortBy, desc: initialSortDir === "desc" }];
    }
    return [];
  });

  const { setFilter, setSearch, clearFilters, setSorting } = useTableUrlSync();
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => {
    const filters: Record<string, string | null> = {};
    const baseKeys = ["status", "visibility", "displayType", "color", "contentType", "isFeatured", "deleted"];
    const extraKeys = extraFilters?.map((f) => f.key) ?? [];
    const keys = [...baseKeys, ...extraKeys];
    keys.forEach((key) => {
      filters[key] = searchParams.get(key);
    });
    return filters;
  }, [searchParams, extraFilters]);

  const pagination = useMemo(
    () => ({
      pageIndex: initialPageIndex ?? Math.max(0, parseInt(searchParams.get("page") ?? "1", 10) - 1),
      pageSize: initialPageSize ?? parseInt(searchParams.get("limit") ?? "20", 10),
    }),
    [initialPageIndex, initialPageSize, searchParams],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount: pageCount ?? -1,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const selectedRows = useMemo(() => table.getSelectedRowModel().rows.map((row) => row.original), [table]);
  const hasSelectedRows = selectedRows.length > 0;

  const bulk = useBulkActions<TData>({
    actions: bulkActions ?? [],
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
    },
  });

  const [confirmationData, setConfirmationData] = useState<{
    actionId: string;
    rows: TData[];
    message: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    actionLabel: string;
  } | null>(null);

  const runBulkAction = (actionId: string) => {
    const action = bulkActions?.find((a) => a.id === actionId);
    if (!action) return;
    if (action.requiresConfirmation) {
      const message =
        action.confirmationMessage?.(selectedRows) ??
        `Are you sure you want to ${action.label.toLowerCase()} ${selectedRows.length} item(s)?`;
      setConfirmationData({
        actionId,
        rows: selectedRows,
        message,
        variant: action.variant,
        actionLabel: action.label,
      });
      return;
    }
    void bulk.runBulkAction(actionId, selectedRows);
  };

  return (
    <DataTableProvider
      value={{
        table,
        displayKey,
        selectedRows,
        hasSelectedRows,
        clearSelection: () => table.toggleAllRowsSelected(false),
        typeOptions,
        statusOptions,
        visibilityOptions,
        featuredOptions,
        deletionOptions,
        extraFilters,
        filters: currentFilters,
        setFilter,
        setSearch,
        clearFilters,
        setSorting,
        bulkActions,
        runBulkAction: bulkActions && bulkActions.length > 0 ? runBulkAction : undefined,
        isBulkActionLoading: bulk.isBulkActionLoading,
        rowCount: rowCount ?? data.length,
      }}
    >
      <Card className="bg-transparent justify-between h-full p-0 gap-0 shadow-none border-0 ring-0 ">
        <CardContent className="p-0 border-b">
          <DataTableToolbar />
        </CardContent>
        <CardContent className="p-0 relative border-b h-[calc(100vh-17.6rem)] w-full overflow-auto">
          <Table>
            <TableHeader className="sticky bg-background/50 backdrop-blur-md top-0 z-10 rounded-none">
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-[60vh] text-center">
                    <EmptyState
                      title={emptyState?.title ?? "No Data Found"}
                      description={
                        emptyState?.description ?? "You don't have any data yet. Data helps you organize your data."
                      }
                      icons={emptyState?.icons}
                      action={{
                        label: emptyState?.action?.label ?? "Create",
                        url: emptyState?.action?.url ?? "/",
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter className="p-0 m-0">
              {table?.getFooterGroups()?.length
                ? table?.getFooterGroups()?.map((footerGroup) => (
                    <TableRow key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                          {flexRender(header.column.columnDef.footer, header.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="w-full h-16 p-0">
          <DataTablePagination />
        </CardFooter>
      </Card>
      <AlertDialog open={!!confirmationData} onOpenChange={(open) => !open && setConfirmationData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmationData?.variant === "destructive" ? "⚠️ " : ""}
              {confirmationData?.actionLabel || "Confirm Action"}
            </AlertDialogTitle>
            <AlertDialogDescription>{confirmationData?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{"Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmationData?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={() => {
                if (confirmationData) {
                  void bulk.runBulkAction(confirmationData.actionId, confirmationData.rows);
                  setConfirmationData(null);
                }
              }}
            >
              {confirmationData?.actionLabel || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DataTableProvider>
  );
}
