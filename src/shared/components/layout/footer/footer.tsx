import Link from "next/link";
import { ThemeToggle } from "@/shared/components/theme/theme-toggle";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";
import { AppBrand } from "../section/auth.card-layout";

export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <Link href={PATH.ROOT} className="text-xl font-semibold">
            {site.name}
          </Link>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">{site.description}</p>
          <p className="text-muted-foreground text-sm">Starter contact: {site.email}</p>
        </div>
        <div className="grid gap-2 text-sm">
          <Link href={PATH.AUTH.ROOT} className="underline-offset-4 hover:underline">
            Authentication
          </Link>
          <Link href={PATH.ACCOUNT.ROOT} className="underline-offset-4 hover:underline">
            Account settings
          </Link>
          <Link href={PATH.STUDIO.ROOT} className="underline-offset-4 hover:underline">
            Studio workspace
          </Link>
        </div>
      </div>
      <div className="flex h-16 items-center justify-between border-t px-6">
        <AppBrand className="flex h-full items-center justify-center p-0" />
        <div className="flex h-full items-center border-l px-4">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
