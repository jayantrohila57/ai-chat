import z from "zod/v3";
import { STATUS } from "../config/api.config";
import { paginationMetaSchema } from "./pagination.schema";

/**
 * API Response Status Values
 */
export const statusValues = [STATUS.SUCCESS, STATUS.ERROR, STATUS.FAILED] as const;

/**
 * Detailed Response Schema Factory
 * Standard API response wrapper with full type safety
 * Used for all API endpoint responses
 * Includes optional meta field for count, timestamp, version
 */
export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(statusValues),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().optional(),
        version: z.string().optional(),
        count: z.number().optional(),
        pagination: paginationMetaSchema.optional(),
        filters: z.record(z.unknown()).optional(),
      })
      .optional(),
    error: z
      .object({
        message: z.string(),
        code: z.string().optional(),
        details: z.record(z.unknown()).optional(),
      })
      .nullable()
      .optional(),
  });

export type DetailedResponse<T> = {
  status: (typeof statusValues)[number];
  message: string;
  data: T | null;
  meta?: {
    timestamp?: Date;
    version?: string;
    count?: number;
    pagination?: z.infer<typeof paginationMetaSchema>;
    filters?: Record<string, unknown>;
  };
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  } | null;
};

/**
 * Meta Response Schema
 * For responses with metadata (e.g., pagination, filtering info)
 */
export const metaResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(statusValues),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        pagination: paginationMetaSchema.optional(),
        filters: z.record(z.unknown()).optional(),
        timestamp: z.string().datetime().optional(),
      })
      .optional(),
    error: z
      .object({
        message: z.string(),
        code: z.string().optional(),
        details: z.record(z.unknown()).optional(),
      })
      .nullable()
      .optional(),
  });

export type MetaResponse<T> = {
  status: (typeof statusValues)[number];
  message: string;
  data: T | null;
  meta?: {
    pagination?: z.infer<typeof paginationMetaSchema>;
    filters?: Record<string, unknown>;
    timestamp?: string;
  };
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  } | null;
};

/**
 * Simple Success Response Schema
 * For operations that don't return data
 */
export const successResponse = z.object({
  status: z.enum(statusValues),
  message: z.string(),
  success: z.boolean(),
});

export type SuccessResponse = z.infer<typeof successResponse>;

/**
 * Error Response Schema
 * Standardized error response structure
 */
export const errorResponse = z.object({
  status: z.literal(STATUS.ERROR),
  message: z.string(),
  error: z.object({
    message: z.string(),
    code: z.string(),
    path: z.string().optional(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponse>;
