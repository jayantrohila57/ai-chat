"use client";

import { CheckIcon, InfoIcon, XIcon } from "lucide-react";
import { useId } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { FormInputProps } from "@/shared/components/form/form.types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/hover-card";

const checkStrength = (pass: string) => {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(pass),
    text: req.text,
  }));
};

const getStrengthColor = (score: number) => {
  if (score === 0) return "bg-border";
  if (score <= 1) return "bg-red-500";
  if (score <= 2) return "bg-orange-500";
  if (score === 3) return "bg-amber-500";
  return "bg-emerald-500";
};

const getStrengthText = (score: number) => {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak password";
  if (score === 3) return "Medium password";
  return "Strong password";
};

export const ValidationRequired = (props: FormInputProps) => {
  const reactId = useId();

  const { control } = useFormContext();

  const password = useWatch({
    control,
    name: props.name,
  }) as string;

  const strength = checkStrength(password || "");

  const strengthScore = strength.filter((req) => req.met).length;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex flex-row items-center justify-start gap-1.5 px-0.5">
          <InfoIcon className="h-6 w-6" />
          <p className="inline-flex w-full text-xs">Password strength</p>
          <div
            className="bg-border h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(strengthScore)} motion-all`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" sideOffset={2}>
        <p id={`${reactId}-description`} className="text-foreground mb-2 text-sm font-medium">
          {getStrengthText(strengthScore)}. Must contain:
        </p>

        <ul className="space-y-1.5" aria-label="Password requirements">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
              ) : (
                <XIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
              )}
              <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
                {req.text}
                <span className="sr-only">{req.met ? " - Requirement met" : " - Requirement not met"}</span>
              </span>
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
};
