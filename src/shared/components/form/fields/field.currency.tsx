"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/shared/components/common/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputCurrency: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  // we'll compute display from the current field value inside Controller render

  const { control, register, setValue, getValues, formState } = useFormContext();

  // Using Controller's render we will compute formatted display without calling setState in an effect.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").trim();

    // Store as string so form/schema type is consistent (string); consumers can coerce to number if needed
    if (raw === "") {
      setValue(props.name, "", { shouldValidate: true });
      return;
    }

    const num = Number(raw);
    if (!Number.isNaN(num)) {
      setValue(props.name, raw, { shouldValidate: true });
    }
  };
  if (props?.hidden) return null;
  if (props.type !== "currency") return null;

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
            <div className="*:not-first:mt-2">
              <div className="relative">
                {/* derive display from raw value */}
                <Input
                  className="peer ps-6 pe-12"
                  {...field}
                  {...props?.fieldProps}
                  {...inputConfig}
                  value={
                    field.value === "" || field.value === null || field.value === undefined
                      ? ""
                      : Number(String(field.value)).toLocaleString("en-IN")
                  }
                  onChange={handleChange}
                  type="text"
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                  {props?.prefixCurrency}
                </span>
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                  {props?.postfixCurrency}
                </span>
              </div>
            </div>
          </FormControl>
          <FormDescription>{props?.helperText}</FormDescription>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
