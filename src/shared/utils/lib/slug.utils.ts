/**
 * Slug Utilities
 * Functions for generating and managing URL-friendly slugs
 */

/**
 * Converts a string to a URL-friendly slug
 * - Lowercase
 * - Replace spaces with hyphens
 * - Remove special characters
 * - Trim hyphens from start/end
 * - Prevent consecutive hyphens
 */
export function generateSlug(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Prevent consecutive hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
}

/**
 * Generates a unique slug for soft-deleted entities
 * Format: {original-slug}-deleted-{timestamp}
 * This allows the original slug to be reused by new entities
 */
export function generateDeletedSlug(originalSlug: string): string {
  if (!originalSlug) {
    return `deleted-${Date.now()}`;
  }

  const timestamp = Date.now();
  return `${originalSlug}-deleted-${timestamp}`;
}

/**
 * Generates a unique slug by appending a counter if needed
 * Useful when a slug already exists in the database
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
}

/**
 * Validates if a string is a valid slug format
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") {
    return false;
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitizes user input for slug generation
 * Handles common edge cases
 */
export function sanitizeSlugInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .trim();
}
