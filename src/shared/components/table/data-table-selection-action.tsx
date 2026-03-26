"use client";

import { CheckSquare, Loader2, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Separator } from "../ui/separator";
import { useDataTableContext } from "./data-table-context";

export function EnhancedDataTableSelectedActions<TData>() {
  const {
    selectedRows,
    hasSelectedRows,
    clearSelection,
    displayKey,
    bulkActions = [],
    runBulkAction,
    isBulkActionLoading,
  } = useDataTableContext<TData>();

  if (!hasSelectedRows) return null;

  // Filter available actions based on selected data
  const availableBulkActions = bulkActions.filter((action) => !action.disabledCondition?.(selectedRows));

  return (
    <div className="flex items-center gap-1">
      {/* Selection Count Badge */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="hover:bg-primary/10 h-7 gap-2 px-2">
            <CheckSquare className="text-primary h-4 w-4" />
            <span className="text-primary font-medium">{selectedRows?.length}</span>
            <span className="text-muted-foreground text-sm">Selected</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Selected" />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup heading="Selected Items">
                {selectedRows?.map((row, idx) => {
                  const value = displayKey ? row[displayKey] : undefined;
                  const label = value != null ? String(value) : `Unknown ${idx + 1}`;

                  return (
                    <CommandItem className="text-sm" key={idx}>
                      <span className="truncate">{label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {selectedRows.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={clearSelection}
                      className="text-muted-foreground hover:text-foreground justify-center text-center text-sm"
                    >
                      Clear Selection
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-5" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* All Actions - icon buttons with tooltips */}
        {availableBulkActions.map((action) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => runBulkAction?.(action.id)}
                disabled={isBulkActionLoading || !runBulkAction}
                className={`h-7 w-7 ${action.variant === "destructive" ? "text-destructive hover:bg-destructive hover:text-destructive-foreground" : ""}`}
              >
                {isBulkActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  action.icon && <action.icon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{action.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-5" />

      {/* Clear Selection */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={clearSelection}
            disabled={isBulkActionLoading}
            className="text-muted-foreground hover:text-foreground h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Clear selection</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
