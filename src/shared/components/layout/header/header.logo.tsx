import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { PATH } from "@/shared/config/routes";
import { site } from "@/shared/config/site";

export default function HeaderLogo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <h2 className="motion-all cursor-pointer text-2xl hover:scale-[.99] active:scale-[.97]">
            <Link href={PATH.ROOT} aria-label={site.name} title={site.name}>
              {site.name}
            </Link>
          </h2>
        </TooltipTrigger>
        <TooltipContent>
          <p> {site.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
