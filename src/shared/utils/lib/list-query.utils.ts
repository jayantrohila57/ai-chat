export type ListQuery = {
  pagination: { page: number; limit: number; offset: number };
  search: { q?: string };
  sort?: {
    sortBy?: string;
    sortDir?: "asc" | "desc";
  };
  filters: {
    visibility?: "public" | "private" | "hidden";
    displayType?: "grid" | "carousel" | "banner" | "list" | "featured";
    deleted?: boolean;
    isFeatured?: boolean;
    color?: string;
  };
};

export type SearchParamsLike = Record<string, string | string[] | undefined>;

function first(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function toInt(val: string | undefined, fallback: number): number {
  const n = Number.parseInt(String(val ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(val: string | undefined): boolean | undefined {
  if (val === undefined) return undefined;
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
}

export function getListQueryFromSearchParams(params: SearchParamsLike): ListQuery {
  const page = Math.max(1, toInt(first(params.page), 1));
  const limit = Math.min(100, Math.max(1, toInt(first(params.limit), 20)));
  const offset = (page - 1) * limit;

  const q = first(params.q)?.trim() || undefined;

  const sortBy = first(params.sortBy)?.trim() || undefined;
  const sortDirParam = first(params.sortDir)?.trim()?.toLowerCase();
  const sortDir = sortDirParam === "asc" || sortDirParam === "desc" ? (sortDirParam as "asc" | "desc") : undefined;

  const visibility = first(params.visibility) as ListQuery["filters"]["visibility"];
  const displayType = first(params.displayType) as ListQuery["filters"]["displayType"];
  const deleted = toBool(first(params.deleted));
  const isFeatured = toBool(first(params.isFeatured));
  const color = first(params.color) || undefined;

  return {
    pagination: { page, limit, offset },
    search: { q },
    sort: {
      sortBy,
      sortDir,
    },
    filters: {
      visibility,
      displayType,
      deleted,
      isFeatured,
      color,
    },
  };
}
