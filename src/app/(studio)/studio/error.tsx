"use client";

import { AlertTriangle, Check, Copy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { debugError } from "@/shared/utils/lib/logger.utils";

export default function StudioError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const copyDetails = async () => {
    const details = `
${error.message || "Unknown error occurred."}
${error.digest ? `Digest: ${error.digest}` : ""}
${error.name ? `Name: ${error.name}` : ""}
${error.stack ? `Stack: ${error.stack}` : ""}`;
    await navigator.clipboard.writeText(details.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    debugError("Studio Error.tsx", error);
  }, [error]);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      reset();
      setRetrying(false);
    }, 800);
  };

  return (
    <Shell>
      <Shell.Main variant="dashboard">
        <Shell.Section variant="dashboard">
          <DashboardSection
            title="Something went wrong"
            description="An unexpected error occurred in the Studio. You can try to reset the current view or report the issue."
          >
            <div className="w-full p-4 h-full space-y-4">
              <Alert variant="destructive" className="flex flex-col border-2 border-dashed">
                <div className="flex w-full items-center justify-between">
                  <AlertTitle className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-5 w-5" />
                    {"Error Details"}
                  </AlertTitle>
                  <div className="flex flex-row gap-2">
                    <Button size="sm" variant="outline" onClick={() => void copyDetails()} className="h-8 gap-2">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Stack</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRetry}
                      disabled={retrying}
                      variant="default"
                      className="flex h-8 w-fit items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
                      {retrying ? "Retrying..." : "Try Again"}
                    </Button>
                  </div>
                </div>

                <AlertDescription className="mt-2 rounded-md bg-destructive/10 p-2 font-mono text-xs">
                  {error.message || "Unknown error occurred."}
                </AlertDescription>

                <div className="mt-4 rounded-md bg-muted p-4">
                  <pre className="text-[10px] leading-relaxed text-muted-foreground">
                    {error.digest ? `Digest: ${error.digest}\n\n` : ""}
                    {error.name ? `Name: ${error.name}\n\n` : ""}
                    {error.stack ? `Stack:\n${error.stack}` : "No stack trace available."}
                  </pre>
                </div>
              </Alert>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
