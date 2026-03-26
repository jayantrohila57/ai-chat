import type { ColumnDef, Row } from "@tanstack/react-table";
import { Clock, ImageIcon, IndianRupee, SquareArrowOutUpRight, Star } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { colorClass, displayTypeOptions, statusOptions, visibilityOptions } from "@/shared/config/options.config";
import { cn } from "@/shared/utils/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

const ColumnCell = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("text-foreground line-clamp-1 gap-2 pr-1 pl-0.5 text-sm", className)}>{children}</div>;
};
const keys = {
  ID: "id",
  SLUG: "slug",
  SELECT: "select",
  ACTIONS: "actions",
  VISIBILITY: "visibility",
  POSTS_COUNT: "postsCount",
  STATUS: "status",
  DESCRIPTION: "description",
  CREATED_AT: "createdAt",
  FULL_NAME: "fullName",
  DELETED_AT: "deletedAt",
  EMAIL: "email",
  NAME: "name",
  IMAGE: "image",
  DISPLAY_TYPE: "displayType",
  UPDATED_AT: "updatedAt",
  TITLE: "title",
  COLOR: "color",
  IS_FEATURED: "isFeatured",
  POPULARITY: "popularity",
  VALUE: "value",
  CURRENCY: "currency",
};

function idColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.ID,
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => {
        const id = String(row.getValue(keys.ID));
        return (
          <ColumnCell className="w-[80px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[80px] truncate text-sm text-muted-foreground">{id}</div>
              </TooltipTrigger>
              <TooltipContent>{id}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        );
      },
    },
  ];
}
function titleColumn<T>(url: string): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.TITLE,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        const title = String(row.getValue(keys.TITLE) ?? "N/A");
        const slug = row.getValue(keys.SLUG) as string;
        return (
          <ColumnCell className="min-w-[220px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`${url}/${slug}` as Route}
                  className="max-w-[260px] truncate text-sm font-medium underline-offset-4 hover:underline"
                >
                  {title}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{title}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        );
      },
    },
  ];
}
function selectColumn<T>(): ColumnDef<T>[] {
  return [
    {
      id: keys.SELECT,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <ColumnCell className="flex w-8 items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="mr-2.5"
          />
        </ColumnCell>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
function descriptionColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.DESCRIPTION,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => {
        const description = String(row.getValue(keys.DESCRIPTION) ?? "No description found");
        return (
          <ColumnCell className="min-w-[260px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[260px] truncate text-sm text-muted-foreground">{description}</div>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        );
      },
    },
  ];
}
function actionsColumn<T>(config?: {
  editRoute?: string;
  deleteMutation?: {
    isPending: boolean;
  };
  invalidateCache?: () => Promise<void>;
  onView?: (row: Row<T>) => void;
  onEdit?: (row: Row<T>) => void;
  onDelete?: (row: Row<T>) => void;
}): ColumnDef<T>[] {
  return [
    {
      id: keys.ACTIONS,
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" className="" />,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          isPending={config?.deleteMutation?.isPending}
          onView={config?.onView}
          onEdit={config?.onEdit}
          onDelete={config?.onDelete}
        />
      ),
    },
  ];
}
function visibilityColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.VISIBILITY,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Visibility" />,
      cell: ({ row }) => {
        const type = visibilityOptions.find((type) => type.value === row.getValue(keys.VISIBILITY));

        if (!type) return null;

        return (
          <ColumnCell>
            <Badge variant={"outline"}>
              {type.icon && <type.icon className="mr-1 h-4 w-4" />}
              {type.label}
            </Badge>
          </ColumnCell>
        );
      },

      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) ?? "";
        return (value as string[]).includes(rowValue as string);
      },
    },
  ];
}
function statusColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.STATUS,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = statusOptions.find((status) => status.value === row.getValue(keys.STATUS));
        if (!status) return null;
        return (
          <ColumnCell className="">
            <Badge variant={"outline"}>
              {status.icon && <status.icon className="mr-1 h-4 w-4" />}
              <span className=""> {status.label}</span>
            </Badge>
          </ColumnCell>
        );
      },

      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) ?? "";
        return (value as string[]).includes(rowValue as string);
      },
    },
  ];
}
function postsCountColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "postsCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Posts Count" />,
      cell: ({ row }) => (
        <ColumnCell className="flex items-center px-1">
          <Badge variant={"outline"}>
            {"Posts: "}
            <span>{row.getValue(keys.POSTS_COUNT)}</span>
          </Badge>
        </ColumnCell>
      ),
    },
  ];
}
function createdAtColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue(keys.CREATED_AT));
        return (
          <ColumnCell className="flex w-[160px] flex-row">
            <Badge variant={"outline"}>
              <Clock className="mr-1 h-4 w-4" />
              {date.toLocaleDateString()}
            </Badge>
          </ColumnCell>
        );
      },
    },
  ];
}
function updatedAtColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue(keys.UPDATED_AT));
        return (
          <ColumnCell className="flex w-[160px] flex-row">
            <Badge variant={"outline"}>
              <Clock className="mr-1 h-4 w-4" />
              {date.toLocaleDateString()}
            </Badge>
          </ColumnCell>
        );
      },
    },
  ];
}
function deletedAtColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.DELETED_AT,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deleted At" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue(keys.DELETED_AT));
        return (
          <ColumnCell className="flex w-[160px] flex-row">
            <Badge variant={"outline"}>
              <Clock className="mr-1 h-4 w-4" />
              {date.toLocaleDateString()}
            </Badge>
          </ColumnCell>
        );
      },
    },
  ];
}

