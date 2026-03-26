"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

const GoBackButton = memo(() => {
  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            onClick={handleGoBack}
            variant={"ghost"}
            aria-label="Back"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleGoBack();
              }
            }}
          >
            <ArrowLeftIcon aria-hidden="true" focusable="false" role="presentation" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p id="go-back-tooltip">{"Back"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

GoBackButton.displayName = "GoBackButton";

export default GoBackButton;
