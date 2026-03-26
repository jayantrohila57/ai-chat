import { ArrowRight, Database, MessageSquareText, Shield, UploadCloud, Workflow } from "lucide-react";
import Link from "next/link";
import { AuthProviders } from "@/module/auth/auth.providers";
import { AuthCard } from "@/shared/components/layout/section/auth.card-layout";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "AI Chat App v1",
  description: "A clean AI chat starter with auth, tRPC, Drizzle, uploads, and rate limiting.",
};

export default async function Home({}: PageProps<"/">) {
  const pillars = [
    {
      title: "Authentication",
      description: "Better Auth is already wired for email/password, GitHub OAuth, passkeys, and 2FA.",
      icon: Shield,
    },
    {
      title: "Type-safe APIs",
      description: "tRPC stays in place as the application API foundation for upcoming chat features.",
      icon: Workflow,
    },
    {
      title: "Database",
      description: "Drizzle and Neon/Postgres remain as the starter data layer for auth, uploads, and future chats.",
      icon: Database,
    },
    {
      title: "Attachments",
      description: "Blob uploads remain available so chat attachments and generated assets can plug in later.",
      icon: UploadCloud,
    },
  ];

  return (
    <section className=" flex min-h-[calc(100svh-8rem)] flex-col gap-10 px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.24em]">
            AI Chat App v1 Starter
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
              A stripped-back starting point for building an AI chat product.
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
              The commerce product has been cleared out. What remains is the reusable stack we want for chat:
              authentication, type-safe APIs, database wiring, uploads, rate limiting, and a minimal internal studio.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={PATH.AUTH.SIGN_UP}>
                Create an account
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={PATH.STUDIO.ROOT}>Open Studio</Link>
            </Button>
          </div>
        </div>

        <AuthCard title="Sign In" description="Access the AI chat starter and pick up from your saved account state.">
          <AuthProviders />
        </AuthCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="border-border/70">
            <CardHeader>
              <pillar.icon className="text-primary size-5" />
              <CardTitle className="text-lg">{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-6">{pillar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
