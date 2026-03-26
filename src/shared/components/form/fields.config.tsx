import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/components/ui/skeleton";

const loadingImageSkeleton = () => (
  <div className="flex flex-col gap-2 py-1">
    <Skeleton className="h-2.5 w-20" />
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-2.5 w-80" />
  </div>
);
const loadingInputSkeleton = () => (
  <div className="flex flex-col gap-2 py-1">
    <Skeleton className="h-2.5 w-20" />
    <Skeleton className="h-10 w-full" />
  </div>
);

const loadingTextAreaSkeleton = () => (
  <div className="flex flex-col gap-2 py-1">
    <Skeleton className="h-2.5 w-20" />
    <Skeleton className="h-[120px] w-full" />
  </div>
);

export const Fields = {
  text: dynamic(() => import("./fields/field.text").then((mod) => mod.InputText), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  textarea: dynamic(() => import("./fields/field.textarea").then((mod) => mod.InputTextArea), {
    ssr: false,
    loading: () => loadingTextAreaSkeleton(),
  }),
  number: dynamic(() => import("./fields/field.number").then((mod) => mod.InputNumber), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  switch: dynamic(() => import("./fields/field.switch").then((mod) => mod.InputSwitch), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  checkbox: dynamic(() => import("./fields/field.checkbox").then((mod) => mod.InputCheckboxGroup), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  select: dynamic(() => import("./fields/field.select").then((mod) => mod.InputDropdown), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  radio: dynamic(() => import("./fields/field.radio").then((mod) => mod.InputRadio), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  multiSelect: dynamic(() => import("./fields/field.multi-select").then((mod) => mod.InputMultiDropdown), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  slug: dynamic(() => import("./fields/field.slug").then((mod) => mod.InputSlug), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  otp: dynamic(() => import("./fields/field.otp").then((mod) => mod.InputOtp), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  password: dynamic(() => import("./fields/field.password").then((mod) => mod.InputPassword), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  image: dynamic(() => import("./fields/field.image-upload").then((mod) => mod.ImageUploadText), {
    ssr: false,
    loading: () => loadingImageSkeleton(),
  }),
  color: dynamic(() => import("./fields/field.color").then((mod) => mod.InputRadio), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
  currency: dynamic(() => import("./fields/field.currency").then((mod) => mod.InputCurrency), {
    ssr: false,
    loading: () => loadingInputSkeleton(),
  }),
};
