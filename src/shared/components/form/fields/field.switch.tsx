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
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputSwitch: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();

  if (props?.hidden) return null;
  if (props.type !== "switch") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <div className="bg-background dark:bg-input/30 flex items-center justify-between gap-4 rounded-md border p-2">
              <Switch
                {...props.fieldProps}
                ref={field.ref}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                className={cn(fieldState.error && "border-destructive data-[state=checked]:bg-destructive")}
              />
            </div>
          </FormControl>
          <FormDescription className={cn("flex justify-between")}>
            <span>{props.helperText}</span>
          </FormDescription>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
