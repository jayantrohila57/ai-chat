import { redirect } from "next/navigation";
import { getServerSession, getServerSessions } from "@/core/auth/auth.server";
import { SessionManagement } from "@/module/account/account.session";
import { ProfileCard } from "@/module/user/component.user.profile";
import Section from "@/shared/components/layout/section/section";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Account Settings",
  description: "Manage your AI Chat App v1 profile, security, and active sessions.",
};

export default async function AccountPage() {
  const [data, sessions] = await Promise.all([getServerSession(), getServerSessions()]);

  if (!data?.session) {
    return redirect(PATH.ROOT);
  }

  const currentSessionToken = data.session.token;

  return (
    <Section
      title="Account Surface"
      description="This reduced account area keeps only the settings that are directly useful for an AI chat starter: profile, password and sign-in methods, two-factor authentication, and session management."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-8">
        <div className="lg:col-span-8">
          <ProfileCard />
        </div>
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Review the devices that currently have access to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSessionToken && (
                <SessionManagement sessions={sessions} currentSessionToken={currentSessionToken} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
