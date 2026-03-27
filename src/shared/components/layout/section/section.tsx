import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/shared/utils/lib/utils";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

interface SectionProps {
  title?: string;
  description?: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
  actionLink?: Route;
}

export default function Section({ title, description, action, children, className, actionLink }: SectionProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        {title && <CardTitle className="text-3xl">{title}</CardTitle>}
        {description && <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>}
        <CardAction className="flex flex-row items-end justify-end mt-6">
          {action && actionLink && (
            <Link href={actionLink}>
              <Button>{action}</Button>
            </Link>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
