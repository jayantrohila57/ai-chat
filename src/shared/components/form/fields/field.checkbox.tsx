"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/shared/components/common/form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputCheckboxGroup: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;

  const { control } = useFormContext();
  if (props?.hidden) return null;
  if (props.type !== "checkbox") return null;
  return (
    <Controller
      name={props?.name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value || [];
        const toggleOption = (optionValue: string | number) => {
          const newValue = value.includes(optionValue)
            ? value.filter((v: string) => v !== optionValue)
            : [...value, optionValue];
          field.onChange(newValue);
        };

        return (
          <FormItem id={stableId}>
            <FormLabel required={props.required}>{props.label}</FormLabel>
            <FormControl className={cn(props?.className)}>
              <div
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input motion-all flex h-9 w-full min-w-0 items-center justify-start rounded-md border bg-transparent p-2 text-base shadow-xs outline-none file:inline-flex file:h-9 file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                )}
              >
                {props?.options?.map((option) => (
                  <div key={option.value} className="flex items-center gap-x-2">
                    <Checkbox
                      checked={value.includes(option.value)}
                      onCheckedChange={() => toggleOption(option.value)}
                    />
                    <Label className="text-xs">{option.label}</Label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormDescription>{props?.helperText}</FormDescription>
            <FormMessage>{fieldState?.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
