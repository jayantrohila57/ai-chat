"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/shared/components/common/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/shared/utils/lib/utils";
import { Label } from "../../ui/label";
import type { FormInputProps } from "../form.types";

export const InputRadio: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;

  const { control } = useFormContext();
  if (props?.hidden) return null;
  if (props.type !== "color") return null;
  return (
    <Controller
      name={props?.name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem id={stableId}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl className={cn(props?.className)}>
            <RadioGroup
              {...field}
              {...props?.fieldProps}
              onValueChange={field.onChange}
              className="bg-background dark:bg-input/30 flex flex-row gap-2 rounded-md border p-2"
            >
              {props?.options?.map(({ value, color, icon: Icon, label }) => (
                <FormItem key={value} className="flex flex-col items-center">
                  <FormControl>
                    <RadioGroupItem
                      value={String(value)}
                      className={cn(
                        "rounded shadow-none transition-all duration-300",
                        "h-5 w-5 data-[state=checked]:h-5 data-[state=checked]:w-12",
                        color,
                      )}
                    >
                      {Icon && typeof Icon === "function" && <Icon className={cn("h-4 w-4", color)} />}
                      {label && <Label className="text-xs">{label}</Label>}
                    </RadioGroupItem>
                  </FormControl>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormDescription>{props?.helperText}</FormDescription>
          <FormMessage>{fieldState?.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
