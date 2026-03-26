import { HeaderActions } from "./header.actions";
import HeaderLogo from "./header.logo";
import { NavigationMenuComponent } from "./header.navigation";

export default function Header() {
  return (
    <nav className="z-50 flex h-16 w-full items-center justify-between border-b bg-background/85 backdrop-blur-md">
      <div className="flex h-full flex-row">
        <div className="flex h-full flex-row items-center border-r px-6">
          <HeaderLogo />
        </div>
        <div className="flex h-full flex-row items-center">
          <NavigationMenuComponent />
        </div>
      </div>
      <div className="flex h-full flex-row items-center">
        <HeaderActions />
      </div>
    </nav>
  );
}
