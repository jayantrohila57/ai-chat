import { Copyright } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { site } from "@/shared/config/site";
import { cn } from "@/shared/utils/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="w-full h-full flex flex-col justify-center items-center overflow-hidden border max-w-md mx-auto">
      <CardContent className="border-r p-0">
        <CardHeader className="mb-2 border-b p-6">
          <CardTitle className="w-full text-left text-3xl text-balance">{title}</CardTitle>
          <CardDescription className="w-full text-left text-sm text-pretty">{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6">
          {children}
          <div className="flex items-center justify-center pt-2">{footer}</div>
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-start p-6 pt-0">
          <Alert>
            <AlertTitle>Starter note</AlertTitle>
            <AlertDescription className="flex flex-row flex-wrap gap-1">
              Authentication is fully enabled here so the next implementation pass can focus on conversations,
              workspaces, and message handling.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export function AuthFooterNote({ hint, action, href }: { hint: string; action: string; href: Route }) {
  return (
    <p className="text-muted-foreground text-center text-sm">
      {hint}{" "}
      <Link href={href} className="text-primary hover:text-primary/80 underline underline-offset-4">
        {action}
      </Link>
    </p>
  );
}

export function AppBrand({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted-foreground text-center text-xs", className)}>
      <Copyright className="mr-1 inline-block h-3 w-3" /> {`Copyright ${new Date().getFullYear()} - ${site.name}`} All
      rights reserved
    </p>
  );
}
