import z from "zod/v3";

/**
 * Pagination Input Schema (Page-based)
 * Used for list endpoint input validation
 * Supports both page/limit and offset/limit patterns
 */
export const paginationInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationInput = z.infer<typeof paginationInput>;

/**
 * Calculate offset from page and limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (Math.max(1, page) - 1) * limit;
}

/**
 * Pagination Meta Schema
 * Included in paginated responses
 */
export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/**
 * Paginated Response Schema Factory
 * Creates a schema for paginated list responses
 */
export const paginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

/**
 * Pagination Schema for DB Queries (Offset-based)
 * Used with Drizzle ORM - matches existing API patterns
 */
export const offsetPaginationSchema = z.object({
  offset: z.number().min(0).default(0),
  limit: z.number().min(1).max(100).default(20),
});

export type OffsetPagination = z.infer<typeof offsetPaginationSchema>;

/**
 * Legacy alias for backward compatibility
 * @deprecated Use offsetPaginationSchema instead
 */
export const paginationSchema = offsetPaginationSchema;

export type Pagination = z.infer<typeof paginationSchema>;