function slugColumn<T>(url: string): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.SLUG,
      header: ({ column }) => <DataTableColumnHeader column={column} title="View" />,
      cell: ({ row }) => (
        <ColumnCell className="flex w-[120px]">
          <Link href={`${url}/${String(row.getValue(keys.SLUG))}` as Route}>
            <Button variant="link">
              {"View"} <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </ColumnCell>
      ),
    },
  ];
}
function fullNameColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.FULL_NAME,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <ColumnCell className="flex w-[140px] items-center gap-3">
            <div className="font-medium">{String(row.getValue(keys.FULL_NAME))}</div>
          </ColumnCell>
        );
      },
    },
  ];
}
function imageColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.IMAGE,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
      cell: ({ row }) => {
        const imageUrl = row.getValue(keys.IMAGE) || (row.original as unknown as { mediaUrl?: string })?.mediaUrl;
        return (
          <ColumnCell className="w-[120px]">
            <Avatar className="aspect-video h-12 w-auto rounded-sm object-cover">
              <AvatarImage
                src={imageUrl as string}
                alt="Image"
                className="aspect-video h-12 w-auto rounded-sm object-cover"
              />
              <AvatarFallback className="aspect-video h-12 w-auto rounded-sm object-cover">
                <ImageIcon className="opacity-50" />
              </AvatarFallback>
            </Avatar>
          </ColumnCell>
        );
      },
    },
  ];
}
function colorColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.COLOR,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Color" />,
      cell: ({ row }) => {
        const color = String(row.getValue(keys.COLOR));
        return (
          <ColumnCell className="flex w-[120px]">
            {color ? (
              color.startsWith("#") ? (
                <div className="h-5 w-5 rounded-md border" style={{ backgroundColor: color }} />
              ) : (
                <div
                  className={cn(
                    "rounded shadow-none transition-all duration-300",
                    "h-6 w-16",
                    colorClass[color as keyof typeof colorClass],
                  )}
                >
                  {color}
                </div>
              )
            ) : (
              <span className="text-muted-foreground">{" — "}</span>
            )}
          </ColumnCell>
        );
      },
    },
  ];
}
function isFeaturedColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.IS_FEATURED,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Featured" />,
      cell: ({ row }) => (
        <ColumnCell className="flex w-[120px]">
          {row.getValue(keys.IS_FEATURED) ? (
            <Star className="h-4 w-4 text-yellow-500" />
          ) : (
            <span className="text-muted-foreground">{" — "}</span>
          )}
        </ColumnCell>
      ),
    },
  ];
}
function popularityColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.POPULARITY,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Popularity" />,
      cell: ({ row }) => {
        const popularity = String(row.getValue(keys.POPULARITY));
        return (
          <ColumnCell className="flex w-[120px]">
            {popularity ? (
              <div className="h-5 w-5 rounded-md border" style={{ backgroundColor: popularity }} />
            ) : (
              <span className="text-muted-foreground">{" — "}</span>
            )}
          </ColumnCell>
        );
      },
    },
  ];
}
function emailColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.EMAIL,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => {
        const email = String(row.getValue(keys.EMAIL) ?? "");
        if (!email) {
          return (
            <ColumnCell className="min-w-[240px]">
              <span className="text-sm text-muted-foreground">{" — "}</span>
            </ColumnCell>
          );
        }
        return (
          <ColumnCell className="min-w-[240px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[260px] truncate text-sm text-muted-foreground">{email}</div>
              </TooltipTrigger>
              <TooltipContent>{email}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        );
      },
    },
  ];
}

function nameColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.NAME,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const name = String(row.getValue(keys.NAME) ?? "");
        return (
          <ColumnCell className="min-w-[220px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[260px] truncate text-sm font-medium">{name}</div>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </ColumnCell>
        );
      },
    },
  ];
}

function displayTypeColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.DISPLAY_TYPE,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Display Type" />,
      cell: ({ row }) => {
        const type = displayTypeOptions.find((type) => type.value === row.getValue(keys.DISPLAY_TYPE));

        if (!type) return null;

        return (
          <ColumnCell>
            <Badge variant={"outline"}>
              {type.icon && <type.icon className="mr-1 h-4 w-4" />}
              {type.label}
            </Badge>
          </ColumnCell>
        );
      },

      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) ?? "";
        return (value as string[]).includes(rowValue as string);
      },
    },
  ];
}

function valueColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.VALUE,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
      cell: ({ row }) => {
        return <ColumnCell className="flex w-[220px]">{String(row.getValue(keys.VALUE))}</ColumnCell>;
      },
    },
  ];
}
function currencyColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: keys.CURRENCY,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
      cell: ({ row }) => {
        const currency = String(row.getValue(keys.CURRENCY));
        return (
          <ColumnCell className="flex w-[220px]">{currency ? <IndianRupee className="h-4 w-4" /> : "N/A"}</ColumnCell>
        );
      },
    },
  ];
}
export const commonColumns = {
  keys,
  idColumn,
  titleColumn,
  selectColumn,
  descriptionColumn,
  actionsColumn,
  statusColumn,
  postsCountColumn,
  createdAtColumn,
  imageColumn,
  updatedAtColumn,
  slugColumn,
  fullNameColumn,
  colorColumn,
  isFeaturedColumn,
  popularityColumn,
  emailColumn,
  nameColumn,
  displayTypeColumn,
  deletedAtColumn,
  visibilityColumn,
  valueColumn,
  currencyColumn,
};
