import { HydrateClient } from "@/core/api/api.server";
import Shell from "@/shared/components/layout/shell";
import { AppSidebar } from "@/shared/components/layout/sidebar/sidebar";
import { SidebarHeader } from "@/shared/components/layout/sidebar/sidebar.header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

export default async function Layout({ children }: LayoutProps<"/studio">) {
  return (
    <HydrateClient>
      <Shell>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SidebarHeader />
            <Shell.Main variant={"dashboard"}>{children}</Shell.Main>
          </SidebarInset>
        </SidebarProvider>
      </Shell>
    </HydrateClient>
  );
}
