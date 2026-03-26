"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useId, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/common/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/lib/utils";
import { ValidationRequired } from "../../common/validation-required";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import type { FormInputProps } from "../form.types";

export const InputPassword: React.FC<FormInputProps> = (props) => {
  const reactId = useId();
  const stableId = props?.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  if (props?.hidden) return null;
  if (props.type !== "password") return null;
  const isValidationRequired = Boolean(props?.needValidation) ?? false;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                id={stableId}
                {...field}
                {...props.fieldProps}
                type={isVisible ? "text" : "password"}
                placeholder={props.placeholder}
                aria-describedby={`${reactId}-description`}
                className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon-sm"}
                      className="absolute inset-y-0.5 end-0.5 flex h-8 w-8 items-center justify-center rounded-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{isVisible ? "Hide password" : "Show password"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          {isValidationRequired && <ValidationRequired {...props} />}
          {props.helperText && <FormDescription className={cn("")}>{props.helperText}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
