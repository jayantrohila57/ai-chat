import type { User } from "better-auth";
import { Info, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerAccounts, getServerSession, getServerSessions } from "@/core/auth/auth.server";
import { ChangePasswordForm } from "@/module/account/account.password-change";
import { ProfileUpdateForm } from "@/module/account/account.profile";
import { SessionManagement } from "@/module/account/account.session";
import { SetPasswordButton } from "@/module/account/account.set-password";
import { TwoFactorAuthForm } from "@/module/account/account.two-factor";
import { ProfileCard } from "@/module/user/component.user.profile";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Account Settings",
  description: "Manage your AI Chat App v1 profile, security, and active sessions.",
};

export default async function AccountPage() {
  const [data, sessions, accounts] = await Promise.all([getServerSession(), getServerSessions(), getServerAccounts()]);

  if (!data?.session) {
    return redirect(PATH.ROOT);
  }

  const currentSessionToken = data.session.token;
  const hasPasswordAccount = Boolean(accounts?.some((account) => account?.providerId === "credential"));
  const isTwoFactorEnabled = Boolean(data.user?.twoFactorEnabled);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em]">
          Account Surface
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Starter account settings</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6">
          This reduced account area keeps only the settings that are directly useful for an AI chat starter: profile,
          password and sign-in methods, two-factor authentication, and session management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your identity details before the chat workspace is layered on top.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileUpdateForm user={data.user} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <ProfileCard user={data.user as User} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          {hasPasswordAccount ? (
            <Card>
              <CardHeader>
                <CardTitle>Password Settings</CardTitle>
                <CardDescription>Choose a strong password to protect this starter workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Strong authentication stays in place even while the application is between product phases.
                  </AlertDescription>
                </Alert>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Set Password</CardTitle>
                <CardDescription>Attach a password if you originally joined with a social provider.</CardDescription>
              </CardHeader>
              <CardContent>
                <SetPasswordButton email={data.user?.email ?? ""} />
              </CardContent>
            </Card>
          )}

          {hasPasswordAccount && (
            <>
              <Separator />
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication adds another layer of protection for your future AI workspace.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Enable an authenticator app before the chat product is built on top.
                  </CardDescription>
                  <CardAction>
                    <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
                      {isTwoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TwoFactorAuthForm isEnabled={isTwoFactorEnabled} />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>What was removed</CardTitle>
              <CardDescription>This starter no longer carries storefront account features.</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2 text-sm leading-6">
              <p>
                Cart, wishlist, orders, payments, addresses, shipments, and reviews have been removed from the account
                area.
              </p>
              <p>The goal here is a clean foundation for chat work, not a partially hidden commerce application.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
