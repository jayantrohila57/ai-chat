"use client";

import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/shared/components/common/form";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputRadio: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;

  const { control } = useFormContext();
  if (props?.hidden) return null;
  if (props.type !== "radio") return null;
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
              className="flex flex-row space-x-6"
            >
              {props?.options?.map((option) => (
                <FormItem key={option.value} className="flex flex-row items-center space-x-3">
                  <FormControl>
                    <RadioGroupItem value={String(option.value)}>
                      {option.icon && typeof option.icon === "function" && (
                        <option.icon className={cn("h-4 w-4", option.color)} />
                      )}
                      {option.label && <Label className="text-xs">{option.label}</Label>}
                    </RadioGroupItem>
                  </FormControl>
                  <Label className="items-center">{option.label}</Label>
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
