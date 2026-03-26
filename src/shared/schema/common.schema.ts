import z from "zod/v3";

/**
 * ID Schema
 * Standard UUID validation for entity IDs
 */
export const idSchema = z.string().uuid();

export type IdSchema = z.infer<typeof idSchema>;

/**
 * Slug Schema
 * URL-friendly string validation
 * - Lowercase letters, numbers, and hyphens only
 * - Cannot start or end with hyphen
 * - No consecutive hyphens
 */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug must be less than 100 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must contain only lowercase letters, numbers, and hyphens (e.g., "my-slug-123")',
  );

export type SlugSchema = z.infer<typeof slugSchema>;

/**
 * Soft Delete Schema
 * Standard fields for soft-delete enabled entities
 */
export const softDeleteSchema = z.object({
  deletedAt: z.date().nullable().optional(),
});

export type SoftDeleteSchema = z.infer<typeof softDeleteSchema>;

/**
 * Timestamp Schema
 * Standard createdAt/updatedAt fields
 */
export const timestampSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
});

export type TimestampSchema = z.infer<typeof timestampSchema>;

/**
 * Base Entity Schema
 * Combines ID + timestamps + soft delete
 * Extend this for all database entities
 */
export const baseEntitySchema = z
  .object({
    id: idSchema,
  })
  .merge(timestampSchema)
  .merge(softDeleteSchema);

export type BaseEntitySchema = z.infer<typeof baseEntitySchema>;

/**
 * SEO Fields Schema
 * Standard SEO metadata for content entities
 */
export const seoSchema = z.object({
  metaTitle: z.string().max(70).nullable().optional(),
  metaDescription: z.string().max(160).nullable().optional(),
  metaKeywords: z.array(z.string()).nullable().optional(),
});

export type SeoSchema = z.infer<typeof seoSchema>;

/**
 * Color Schema
 * Hex color validation
 */
export const colorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format");

export type ColorSchema = z.infer<typeof colorSchema>;

/**
 * JSON Schema
 * For storing JSON data with type safety
 */
export const jsonSchema = z.record(z.unknown()).nullable();

export type JsonSchema = z.infer<typeof jsonSchema>;

/**
 * Money Schema
 * Currency amount validation (in smallest units, e.g., cents)
 */
export const moneySchema = z.number().int().min(0);

export type MoneySchema = z.infer<typeof moneySchema>;

/**
 * Percentage Schema
 * 0-100 percentage validation
 */
export const percentageSchema = z.number().min(0).max(100);

export type PercentageSchema = z.infer<typeof percentageSchema>;
