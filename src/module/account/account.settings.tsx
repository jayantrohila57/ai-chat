import { useSession } from "@/core/auth/auth.client";
import { ProfileCard } from "../user/component.user.profile";

export function AccountSettings() {
  const { data: session } = useSession();
  return <ProfileCard user={session?.user} />;
}
