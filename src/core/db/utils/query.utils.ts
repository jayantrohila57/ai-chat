import { asc, desc, ilike, or, type SQL, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { PaginationInput, PaginationMeta } from "@/shared/schema/pagination.schema";

/**
 * Query Utilities
 * Helper functions for building database queries with
 * pagination, search, and sorting
 */

/**
 * Build pagination parameters for Drizzle queries
 * Calculates offset and limit from page/limit input
 */
export function buildPagination(input: PaginationInput): {
  offset: number;
  limit: number;
} {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(100, Math.max(1, input.limit ?? 20));
  const offset = (page - 1) * limit;

  return { offset, limit };
}

/**
 * Build pagination metadata for API responses
 */
export function buildPaginationMeta(total: number, input: PaginationInput): PaginationMeta {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(100, Math.max(1, input.limit ?? 20));
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Build search condition for Drizzle WHERE clause
 * Searches across multiple columns with case-insensitive matching
 */
export function buildSearch(searchTerm: string | undefined, searchableColumns: PgColumn[]): SQL | undefined {
  if (!searchTerm || searchTerm.trim() === "" || searchableColumns.length === 0) {
    return undefined;
  }

  const term = `%${searchTerm}%`;
  const conditions = searchableColumns.map((col) => ilike(col, term));

  return or(...conditions);
}

/**
 * Build order by clause for Drizzle queries
 */
export function buildOrderBy(
  sortBy: string | undefined,
  sortOrder: "asc" | "desc" | undefined,
  table: PgTable,
  defaultColumn: PgColumn,
) {
  const direction = sortOrder === "asc" ? asc : desc;

  if (!sortBy) {
    return direction(defaultColumn);
  }

  const column = (table as unknown as Record<string, PgColumn>)[sortBy];
  if (!column) {
    return direction(defaultColumn);
  }

  return direction(column);
}

/**
 * Calculate total pages from total count and page size
 */
export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / Math.max(1, pageSize));
}

/**
 * Validate and sanitize pagination input
 */
export function sanitizePaginationInput(
  page: number | undefined,
  limit: number | undefined,
  maxLimit: number = 100,
): { page: number; limit: number } {
  const sanitizedPage = Math.max(1, page ?? 1);
  const sanitizedLimit = Math.min(maxLimit, Math.max(1, limit ?? 20));

  return { page: sanitizedPage, limit: sanitizedLimit };
}

/**
 * Type for search configuration per table
 */
export type SearchConfig = {
  columns: PgColumn[];
  transform?: (term: string) => string;
};

/**
 * Advanced search with multiple configurations
 * Allows different search strategies for different tables
 */
export function buildAdvancedSearch(searchTerm: string | undefined, configs: SearchConfig[]): SQL | undefined {
  if (!searchTerm || searchTerm.trim() === "") {
    return undefined;
  }

  const term = searchTerm.trim();
  const allConditions: SQL[] = [];

  for (const config of configs) {
    const { columns, transform } = config;
    const searchValue = transform ? transform(term) : `%${term}%`;

    const conditions = columns.map((col) => ilike(col, searchValue));
    const orCondition = or(...conditions);

    if (orCondition) {
      allConditions.push(orCondition);
    }
  }

  if (allConditions.length === 0) {
    return undefined;
  }

  return or(...allConditions);
}
