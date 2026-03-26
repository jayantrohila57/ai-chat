import z from "zod/v3";

export const userRoleEnum = z.enum(["admin", "staff", "user", "customer"]);
export type UserRole = z.infer<typeof userRoleEnum>;

export const visibilityEnum = z.enum(["public", "private", "hidden"]);
export type Visibility = z.infer<typeof visibilityEnum>;

export const sortOrderEnum = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrderEnum>;

export const mediaTypeEnum = z.enum(["image", "video", "model", "file"]);
export type MediaType = z.infer<typeof mediaTypeEnum>;
