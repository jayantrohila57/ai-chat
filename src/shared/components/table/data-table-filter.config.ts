import type { LucideIcon } from "lucide-react";
import { Clock, ClockPlus, Flame, Target, User, UserX } from "lucide-react";
import z from "zod/v3";

const Status = {
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVE: "archive",
} as const;

const DisplayType = {
  DEFAULT: "default",
  FEATURED: "featured",
  LATEST: "latest",
} as const;

const statusValue = Object.values(Status);
const typeValue = Object.values(DisplayType);

export const filterSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.custom<LucideIcon>(),
  color: z.string(),
});
export type FilterType = z.infer<typeof filterSchema>;

const status: FilterType[] = [
  {
    value: Status.DRAFT,
    label: "Draft",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: Status.IN_REVIEW,
    label: "In Review",
    icon: User,
    color: "text-blue-500",
  },
  {
    value: Status.SCHEDULED,
    label: "Scheduled",
    icon: ClockPlus,
    color: "text-emerald-500",
  },
  {
    value: Status.PUBLISHED,
    label: "Published",
    icon: Target,
    color: "text-primary",
  },
  {
    value: Status.ARCHIVE,
    label: "Archived",
    icon: UserX,
    color: "text-muted-foreground",
  },
];

const types: FilterType[] = [
  {
    value: DisplayType.DEFAULT,
    label: "Default",
    icon: User,
    color: "",
  },
  {
    value: DisplayType.FEATURED,
    label: "Featured",
    icon: Target,
    color: "",
  },
  {
    value: DisplayType.LATEST,
    label: "Latest",
    icon: Flame,
    color: "",
  },
];

const deletionStatus: FilterType[] = [
  {
    value: "false",
    label: "Active",
    icon: Target,
    color: "text-primary",
  },
  {
    value: "true",
    label: "Trash",
    icon: UserX,
    color: "text-destructive",
  },
];

export const filters = {
  status,
  types,
  deletionStatus,
  statusValue,
  typeValue,
};
