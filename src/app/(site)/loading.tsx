import { Loader } from "lucide-react";
import Section from "@/shared/components/layout/section/section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import { Shell } from "@/shared/components/layout/shell";

export default async function Loading() {
  return (
    <Shell>
      <Shell.Main>
        <Shell.Section>
          <Section title={"Loading"} description={"Loading... Please wait."}>
            <div className="flex h-[calc(100vh-10.2rem)] w-full items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          </Section>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
