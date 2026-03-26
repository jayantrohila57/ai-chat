"use client";

import { useId } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/common/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputText: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();

  if (props?.hidden) return null;
  if (props.type !== "text") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <Input
              id={stableId}
              {...field}
              value={field.value ?? ""}
              {...props.fieldProps}
              placeholder={props.placeholder}
              type="text"
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
            />
          </FormControl>
          {props.helperText && <FormDescription className={cn("")}>{props.helperText}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
