import { CheckCircle, XCircle } from "lucide-react";
import type * as React from "react";
import { cn } from "@/shared/utils/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
};

export function FormSection({ title, description, children, className, required }: FormSectionProps) {
  const id = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={cn("flex flex-col gap-4 p-4", className)} role="group" aria-labelledby={id}>
      <div className="">
        <h2 id={id} className="leading-6 font-medium">
          {title}
          {required ? (
            <span className="text-destructive" aria-hidden="true">
              {" "}
              {"*"}
            </span>
          ) : null}
        </h2>
        {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
      </div>
      <div className="h-full w-full space-y-4 py-1 pr-0.5">{children}</div>
    </div>
  );
}

interface BadgeProps {
  isValid: boolean;
  label?: string;
  className?: string;
}

export function StatusBadge({ isValid, label, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl px-3 py-1 text-sm font-medium shadow-sm",
        isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
        className,
      )}
    >
      {isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      {label ?? (isValid ? "Valid" : "Invalid")}
    </div>
  );
}
