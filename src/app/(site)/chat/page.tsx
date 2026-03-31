import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { ChatWorkspace } from "@/module/chat/chat.workspace";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Chat",
  description: "Start a new AI chat conversation.",
};

export default async function ChatLandingPage() {
  const { session } = await getServerSession();

  if (!session) {
    redirect(PATH.AUTH.SIGN_IN);
  }

  return <ChatWorkspace mode="landing" />;
}
