import "@/shared/styles/globals.css";

import { TRPCReactProvider } from "@/core/api/api.client";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { GlobalModalProvider } from "@/shared/components/provider/global-modal.provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/utils/lib/utils";
import { className, viewport } from "@/shared/utils/methods/font";

export { viewport };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(className)}>
      <body suppressHydrationWarning className={className}>
        <TRPCReactProvider>
          <ThemeProvider>
            <TooltipProvider>
              <GlobalModalProvider>{children}</GlobalModalProvider>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
