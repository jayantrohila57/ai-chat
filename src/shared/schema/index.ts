// ============================================================
// RE-EXPORTS FROM NEW MODULAR SCHEMAS
// ============================================================

export {
  type DetailedResponse,
  // From api.schema.ts
  detailedResponse,
  type ErrorResponse,
  errorResponse,
  type MetaResponse,
  metaResponse,
  type SuccessResponse,
  statusValues,
  successResponse,
} from "./api.schema";
export {
  type BaseEntitySchema,
  baseEntitySchema,
  type ColorSchema,
  colorSchema,
  type IdSchema,
  // From common.schema.ts
  idSchema,
  type JsonSchema,
  jsonSchema,
  type MoneySchema,
  moneySchema,
  type PercentageSchema,
  percentageSchema,
  type SeoSchema,
  type SlugSchema,
  type SoftDeleteSchema,
  seoSchema,
  slugSchema,
  softDeleteSchema,
  type TimestampSchema,
  timestampSchema,
} from "./common.schema";
export {
  type SortOrder,
  sortOrderEnum,
  type UserRole,
  userRoleEnum,
  type Visibility,
  visibilityEnum,
} from "./enums.schema";
export {
  calculateOffset,
  type OffsetPagination,
  offsetPaginationSchema,
  type PaginatedResponse,
  type Pagination,
  type PaginationInput,
  type PaginationMeta,
  paginatedResponse,
  // From pagination.schema.ts
  paginationInput,
  paginationMetaSchema,
  paginationSchema,
} from "./pagination.schema";

// ============================================================
// RE-EXPORTS FROM SHARED UTILITIES
// ============================================================

export {
  buildOrderBy,
  // From query.utils.ts (DB utilities)
  buildPagination,
  buildPaginationMeta,
  buildSearch,
  calculateTotalPages,
  type SearchConfig,
  sanitizePaginationInput,
} from "../../core/db/utils/query.utils";
export {
  generateDeletedSlug,
  // From slug.utils.ts
  generateSlug,
  generateUniqueSlug,
  isValidSlug,
  sanitizeSlugInput,
} from "../utils/lib/slug.utils";
export {
  buildSoftDeleteData,
  checkIsDeleted,
  isNotDeleted,
  // From soft-delete.utils.ts
  softDeleteFilter,
  withSoftDelete,
} from "../utils/lib/soft-delete.utils";
