import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/shared/utils/lib/utils";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";

interface SectionProps {
  title?: string;
  description?: string;
  action?: string;
  children: React.ReactNode;
  separator?: boolean;
  variant?: "default" | "full";
  className?: string;
  actionLink?: Route;
  isMinHeight?: boolean;
  icon?: LucideIcon;
}

export default function Section({
  variant,
  title,
  description,
  action,
  children,
  separator = true,
  isMinHeight = true,
  className,
  icon,
  actionLink,
}: SectionProps) {
  const DynamicIcon = icon;
  return (
    <Card className={cn("bg-background ring-0 gap-0 border-none p-0 shadow-none", className)}>
      {title && description && (
        <div className="w-full p-0 border-t flex flex-row">
          {DynamicIcon && (
            <div className="h-full w-40 aspect-square border-r flex items-center justify-center">
              <DynamicIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <CardHeader className="p-4 w-full">
            {title && <CardTitle className="text-4xl font-semibold">{title}</CardTitle>}
            {description && (
              <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
            )}
            <CardAction className="flex flex-row items-end justify-end mt-6">
              {action && actionLink && (
                <Link href={actionLink}>
                  <Button>{action}</Button>
                </Link>
              )}
            </CardAction>
          </CardHeader>
        </div>
      )}
      <div className="w-full  border-t"></div>
      <CardContent className={cn("p-0", isMinHeight && "min-h-[600px]")}>{children}</CardContent>
    </Card>
  );
}
