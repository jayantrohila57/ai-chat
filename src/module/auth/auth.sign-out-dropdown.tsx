"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
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
      ref={ref}
      onClick={handleSignOut}
      disabled={isLoading}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground motion-colors relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {isLoading ? "Signing Out" : "Sign Out"}
    </DropdownMenuPrimitive.Item>
  );
});
SignOutDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
