import { AccountSettings } from "@/module/account/account.settings";

export const metadata = {
  title: "Account",
  description: "Profile, subscription, credits, and billing details for the current customer.",
};

export default function AccountPage() {
  return <AccountSettings />;
}
