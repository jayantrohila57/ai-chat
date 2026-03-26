import { SocialIcon } from "react-social-icons";
import { site } from "@/shared/config/site";
import { Button } from "../ui/button";

function Social() {
  return (
    <div className="flex h-full w-full items-center justify-start gap-2">
      {site.socialLinks.map((url) => {
        return (
          <Button variant={"ghost"} key={url} size={"icon"}>
            <SocialIcon
              bgColor="transparent"
              className="invert dark:invert-0"
              aria-label={url}
              fgColor="white"
              url={url}
              target="_blank"
              key={url}
            />
          </Button>
        );
      })}
    </div>
  );
}

export default Social;
