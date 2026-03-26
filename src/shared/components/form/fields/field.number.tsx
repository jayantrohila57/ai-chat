"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/shared/components/common/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputNumber: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;

  const { control } = useFormContext();
  if (props?.hidden) return null;
  if (props.type !== "number") return null;

  const inputConfig = {
    placeholder: props?.placeholder,
    type: "number",
    max: props?.max,
    min: props?.min,
    readOnly: props?.readonly,
  };

  return (
    <Controller
      name={props?.name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem id={stableId}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl className={cn(props?.className)}>
            <Input
              {...field}
              {...props?.fieldProps}
              {...inputConfig}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === "" ? "" : Number(val));
              }}
            />
          </FormControl>
          <FormDescription>{props?.helperText}</FormDescription>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
