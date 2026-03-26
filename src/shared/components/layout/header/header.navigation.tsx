"use client";

import Link from "next/link";
import { useSession } from "@/core/auth/auth.client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shared/components/ui/navigation-menu";
import { PATH } from "@/shared/config/routes";

export function NavigationMenuComponent() {
  const { data: session } = useSession();

  return (
    <NavigationMenu>
      <NavigationMenuList className="h-full p-0">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.ROOT}>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {session?.user && (
          <NavigationMenuItem className="hidden md:flex">
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={PATH.ACCOUNT.ROOT}>Account</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.STUDIO.ROOT}>Studio</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={PATH.AUTH.ROOT}>Auth</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
