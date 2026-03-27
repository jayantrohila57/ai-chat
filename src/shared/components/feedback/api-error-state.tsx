"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function ApiErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
}: {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-dashed border-destructive/40">
      <CardHeader>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-4" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {onRetry ? (
        <CardContent>
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="size-4" />
            {retryLabel}
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
