import type { Route } from "next";
import Link from "next/link";
import { slugToTitle } from "@/shared/utils/lib/url.utils";
import { Button } from "../../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

interface SectionProps<T extends string = string> {
  title?: string;
  description?: string;
  action?: string;
  actionUrl?: T;
  children: React.ReactNode;
}

export default function DashboardSection({ title, description, action, actionUrl, children }: SectionProps<Route>) {
  return (
    <Card className="bg-transparent p-0 gap-0 shadow-none border-0 ring-0 motion-all">
      <CardHeader className="border-b p-2 px-4 gap-0">
        <CardTitle className="text-3xl">{slugToTitle(title)}</CardTitle>
        <CardDescription className="">{description}</CardDescription>
        <CardAction>
          {action && (
            <Button variant={"default"} asChild={actionUrl ? true : false}>
              {actionUrl && <Link href={actionUrl}>{action}</Link>}
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <div className="">
        <CardContent className="p-0 h-[calc(100vh-9.4rem)] motion-all w-full overflow-auto">{children}</CardContent>
      </div>
    </Card>
  );
}
