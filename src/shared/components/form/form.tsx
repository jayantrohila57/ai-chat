"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dot, Info, Loader } from "lucide-react";
import { Children, Fragment, type JSX, memo, useEffect, useMemo } from "react";
import { type FieldValues, FormProvider, useForm, useFormContext, useFormState, useWatch } from "react-hook-form";
import type z from "zod/v3";
import { debugLog } from "@/shared/utils/lib/logger.utils";
import { cn } from "@/shared/utils/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Separator } from "../ui/separator";
import { Fields } from "./fields.config";
import type {
  FieldsWrapperProps,
  FormContextProps,
  FormGroupType,
  FormInputProps,
  FormProps,
  FormWatchErrorProps,
  FormWatchProps,
  SubmitButtonProps,
} from "./form.types";

export const Form = <T extends z.ZodTypeAny>(props: FormProps<T>) => {
  const { onSubmitAction, className, children, schema, defaultValues } = props;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "all",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    shouldFocusError: true,
    progressive: true,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void form.handleSubmit((values: z.infer<T>) => {
      onSubmitAction(values);
    })();
  };

  const watch = useWatch({ control: form.control });
  useEffect(() => {
    debugLog("watch", watch);
  }, [watch]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={cn("", className)}>
        {children}
      </form>
    </FormProvider>
  );
};

const FormContext = memo(<TFieldValues extends FieldValues>({ children }: FormContextProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>();
  return <>{children(context)}</>;
});

FormContext.displayName = "FormContext";

const Field = memo((props: FormInputProps) => {
  const Element = Fields[props?.type];
  if (!Element) return null;
  return <Element {...props} />;
});

Field.displayName = "Field";

const FieldsWrapper = memo(({ fieldsConfig = [] }: FieldsWrapperProps) => {
  const fields = useMemo(() => {
    return fieldsConfig?.map((props: FormInputProps) => {
      return <Field key={props?.name} {...props} />;
    });
  }, [fieldsConfig]);

  return <Fragment>{fields}</Fragment>;
});

FieldsWrapper.displayName = "FieldsWrapper";

const FormWatch = memo(<TFieldValues extends FieldValues>({ name, children }: FormWatchProps<TFieldValues>) => {
  const form = useFormContext<TFieldValues>();
  const value = useWatch({ control: form.control, name });
  return (
    <>
      {children({
        value,
        form,
      })}
    </>
  );
});

FormWatch.displayName = "FormWatch";

const FormWatchError = memo(
  <TFieldValues extends FieldValues>({ name, children }: FormWatchErrorProps<TFieldValues>) => {
    const {
      formState: { errors },
    } = useFormContext<TFieldValues>();
    const error = errors[name];
    return <>{children(error)}</>;
  },
);

FormWatchError.displayName = "FormWatchError";

const FormGroup = memo(({ children, name, hidden }: FormGroupType) => {
  const { setValue, getValues, control } = useFormContext();
  const watch = useWatch({ name, control });
  const add = (value: unknown) => setValue(name, [...getValues(name), value]);
  const remove = (index: number) =>
    setValue(
      name,
      (getValues(name) as [])?.filter((_, i) => i !== index),
    );
  const length = (watch as [])?.length;
  if (hidden) return null;
  return ((watch as []) ?? [])?.map((_, index) => Children?.toArray(children({ add, index, remove, length })));
});

FormGroup.displayName = "FormGroup";

const renderErrors = (obj: Record<string, unknown>, parentKey = ""): JSX.Element | null => {
  if (!obj || typeof obj !== "object") return null;

  return (
    <ul className="border-muted space-y-1 border-l pl-3">
      {Object.entries(obj).map(([key, value]) => {
        const path = parentKey ? `${parentKey}.${key}` : key;
        const hasNested = typeof value === "object" && value !== null && !("message" in (value as object));

        return (
          <li key={path} className="flex flex-col gap-1">
            <div className="flex items-start gap-1">
              <Dot className="text-muted-foreground mt-1 h-3 w-3 shrink-0" />
              <span className="text-xs">
                <strong className="capitalize">{key}</strong>
                {typeof value === "object" && value !== null && "message" in value && (
                  <>
                    {" : "}
                    <span className="text-destructive">{String((value as { message?: unknown }).message)}</span>
                  </>
                )}
              </span>
            </div>
            {hasNested && <div className="ml-3">{renderErrors(value as Record<string, unknown>, path)}</div>}
          </li>
        );
      })}
    </ul>
  );
};

interface StatusBadgeProps<TFieldValues extends FieldValues> {
  label?: string;
  className?: string;
}

const StatusBadge = memo(<TFieldValues extends FieldValues>({ label, className }: StatusBadgeProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();
  const { isValid, errors } = useFormState({
    control,
    name: undefined,
  });
  const errorEntries = useMemo(() => Object?.entries(errors), [errors]);

  return (
    <div className="relative">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "relative flex h-8 cursor-pointer items-center gap-1 select-none",
              isValid ? "text-green-600" : "text-red-600",
              className,
            )}
          >
            <Info className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground">{label ?? "Form Status"}</span>
            <Separator orientation="vertical" className="mx-2" />
            {isValid ? (
              <Dot className="h-2 w-2 rounded-full border border-green-600 bg-green-600" />
            ) : (
              <Dot className="border-destructive bg-destructive h-2 w-2 rounded-full border" />
            )}
            {isValid ? "Valid" : "Invalid"}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="bg-card w-full rounded-2xl border p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-base font-medium">{label ?? "Form Status"}</p>
            <span className={cn("h-2 w-2 rounded-full", isValid ? "animate-pulse bg-green-500" : "bg-destructive")} />
          </div>

          <p className={cn("mb-3 text-sm", isValid ? "text-green-600" : "text-destructive")}>
            {isValid ? "All good! No errors detected." : "Oops! Some errors found."}
          </p>

          {Object.keys(errors).length > 0 ? (
            <div className="bg-background max-h-60 overflow-y-auto rounded-sm border p-2">{renderErrors(errors)}</div>
          ) : (
            <p className="text-muted-foreground text-xs">
              {isValid
                ? "You can submit the form now."
                : "Oops! Some errors found. Submit the form to see more details."}
            </p>
          )}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

const SubmitButton = ({ variant, label = "Submit", isLoading, className, disabled }: SubmitButtonProps) => {
  return (
    <Button variant={variant} type="submit" disabled={disabled || isLoading} className={cn("", className)}>
      {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading ? label : "Submitting..."}
    </Button>
  );
};

SubmitButton.displayName = "FormSubmitButton";

// Add explicit displayName to top-level component so lint doesn't complain
Form.displayName = "Form";
Form.Field = Field;
Form.Submit = SubmitButton;
Form.FormWatch = FormWatch;
Form.FormWatchError = FormWatchError;
Form.FieldsWrapper = FieldsWrapper;
Form.FormContext = FormContext;
Form.StatusBadge = StatusBadge;
Form.FormGroup = FormGroup;

export default Form;
