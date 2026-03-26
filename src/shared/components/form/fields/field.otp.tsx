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
import { cn } from "@/shared/utils/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import type { FormInputProps } from "../form.types";

export const InputOtp: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();

  if (props?.hidden) return null;
  if (props.type !== "otp") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel className="mx-auto" required={props.required}>
            {props.label}
          </FormLabel>
          <FormControl>
            <InputOTP
              maxLength={6}
              {...field}
              {...props.fieldProps}
              placeholder={props.placeholder}
              type="text"
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
            >
              <InputOTPGroup className="mx-auto grid grid-cols-6 px-8">
                <InputOTPSlot className="aspect-square h-auto w-10" index={0} />
                <InputOTPSlot className="aspect-square h-auto w-10" index={1} />
                <InputOTPSlot className="aspect-square h-auto w-10" index={2} />
                <InputOTPSlot className="aspect-square h-auto w-10" index={3} />
                <InputOTPSlot className="aspect-square h-auto w-10" index={4} />
                <InputOTPSlot className="aspect-square h-auto w-10" index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {props.helperText && <FormDescription className={cn("text-center")}>{props.helperText}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
