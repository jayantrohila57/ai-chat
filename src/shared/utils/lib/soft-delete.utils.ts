import { and, isNull, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * Soft Delete Utilities
 * Helper functions for implementing soft delete patterns
 * across the application using Drizzle ORM
 */

/**
 * Creates a filter condition for queries to exclude soft-deleted records
 * Usage: .where(softDeleteFilter(table.deletedAt))
 */
export function softDeleteFilter(deletedAtColumn: PgColumn): SQL {
  return isNull(deletedAtColumn);
}

/**
 * Creates a condition to check if a record is not soft deleted
 * Combines with other conditions using and()
 */
export function isNotDeleted(deletedAtColumn: PgColumn): SQL {
  return isNull(deletedAtColumn);
}

/**
 * Build soft delete data for mutations
 * Returns the object to pass to .set() when soft deleting
 */
export function buildSoftDeleteData<T extends Record<string, unknown> = Record<string, never>>(
  additionalData?: T,
): { deletedAt: Date } & Partial<T> {
  return {
    deletedAt: new Date(),
    ...additionalData,
  } as { deletedAt: Date } & Partial<T>;
}

/**
 * Check if entity is soft deleted
 */
export function checkIsDeleted<T extends { deletedAt?: Date | null }>(entity: T): boolean {
  return entity.deletedAt !== null && entity.deletedAt !== undefined;
}

/**
 * Build where clause with soft delete filter
 * Combines user conditions with soft delete check
 */
export function withSoftDelete(deletedAtColumn: PgColumn, ...conditions: (SQL | undefined)[]): SQL | undefined {
  const validConditions = conditions.filter((c): c is SQL => c !== undefined);
  if (validConditions.length === 0) {
    return isNull(deletedAtColumn);
  }
  return and(isNull(deletedAtColumn), ...validConditions);
}
