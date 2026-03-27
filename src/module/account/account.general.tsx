"use client";

import { ModeToggle } from "@/core/theme/theme.selector";
import { ZoomControl } from "@/shared/components/common/zoom.control";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { SystemStatusCard } from "./account.health-check";

export function GeneralSettings() {
  return (
    <div className="space-y-6 p-1 w-full">
      <ThemeCard />
      <ZoomCard />
      <SystemStatusCard />
    </div>
  );
}

function ThemeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose how the application looks. You can switch between light and dark mode depending on your preference.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">Theme</p>
          <p className="text-sm text-muted-foreground">Toggle between light and dark interface themes.</p>
        </div>
        <ModeToggle />
      </CardContent>
    </Card>
  );
}

function ZoomCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interface Zoom</CardTitle>
        <CardDescription>
          Adjust the size of the interface. Increasing zoom makes UI elements larger and easier to read.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">Zoom Level</p>
          <p className="text-sm text-muted-foreground">Change the overall scale of the application interface.</p>
        </div>
        <ZoomControl />
      </CardContent>
    </Card>
  );
}
