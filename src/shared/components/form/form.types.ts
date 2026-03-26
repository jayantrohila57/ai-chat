import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { DefaultValues, FieldErrors, FieldValues, Path, UseFormReturn } from "react-hook-form";
import type z from "zod/v3";
import type { buttonVariants } from "../ui/button";
import type { Fields } from "./fields.config";

export type FieldType = keyof typeof Fields;

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  icon?: LucideIcon | undefined | ReactNode;
  color?: string;
  [key: string]: string | boolean | undefined | LucideIcon | ReactNode;
}

export interface BaseFormInputProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  slugField?: string;
  hidden?: boolean;
  className?: string;
  readonly?: boolean;
  disabled?: boolean;
  helperText?: string;
  fieldProps?: object;
  required?: boolean;
}

export interface StandardInputProps extends BaseFormInputProps {
  type: Exclude<
    FieldType,
    | "number"
    | "select"
    | "radio"
    | "textarea"
    | "checkbox"
    | "switch"
    | "multiSelect"
    | "slug"
    | "otp"
    | "password"
    | "image"
    | "color"
    | "currency"
  >;
}
export interface NumberInputProps extends BaseFormInputProps {
  type: "number";
  max?: number;
  min?: number;
}
export interface CurrencyInputProps extends BaseFormInputProps {
  type: "currency";
  prefixCurrency?: string;
  postfixCurrency?: string;
  max?: number;
  min?: number;
}

export interface SelectionInputProps extends BaseFormInputProps {
  type: "select" | "radio" | "checkbox";
  options: Option[];
}
export interface MultiSelectInputProps extends BaseFormInputProps {
  type: "multiSelect";
  options: Option[];
}
export interface TextareaInputProps extends BaseFormInputProps {
  maxLength?: boolean;
  type: "textarea";
  textAreaRows?: number;
}
export interface SwitchInputProps extends BaseFormInputProps {
  type: "switch";
  checked?: boolean;
}

export interface SlugInputProps extends BaseFormInputProps {
  type: "slug";
  inlinePrefix?: string;
}
export interface OtpInputProps extends BaseFormInputProps {
  type: "otp";
}
export interface PasswordInputProps extends BaseFormInputProps {
  type: "password";
  needValidation?: boolean;
}
export interface ImageInputProps extends BaseFormInputProps {
  type: "image";
  maxSizeMB?: number;
}

export interface ColorInputProps extends BaseFormInputProps {
  type: "color";
  options: Option[];
}
export type FormInputProps =
  | StandardInputProps
  | NumberInputProps
  | SelectionInputProps
  | MultiSelectInputProps
  | TextareaInputProps
  | SwitchInputProps
  | SlugInputProps
  | OtpInputProps
  | PasswordInputProps
  | ImageInputProps
  | ColorInputProps
  | CurrencyInputProps;

export interface FormProps<T extends z.ZodTypeAny> {
  className?: string;
  defaultValues: DefaultValues<z.infer<T>>;
  schema: T;
  onSubmitAction: (values: z.infer<T>) => void;
  children: ReactNode;
}
export interface FormContextProps<TFieldValues extends FieldValues> {
  children: (context: UseFormReturn<TFieldValues>) => React.ReactNode;
}
export interface FieldsWrapperProps {
  fieldsConfig: FormInputProps[];
}

export interface FormWatchPayload<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> {
  value: TFieldValues[TName];
  form: UseFormReturn<TFieldValues>;
}

export interface FormWatchProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  children: <TName extends Path<TFieldValues>>(payload: FormWatchPayload<TFieldValues, TName>) => React.ReactNode;
}

export interface FormWatchErrorProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  children: (error: FieldErrors<TFieldValues>[Path<TFieldValues>]) => React.ReactNode;
}

export interface FormGroupType {
  children: (props: {
    add: (value: unknown) => void;
    index: number;
    remove: (index: number) => void;
    length: number;
  }) => ReactNode;
  name: string;
  hidden?: boolean;
}

export interface SubmitButtonProps extends VariantProps<typeof buttonVariants> {
  disabled?: boolean;
  label?: string;
  className?: string;
  isLoading?: boolean;
}

export interface FormIsValidProps {
  className?: string;
  showWhenValid?: boolean;
}
