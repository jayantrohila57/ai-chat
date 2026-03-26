import "@/shared/styles/globals.css";

import { TRPCReactProvider } from "@/core/api/api.client";
import { ThemeProvider } from "@/core/theme/theme.provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { className, viewport } from "@/shared/utils/methods/font";
import { Figtree } from "next/font/google";
import { cn } from "@/shared/utils/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});


export { viewport };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", figtree.variable)}>
      <body suppressHydrationWarning className={className}>
        <TRPCReactProvider>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
