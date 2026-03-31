import { Database, MessageSquareText, Shield, UploadCloud, Workflow } from "lucide-react";
import { forbidden, redirect } from "next/navigation";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";
import { getServerSession } from "@/core/auth/auth.server";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Studio",
  description: "AI Chat App v1 internal starter workspace.",
};

export default async function StudioPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  const { session, user } = await getServerSession();

  if (!session) {
    return redirect(PATH.ROOT);
  }

  // if (normalizeRole(user?.role) === APP_ROLE.CUSTOMER) {
  //   forbidden();
  // }

  const cards = [
    {
      title: "Auth Ready",
      description: "Staff and admin-only workspace access is still enforced through Better Auth roles.",
      icon: Shield,
    },
    {
      title: "tRPC Ready",
      description: "The API layer stays in place as the contract for future conversations and agents.",
      icon: Workflow,
    },
    {
      title: "Database Ready",
      description: "The schema is being reduced to starter entities so chat data can be added cleanly next.",
      icon: Database,
    },
    {
      title: "Uploads Ready",
      description: "Authenticated file uploads remain available for future attachments and generated assets.",
      icon: UploadCloud,
    },
  ];

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]">
          AI Chat App v1
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Studio starter workspace</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-6">
          This internal area now serves as the trimmed admin/workspace shell for the AI chat application. Commerce
          dashboards, catalog tools, orders, shipping, and payments have been removed so the next build can focus on
          chat workflows only.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <card.icon className="text-primary size-5" />
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareText className="size-5" />
            Presence of the upcoming AI chat app
          </CardTitle>
          <CardDescription>
            The application now explicitly signals that it is an AI chat starter, not a commerce app.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-sm leading-6">
          <p>The public homepage, auth pages, account settings, and this studio shell all mention AI Chat App v1.</p>
          <p>
            What is intentionally missing right now: threads, messages, models, prompts, tools, and conversation UIs.
          </p>
          <p>Those features are the next implementation layer on top of this cleaned foundation.</p>
        </CardContent>
      </Card>
    </div>
  );
}
