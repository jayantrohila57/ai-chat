import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import DashboardSection from "@/shared/components/layout/section/section-dashboard";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export default function Forbidden() {
  return (
    <Shell>
      <Shell.Main variant="dashboard">
        <Shell.Section variant="dashboard">
          <DashboardSection title={"Forbidden"} description={"You don’t have permission to access this area."}>
            <div className="flex h-[calc(100vh-18.6rem)] items-center justify-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
                <p className="text-sm text-muted-foreground">
                  You’re signed in but don’t have permission to view this page.
                </p>
                <p className="text-sm text-muted-foreground">Please contact the administrator to request access.</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button asChild>
                    <Link href={PATH.ROOT as Route}>Go to homepage</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={PATH.STUDIO.ROOT as Route}>Back to Studio</Link>
                  </Button>
                </div>
              </div>
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
