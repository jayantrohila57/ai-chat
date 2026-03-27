"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient, getApiResponseData, getApiResponseMessage } from "@/core/api/api.client";
import { ApiErrorState } from "@/shared/components/feedback/api-error-state";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function SystemStatusCard() {
  const query = apiClient.system.health.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const data = getApiResponseData(query.data);
  const healthy = Boolean(data) && !query.isError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current health and status of the backend API.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">API Status</span>

          {query.isLoading ? (
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

        {query.isError ? (
          <ApiErrorState
            title="Health check failed"
            message={getApiResponseMessage(query.error, "Unable to reach the backend API.")}
            onRetry={() => void query.refetch()}
          />
        ) : null}

        {data ? (
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
        ) : null}
      </CardContent>
    </Card>
  );
}
