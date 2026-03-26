"use client";

import { AlertTriangle, Check, Copy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
// import Header from '@/shared/components/layout/header/header'
import Section from "@/shared/components/layout/section/section";
import { Shell } from "@/shared/components/layout/shell";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { debugError } from "@/shared/utils/lib/logger.utils";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
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
    debugError("Error.tsx", error);
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
      <Shell.Main>
        <Shell.Section>
          <Section title="Error" description="An error occurred while loading this page. Please try again later.">
            <Alert variant="default" className="flex h-full w-full flex-col border-2 border-dashed">
              <div className="flex w-full items-center justify-between">
                <AlertTitle className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="text-destructive h-5 w-5" />
                  {"Error Details"}
                </AlertTitle>
                <div className="flex flex-row gap-4">
                  <Button size="icon" variant="outline" onClick={void copyDetails} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleRetry}
                    disabled={retrying}
                    variant="outline"
                    className="flex w-fit items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {retrying ? "Retrying..." : "Try Again"}
                  </Button>
                </div>
              </div>

              <AlertDescription className="mt-2 rounded-md p-2 wrap-break-word">
                {error.message || "Unknown error occurred."}
              </AlertDescription>

              <div className="bg-destructive/20 mt-2 min-h-[600px] rounded-md p-4">
                <pre className="text-sm wrap-break-word whitespace-pre-wrap">
                  {error.digest ? `Digest: ${error.digest}\n` : ""}
                  {error.name ? `Name: ${error.name}\n` : ""}
                  {error.stack ? `Stack:\n${error.stack}` : ""}
                </pre>
              </div>
            </Alert>
          </Section>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
