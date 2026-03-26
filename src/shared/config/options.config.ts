import {
  ActivityIcon,
  BoltIcon,
  CheckIcon,
  EyeOffIcon,
  GlobeIcon,
  ListIcon,
  type LucideIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";

export interface FilterOption<T> {
  value: T;
  label: string;
  icon?: LucideIcon;
  color: string;
}

export enum DisplayType {
  GRID = "grid",
  CAROUSEL = "carousel",
  BANNER = "banner",
  LIST = "list",
  FEATURED = "featured",
}

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
  HIDDEN = "hidden",
}

export const displayTypeOptions: FilterOption<DisplayType>[] = [
  { value: DisplayType.GRID, label: "Grid", icon: ListIcon, color: "" },
  { value: DisplayType.CAROUSEL, label: "Carousel", icon: SparklesIcon, color: "" },
  { value: DisplayType.BANNER, label: "Banner", icon: BoltIcon, color: "" },
  { value: DisplayType.LIST, label: "List", icon: ActivityIcon, color: "" },
  { value: DisplayType.FEATURED, label: "Featured", icon: StarIcon, color: "" },
];

export const visibilityOptions: FilterOption<Visibility>[] = [
  { value: Visibility.PUBLIC, label: "Public", icon: GlobeIcon, color: "" },
  { value: Visibility.PRIVATE, label: "Private", icon: EyeOffIcon, color: "" },
  { value: Visibility.HIDDEN, label: "Hidden", icon: EyeOffIcon, color: "" },
];

export enum Status {
  DRAFT = "draft",
  ARCHIVE = "archive",
  LIVE = "live",
}

export const statusOptions: FilterOption<Status>[] = [
  { value: Status.DRAFT, label: "Draft", icon: CheckIcon, color: "" },
  { value: Status.ARCHIVE, label: "Archive", icon: CheckIcon, color: "" },
  { value: Status.LIVE, label: "Live", icon: CheckIcon, color: "" },
];

export const colorClass = {
  RED: "border border-red-500 bg-red-500 text-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white",
  ORANGE:
    "border border-orange-500 bg-orange-500 text-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white",
  YELLOW:
    "border border-yellow-500 bg-yellow-500 text-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white",
  GREEN:
    "border border-green-500 bg-green-500 text-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white",
  BLUE: "border border-blue-500 bg-blue-500 text-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white",
  PURPLE:
    "border border-purple-500 bg-purple-500 text-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white",
  PINK: "border border-pink-500 bg-pink-500 text-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white",
} as const;

export enum Color {
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
  PURPLE = "purple",
  PINK = "pink",
}

export const colorOptions: FilterOption<Color>[] = [
  { value: Color.RED, label: "Red", icon: CheckIcon, color: colorClass.RED },
  { value: Color.ORANGE, label: "Orange", icon: CheckIcon, color: colorClass.ORANGE },
  { value: Color.YELLOW, label: "Yellow", icon: CheckIcon, color: colorClass.YELLOW },
  { value: Color.GREEN, label: "Green", icon: CheckIcon, color: colorClass.GREEN },
  { value: Color.BLUE, label: "Blue", icon: CheckIcon, color: colorClass.BLUE },
  { value: Color.PURPLE, label: "Purple", icon: CheckIcon, color: colorClass.PURPLE },
  { value: Color.PINK, label: "Pink", icon: CheckIcon, color: colorClass.PINK },
];

export type DisplayTypeOption = FilterOption<DisplayType>;
export type VisibilityOption = FilterOption<Visibility>;
export type ColorOption = FilterOption<Color>;
