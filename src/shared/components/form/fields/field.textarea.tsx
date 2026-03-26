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
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputTextArea: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();

  if (props?.hidden) return null;
  if (props.type !== "textarea") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              {...props.fieldProps}
              rows={props.textAreaRows ?? 6}
              placeholder={props.placeholder}
              readOnly={props.readonly}
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
            />
          </FormControl>
          <FormDescription className={cn("flex justify-between")}>
            <span>{props.helperText}</span>
            <span className={cn("bg-background text-muted-foreground rounded-md")}>
              {"Characters length: "}
              {field.value?.length || 0}
            </span>
          </FormDescription>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
