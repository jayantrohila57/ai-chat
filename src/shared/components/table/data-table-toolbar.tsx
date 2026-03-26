"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { useDataTableContext } from "./data-table-context";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { EnhancedDataTableSelectedActions } from "./data-table-selection-action";
import { DataTableViewOptions } from "./data-table-view-options";

export function DataTableToolbar<TData>() {
  const {
    table,
    displayKey,
    statusOptions,
    typeOptions,
    visibilityOptions,
    featuredOptions,
    deletionOptions,
    extraFilters,
    filters,
    setFilter,
    setSearch,
    clearFilters,
  } = useDataTableContext<TData>();

  const isFiltered =
    table?.getState().columnFilters.length > 0 ||
    Object.values(filters ?? {}).some((v) => v !== null && v !== undefined);

  return (
    <div className="flex w-full h-16 items-center justify-between">
      <div className="flex flex-1 h-full  ">
        {(() => {
          try {
            const column = table.getColumn(displayKey as string);
            return column ? (
              <div className="flex justify-center items-center px-4 h-full border-r">
                <InputGroup className="max-w-xl w-full bg-transparent">
                  <InputGroupInput
                    value={filters?.q ?? (column.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                      const val = event.target.value;
                      column.setFilterValue(val);
                      setSearch?.(val);
                    }}
                    placeholder={`Filter by ${displayKey.toString()}...`}
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end"> results</InputGroupAddon>
                </InputGroup>
              </div>
            ) : null;
          } catch (e) {
            return null;
          }
        })()}
        {statusOptions && statusOptions.length > 0 && (
          <div className="flex justify-center items-center px-4 h-full border-r">
            <DataTableFacetedFilter
              title="Status"
              options={statusOptions}
              value={filters?.status}
              onSelect={(val) => setFilter?.("status", val)}
            />
          </div>
        )}
        {visibilityOptions && visibilityOptions.length > 0 && (
          <div className="flex justify-center items-center px-4 h-full border-r">
            <DataTableFacetedFilter
              title="Visibility"
              options={visibilityOptions}
              value={filters?.visibility}
              onSelect={(val) => setFilter?.("visibility", val)}
            />
          </div>
        )}
        {typeOptions && typeOptions.length > 0 && (
          <div className="flex justify-center items-center px-4 h-full border-r">
            <DataTableFacetedFilter
              title="Display Type"
              options={typeOptions}
              value={filters?.displayType}
              onSelect={(val) => setFilter?.("displayType", val)}
            />
          </div>
        )}
        {featuredOptions && featuredOptions.length > 0 && (
          <div className="flex justify-center items-center px-4 h-full border-r">
            <DataTableFacetedFilter
              title="Featured"
              options={featuredOptions}
              value={filters?.isFeatured}
              onSelect={(val) => setFilter?.("isFeatured", val)}
            />
          </div>
        )}
        {deletionOptions && deletionOptions.length > 0 && (
          <div className="flex justify-center items-center px-4 h-full border-r">
            <DataTableFacetedFilter
              title="Deleted"
              options={deletionOptions}
              value={filters?.deleted}
              onSelect={(val) => setFilter?.("deleted", val)}
            />
          </div>
        )}
        {extraFilters?.map((filter) => (
          <div key={filter.key} className="flex justify-center items-center px-4 h-full border-r">
            <DataTableFacetedFilter
              title={filter.title}
              options={filter.options}
              value={filters?.[filter.key]}
              onSelect={(val) => setFilter?.(filter.key, val)}
            />
          </div>
        ))}
        {isFiltered && (
          <div className="flex justify-center px-4 items-center h-full border-r">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                table?.resetColumnFilters();
                clearFilters?.();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center h-full">
        <div className="flex justify-center items-center px-4 h-full border-l">
          <EnhancedDataTableSelectedActions />
        </div>
        <div className="flex justify-center items-center px-4 h-full border-l">
          <DataTableViewOptions />
        </div>
      </div>
    </div>
  );
}
