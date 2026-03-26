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
import type { FormInputProps } from "@/shared/components/form/form.types";
import { cn } from "@/shared/utils/lib/utils";
import MultipleSelector from "../../common/multiselect";

export const InputMultiDropdown: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();

  if (props?.hidden) return null;
  if (props.type !== "multiSelect") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <MultipleSelector
              {...field}
              {...props.fieldProps}
              // value={field.value ? props.options?.filter((opt) => field.value.includes(opt.value)) || [] : []}
              onChange={(selected) => field.onChange(selected.map((item) => item.value))}
              commandProps={{
                label: props.label,
              }}
              // defaultOptions={props.options}
              placeholder={props.placeholder}
              emptyIndicator={<p className="text-center text-sm">{"No results found"}</p>}
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
