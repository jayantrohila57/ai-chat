import type { Experimental_GeneratedImage } from "ai";
import Image from "next/image";
import { cn } from "@/shared/utils/lib/utils";

export type ImageProps = Experimental_GeneratedImage & {
  className?: string;
  alt: string;
};

export const ImageComponent = ({ base64, uint8Array: _uint8Array, mediaType, ...props }: ImageProps) => (
  <Image
    height={512}
    width={512}
    {...props}
    className={cn("h-auto max-w-full overflow-hidden rounded-md", props.className)}
    src={`data:${mediaType};base64,${base64}`}
    alt={props.alt}
  />
);
