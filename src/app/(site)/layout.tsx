import Footer from "@/shared/components/layout/footer/footer";
import Header from "@/shared/components/layout/header/header";
import Shell from "@/shared/components/layout/shell";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>{children}</Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  );
}
