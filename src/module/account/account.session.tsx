"use client";

import type { Session } from "better-auth";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { listSessions, revokeSession, useSession } from "@/core/auth/auth.client";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { RevokeSessionButton } from "./account.revoke-session-button";

export function SessionManagement() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    async function load() {
      const res = await listSessions();
      setSessions(res.data ?? []);
    }

    load();
  }, []);
  const currentSessionToken = session?.session.token;
  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 p-1">
        <h3 className="text-lg font-medium">Current Session</h3>
        {currentSession && <SessionCard session={currentSession} isCurrentSession />}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Active Sessions</h3>
          {otherSessions.length > 0 && <RevokeSessionButton />}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-8 text-center">No other active sessions</CardContent>
          </Card>
        ) : (
          <div className="space-y-2 p-1">
            {otherSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session, isCurrentSession = false }: { session: Session; isCurrentSession?: boolean }) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.os.name}, ${userAgentInfo.browser.name}, IP: ${session.ipAddress ?? "Unknown"}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function handleRevokeSession() {
    void revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  }

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>{getBrowserInformation()}</CardTitle>
        <CardAction>
          {!isCurrentSession && (
            <Button variant="destructive" size="icon" onClick={handleRevokeSession}>
              <Trash2 />
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        {userAgentInfo?.device.type === "mobile" ? <Smartphone /> : <Monitor />}
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-xs">Created: {formatDate(session.createdAt)}</p>
          <p className="text-muted-foreground text-xs">Expires: {formatDate(session.expiresAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
