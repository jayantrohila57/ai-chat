"use client";

import { ExternalLink, Github, LifeBuoy, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function HelpSettings() {
  return (
    <div className="space-y-6 p-1 w-full">
      <SupportCard />
      <CommunityCard />
    </div>
  );
}

function SupportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>Need help? Reach out to our support team.</CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">Email Support</p>
          <p className="text-sm text-muted-foreground">Our team will respond as soon as possible.</p>
        </div>

        <Button asChild>
          <a href="mailto:support@example.com">
            <Mail size={16} />
            Contact
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function CommunityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community</CardTitle>
        <CardDescription>Join the community to share feedback or report issues.</CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">GitHub Issues</p>
          <p className="text-sm text-muted-foreground">Report bugs or request features.</p>
        </div>

        <Button asChild variant="outline">
          <a href="https://github.com/your-repo/issues" target="_blank" rel="noopener">
            <Github size={16} />
            Open Issues
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
