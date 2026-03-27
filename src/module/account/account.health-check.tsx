"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/core/api/api.client";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function SystemStatusCard() {
  const { data, isLoading, error } = apiClient.system.health.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const healthy = !!data && !error;

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current health and status of the backend API.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">API Status</span>

          {isLoading ? (
            <Badge variant="secondary">Checking...</Badge>
          ) : healthy ? (
            <Badge className="gap-1">
              <CheckCircle2 size={14} />
              Healthy
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle size={14} />
              Unreachable
            </Badge>
          )}
        </div>

        {data && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application</span>
              <span>{data.appName}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Version</span>
              <span>{data.version}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Server Time</span>
              <span>{new Date(data.timestamp).toLocaleString()}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
