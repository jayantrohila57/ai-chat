import type React from "react";
import Footer from "@/shared/components/layout/footer/footer";
import Header from "@/shared/components/layout/header/header";
import Shell from "@/shared/components/layout/shell";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>
        <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
      </Shell.Main>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  );
}
