"use client";

import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";
import { toast } from "sonner";
import { signOut } from "@/core/auth/auth.client";
import { PATH } from "@/shared/config/routes";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { cn } from "@/shared/utils/lib/utils";

export const SignOutDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      const toastId = toast.loading("Signing Out");
      try {
        await signOut();
        toast.success("Signed Out", { id: toastId });
        router.push(PATH.SITE.ROOT);
      } catch (error) {
        debugError("SIGNOUT ERROR", { error });
        toast.error("Failed to Sign Out", { id: toastId });
      }
    });
  };

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant="destructive"
      className={cn(
        "group/dropdown-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive",
        className,
      )}
      onClick={handleSignOut}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {isLoading ? "Signing Out" : "Sign Out"}
    </DropdownMenuPrimitive.Item>
  );
});
SignOutDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
