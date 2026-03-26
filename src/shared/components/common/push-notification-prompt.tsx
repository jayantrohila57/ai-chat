"use client";

import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { debugError } from "@/shared/utils/lib/logger.utils";

export function PushNotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 10 seconds if notifications are supported and not already granted
    const timer = setTimeout(() => {
      if ("Notification" in window && Notification.permission === "default") {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Thanks!", {
          body: "You'll now receive updates about new posts.",
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      debugError("Notification permission error:", error);
    }
    setIsVisible(false);
  };

  const handleDeny = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-5 left-5 z-50 w-80 shadow-xl">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-primary h-5 w-5" />
            <CardTitle className="text-lg">{"Stay Updated"}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDeny}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">{"Get notified when we publish new articles and updates."}</p>
          <div className="flex gap-2">
            <Button onClick={void handleAllow} size={"sm"} className="flex-1">
              {"Allow"}
            </Button>
            <Button variant="outline" size={"sm"} onClick={handleDeny} className="flex-1 bg-transparent">
              {"Not Now"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
