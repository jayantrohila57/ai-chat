"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/shared/components/common/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputDropdown: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;

  const { control } = useFormContext();

  if (props?.hidden) return null;
  if (props.type !== "select" && props.type !== "multiSelect") return null;
  return (
    <Controller
      name={props?.name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl className={cn(props?.className)}>
            <Select
              {...field}
              {...props?.fieldProps}
              value={field.value || ""}
              onValueChange={(value) => {
                if (value === "select-status" || value === "select-type") {
                  field.onChange(undefined);
                } else {
                  field.onChange(value);
                }
              }}
            >
              <SelectTrigger
                id={props?.name}
                className={cn(
                  "focus:ring-ring bg-background dark:bg-input/30 w-full focus:ring-2 focus:ring-offset-2",
                  fieldState.error && "border-destructive focus:ring-destructive/50",
                )}
              >
                <SelectValue placeholder={props?.placeholder || "Select an option..."}>
                  {(() => {
                    const selected = props?.options?.find((opt) => opt.value === field.value);
                    if (!selected) return props?.placeholder || "Select...";
                    const { icon, label, color } = selected;
                    const Comp = icon as LucideIcon;
                    return (
                      <div className="flex items-center gap-2">
                        {Comp && typeof Comp === "function" && <Comp className={cn("h-4 w-4", color)} />}
                        <span className={cn(color)}>{label}</span>
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {props?.options?.map((option) => {
                  const OptionIcon = option?.icon as LucideIcon;
                  return (
                    option && (
                      <SelectItem
                        key={option?.value}
                        value={String(option?.value)}
                        disabled={Boolean(option?.disabled)}
                      >
                        <div className="flex items-center gap-2">
                          {OptionIcon && typeof OptionIcon === "function" && (
                            <OptionIcon className={cn("h-4 w-4", option.color)} />
                          )}
                          <span className={cn(option.color)}>{option?.label}</span>
                        </div>
                      </SelectItem>
                    )
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>{props?.helperText}</FormDescription>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
