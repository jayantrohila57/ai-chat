import GoBackButton from "../../common/go-back";
import { SidebarHeaderActions } from "./sidebar.header-action";

export const SidebarHeader = () => {
  return (
    <header className="bg-background border-b h-16 group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex h-full w-full items-center justify-between">
        <div className="flex items-center">
          <div className="flex h-16 w-16 items-center justify-center">
            <GoBackButton />
          </div>
          <div className="border-x px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Studio</p>
            <p className="text-sm font-medium">AI chat starter workspace</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-end">
          <SidebarHeaderActions />
        </div>
      </div>
    </header>
  );
};
