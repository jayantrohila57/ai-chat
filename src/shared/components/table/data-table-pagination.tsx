"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useTableUrlSync } from "@/shared/utils/hooks/use-table-url-sync";
import { useDataTableContext } from "./data-table-context";

export function DataTablePagination<TData>() {
  const { table, rowCount } = useDataTableContext<TData>();
  const { setPagination } = useTableUrlSync();

  const handlePageChange = (page: number) => {
    table.setPageIndex(page);
    setPagination(page + 1, table.getState().pagination.pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    table.setPageSize(size);
    setPagination(1, size); // Reset to page 1 when size changes
  };

  const pagination = table.getState().pagination;
  const total = rowCount ?? table.getFilteredRowModel().rows.length;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-row items-center justify-between w-full h-full">
      <div className="flex justify-center items-center px-4 h-full border-r">
        <div className="text-muted-foreground flex-1 text-sm">
          {total > 0 ? `Showing ${start}-${end} of ${total} items` : "No items to display"}
        </div>
      </div>
      <div className="flex items-center h-full">
        <div className="flex justify-center items-center px-4 h-full border-l">
          <div className="flex items-center space-x-2">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                handlePageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[150px] bg-transparent">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize} Rows per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center items-center px-4 h-full border-l">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        </div>
        <div className="flex items-center h-full">
          <div className="flex justify-center items-center px-4 h-full border-l">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
          </div>
          <div className="flex justify-center items-center px-4 h-full border-l">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
          </div>
          <div className="flex justify-center items-center px-4 h-full border-l">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
          </div>
          <div className="flex justify-center items-center px-4 h-full border-l">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
