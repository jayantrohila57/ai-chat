import { Loader } from "lucide-react";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import { Shell } from "@/shared/components/layout/shell";

export default async function Loading() {
  return (
    <Shell>
      <Shell.Main variant="dashboard">
        <Shell.Section variant="dashboard">
          <DashboardSection title={"Loading"} description={"Loading... Please wait."}>
            <div className="flex h-[calc(100vh-10.2rem)] items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
