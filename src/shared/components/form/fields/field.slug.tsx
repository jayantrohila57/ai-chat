"use client";

import { LinkIcon } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/common/form";
import { Input } from "@/shared/components/ui/input";
import { nameToSlug } from "@/shared/utils/lib/url.utils";
import { cn } from "@/shared/utils/lib/utils";
import type { FormInputProps } from "../form.types";

export const InputSlug: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control, setValue } = useFormContext();
  const sourceValue = useWatch({ control, name: props.slugField || "" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!props.slugField) return;
    if (!sourceValue) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const slug = nameToSlug(String(sourceValue));
      setValue(props.name, slug, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sourceValue, props.slugField, props.name, setValue]);

  if (props?.hidden) return null;
  if (props.type !== "slug") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn("w-full", props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <div className="relative flex w-full rounded-md">
              {props.inlinePrefix && (
                <span
                  className={cn(
                    "inline-flex w-full max-w-fit items-center rounded-s-md border px-3",
                    "bg-background dark:bg-input/30 border-input shadow-xs",
                    "gap-2",
                  )}
                >
                  <LinkIcon className="text-primary size-4" />
                  <span className="inline-block w-full text-sm">{props.inlinePrefix}</span>
                </span>
              )}
              <Input
                {...field}
                readOnly
                placeholder={props.placeholder}
                type="text"
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive",
                  props.inlinePrefix && "-ms-px rounded-s-none shadow-xs",
                )}
              />
            </div>
          </FormControl>
          {props.helperText && <FormDescription>{props.helperText}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
