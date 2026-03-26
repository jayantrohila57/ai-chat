import { Loader } from "lucide-react";
import Header from "@/shared/components/layout/header/header";
import { Shell } from "@/shared/components/layout/shell";

export const metadata = {
  title: "Loading",
  description: "Loading...",
};

export default async function Loading() {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section>
          <div className="flex h-screen w-full items-center justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
