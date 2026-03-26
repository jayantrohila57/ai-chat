import type { Route } from "next";
import Link from "next/link";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export default function Forbidden() {
  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <Section title="Forbidden" description="You don’t have permission to access this area.">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              You’re signed in but don’t have permission to view this page.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href={PATH.ROOT as Route}>Go to homepage</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={PATH.STUDIO.ROOT as Route}>Back to Studio</Link>
              </Button>
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  );
}
