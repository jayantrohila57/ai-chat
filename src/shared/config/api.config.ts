export const STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  FAILED: "failed",
} as const;

export const MESSAGE = {
  SYSTEM: {
    HEALTH: {
      SUCCESS: "System health retrieved successfully.",
      ERROR: "Unexpected error while retrieving system health.",
    },
  },
  VIEWER: {
    SESSION: {
      SUCCESS: "Viewer session retrieved successfully.",
      ERROR: "Unexpected error while retrieving viewer session.",
    },
  },
} as const;
