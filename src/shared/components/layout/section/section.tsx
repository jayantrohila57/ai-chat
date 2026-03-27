import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/shared/utils/lib/utils";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { AppBrand } from "./auth.card-layout";

interface SectionProps {
  title?: string;
  badge?: string;
  description?: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
  actionLink?: Route;
}

export default function Section({ title, badge, description, action, children, className, actionLink }: SectionProps) {
  return (
    <Card className={cn("bg-transparent shadow-none border-0 ring-0 motion-all w-full h-full", className)}>
      <CardHeader className="w-full">
        <CardTitle className="mb-2">
          <Badge variant="outline">{badge}</Badge>
        </CardTitle>
        <CardTitle className="text-4xl font-semibold tracking-tight max-w-3xl">{title}</CardTitle>{" "}
        <CardDescription className="text-sm leading-6 text-muted-foreground max-w-3xl">{description}</CardDescription>
        <CardAction className="flex flex-row items-end justify-end mt-6">
          {action && actionLink && (
            <Link href={actionLink}>
              <Button size="lg">{action}</Button>
            </Link>
          )}
        </CardAction>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent className="min-h-128">{children}</CardContent>
      <Separator className="my-2" />
      <CardFooter className="mt-auto flex justify-center items-end">
        <AppBrand className="flex items-end justify-center p-0" />
      </CardFooter>
    </Card>
  );
}
