"use client";

import type { Row } from "@tanstack/react-table";
import { Building2, Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useStableId } from "@/shared/utils/stable-id";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  isPending?: boolean;
  onView?: (row: Row<TData>) => void;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  isPending,
}: DataTableRowActionsProps<TData>) {
  const dropdownId = useStableId(`row-actions-${row.id}`);

  const handleView = () => {
    onView?.(row);
  };

  const handleEdit = () => {
    onEdit?.(row);
  };

  const handleDelete = () => {
    onDelete?.(row);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{"open menu"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive" disabled={isPending}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
