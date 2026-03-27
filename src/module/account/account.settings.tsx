import { useSession } from "@/core/auth/auth.client";
import { ProfileCard } from "./account.profile-view";

export function AccountSettings() {
  const { data: session } = useSession();
  return <ProfileCard user={session?.user} />;
}
