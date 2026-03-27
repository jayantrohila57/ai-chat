import { ArrowRight, Database, MessageSquareText, Shield, UploadCloud, Workflow } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { auth } from "@/core/auth/auth";
import { getServerSession } from "@/core/auth/auth.server";
import { AuthProviders } from "@/module/auth/auth.providers";
import { AppBrand, AuthCard, AuthFooterNote } from "@/shared/components/layout/section/auth.card-layout";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "AI Chat App v1",
  description:
    "Chat with AI, manage conversations, use tools, and securely store your chat history in a clean and modern interface.",
};

export default async function Home({}: PageProps<"/">) {
  const session = await getServerSession();
  const isAuthenticated = !!session?.user;
  const pillars = [
    {
      title: "Smart Conversations",
      description:
        "Chat naturally with AI and keep your conversations organized. Each chat is saved so you can continue where you left off anytime.",
      icon: MessageSquareText,
    },
    {
      title: "Secure Accounts",
      description:
        "Your chats and account are protected with modern authentication including email login, GitHub sign-in, and optional passkeys.",
      icon: Shield,
    },
    {
      title: "Reliable Storage",
      description:
        "All conversations, attachments, and user data are securely stored so your chat history remains accessible whenever you return.",
      icon: Database,
    },
    {
      title: "Files & Attachments",
      description:
        "Upload files or images directly into your conversations so the AI can help analyze, summarize, or generate new content from them.",
      icon: UploadCloud,
    },
  ];

  return (
    <Shell>
      <Shell.Section className="flex flex-col h-full w-full justify-center items-center">
        <Section
          badge="Intelligent AI Workspace"
          title="Your personal AI workspace for conversations and ideas."
          description="Ask questions, generate content, brainstorm ideas, or get help with everyday tasks. AI Chat App keeps your conversations organized, supports file uploads, and lets you continue discussions anytime with full chat history."
        >
          <div className="max-w-3xl flex flex-col justify-start items-start gap-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Button asChild size="lg">
                  <Link href={PATH.CHAT.ROOT}>
                    Start chatting
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              ) : (
                <AuthProviders />
              )}

              <Button asChild variant="outline" size="lg">
                <Link href={PATH.PRICING.ROOT}>Upgrade to Pro</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="border-border/70">
                <CardHeader>
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                  <CardAction>
                    <pillar.icon className="text-primary size-5" />
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm leading-6">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
