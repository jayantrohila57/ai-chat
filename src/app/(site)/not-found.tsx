import Header from "@/shared/components/layout/header/header";
import Section from "@/shared/components/layout/section/section";
import { Shell } from "@/shared/components/layout/shell";

export const metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist or has been moved.",
};

export default async function NotFound() {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <Shell.Section>
          <Section {...metadata}>
            <div className="flex h-full w-full items-center justify-center">
              <h1>{"Not Found"}</h1>
            </div>
          </Section>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  );
}
