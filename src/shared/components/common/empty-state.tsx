import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/shared/utils/lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

interface EmptyStateProps {
  title: string;
  description: string;
  icons?: LucideIcon[];
  action?: {
    label: string;
    url: string;
  };
  className?: string;
}

export function EmptyState({ title, description, icons = [], action, className }: EmptyStateProps) {
  return (
    <Card className="h-full p-0 bg-transparent border-0 ring-0 shadow-none">
      <div
        className={cn(
          "text-center",
          "flex h-full w-full flex-col items-center justify-center",
          "group hover:bg-muted/50 transition duration-500 hover:duration-200",
          className,
        )}
      >
        <div className="isolate mb-4 flex w-full justify-center">
          {icons?.length === 3 ? (
            <>
              <div className="bg-background ring-border relative top-1.5 left-2.5 grid size-24 -rotate-6 place-items-center rounded-xl  ring-1 transition duration-500 group-hover:-translate-x-5 group-hover:-translate-y-0.5 group-hover:-rotate-12 group-hover:duration-200">
                {React.createElement(icons[0]!, {
                  className: "h-6 w-6 text-muted-foreground",
                })}
              </div>
              <div className="bg-background ring-border relative z-10 grid size-24 place-items-center rounded-xl  ring-1 transition duration-500 group-hover:-translate-y-0.5 group-hover:duration-200">
                {React.createElement(icons[1]!, {
                  className: "h-6 w-6 text-muted-foreground",
                })}
              </div>
              <div className="bg-background ring-border relative top-1.5 right-2.5 grid size-24 rotate-6 place-items-center rounded-xl  ring-1 transition duration-500 group-hover:translate-x-5 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:duration-200">
                {React.createElement(icons[2]!, {
                  className: "h-6 w-6 text-muted-foreground",
                })}
              </div>
            </>
          ) : (
            <div className="bg-background ring-border grid size-24 place-items-center rounded-xl  ring-1 transition duration-500 group-hover:-translate-y-0.5 group-hover:duration-200">
              {icons[0] &&
                React.createElement(icons[0], {
                  className: "h-6 w-6 text-muted-foreground",
                })}
            </div>
          )}
        </div>
        <div className="isolate">
          <h2 className="text-foreground mt-6 text-2xl font-medium">{title}</h2>
          <p className="text-muted-foreground mt-1 whitespace-pre-line">{description}</p>
          {action && (
            <Link href={action.url as Route}>
              <Button variant="outline" className={cn("mt-4", "shadow-sm active:shadow-none")}>
                {action.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
