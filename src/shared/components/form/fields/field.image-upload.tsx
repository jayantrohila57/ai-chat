"use client";

import { ImageUpIcon, XIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/common/form";
import { useFileUpload } from "@/shared/utils/hooks/use-file-upload";
import { PLACEHOLDER_IMAGE } from "@/shared/utils/lib/image.utils";
import { cn } from "@/shared/utils/lib/utils";
import { BlurImage } from "../../common/image";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import type { FormInputProps } from "../form.types";

export const ImageUploadText: React.FC<FormInputProps> = (props) => {
  const maxSizeMB = props.type === "image" ? props?.maxSizeMB : 5;
  const maxSize = maxSizeMB ? maxSizeMB * 1024 * 1024 : 5 * 1024 * 1024;
  const reactId = useId();
  const stableId = props.name ? `${props.name}-${reactId}` : reactId;
  const { control } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const uploadingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      uploadFirst,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  // preview prioritizes form value (uploaded URL) then local object URL
  const previewUrlFromForm = undefined;
  if (props?.hidden) return null;
  if (props.type !== "image") return null;

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem id={stableId} className={cn(props.className)}>
          <FormLabel required={props.required}>{props.label}</FormLabel>
          <FormControl>
            <div className="relative h-full w-full">
              <div
                role="button"
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className={cn(
                  "hover:bg-background dark:bg-input/30 data-[dragging=true]:bg-background has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 bg-background border-input relative flex aspect-video max-h-80 flex-col items-center justify-center overflow-hidden rounded-md border p-4 shadow-xs transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]",
                  fieldState.error && "border-destructive focus-visible:ring-destructive",
                )}
              >
                {/* Uncontrolled file input for selecting files */}
                <input aria-label="Upload file" className="sr-only" {...getInputProps()} />
                {/* Hidden controlled input to store uploaded URL/path in the form state */}
                <input
                  type="hidden"
                  name={field.name}
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                />
                {(field.value as string) || files[0]?.preview ? (
                  <div className="absolute inset-0 cursor-pointer">
                    <BlurImage
                      src={(field.value as string) || files[0]?.preview || undefined}
                      fallbackSrc={PLACEHOLDER_IMAGE}
                      alt={files[0]?.file?.name || "Uploaded image"}
                      className="aspect-video size-full w-full rounded-md border object-cover"
                      width={1920}
                      height={1080}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="aspect-video size-full h-full w-full space-y-2 object-cover">
                          <Skeleton className="h-full w-full animate-pulse" />
                        </div>
                      </div>
                    )}
                    {null}
                  </div>
                ) : (
                  <div className="flex cursor-pointer flex-col items-center justify-center px-4 py-3 text-center">
                    <div
                      className="bg-background mb-2 flex size-16 shrink-0 items-center justify-center rounded-md border"
                      aria-hidden="true"
                    >
                      <ImageUpIcon className="size-8 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">{"Drop your image here or click to browse"}</p>
                    <p className="text-muted-foreground text-xs">
                      {"Max size:"} {maxSizeMB}
                      {"MB"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          {props.helperText && <FormDescription className={cn("")}>{props.helperText}</FormDescription>}
          {/* Controls & status below the image area */}
          {((field.value as string) || files.length > 0) && (
            <div className="mt-2 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", field.value ? "bg-green-500" : "bg-muted-foreground/40")} />
                <span className="text-muted-foreground text-xs">{field.value ? "Uploaded" : "Not uploaded"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading || !files[0]}
                  onClick={async () => {
                    if (!files[0]) return;
                    if (rafIdRef.current != null) {
                      cancelAnimationFrame(rafIdRef.current);
                      rafIdRef.current = null;
                    }
                    uploadingRef.current = true;
                    setIsUploading(true);
                    setProgress(5);
                    const tick = () => {
                      setProgress((p) => (p < 90 ? p + 5 : p));
                      if (uploadingRef.current) rafIdRef.current = requestAnimationFrame(tick);
                    };
                    rafIdRef.current = requestAnimationFrame(tick);
                    try {
                      const result = await uploadFirst();
                      uploadingRef.current = false;
                      if (rafIdRef.current != null) {
                        cancelAnimationFrame(rafIdRef.current);
                        rafIdRef.current = null;
                      }
                      setIsUploading(false);
                      setProgress(100);
                      if (result?.url) {
                        field.onChange(result.url);
                        if (files[0]?.id) removeFile(files[0]?.id);
                      } else {
                        setProgress(0);
                        toast.error("Image upload failed", {
                          description: "Please try again or use a smaller image.",
                        });
                      }
                    } catch (e) {
                      uploadingRef.current = false;
                      if (rafIdRef.current != null) {
                        cancelAnimationFrame(rafIdRef.current);
                        rafIdRef.current = null;
                      }
                      setIsUploading(false);
                      setProgress(0);
                      toast.error("Image upload error", {
                        description: e instanceof Error ? e.message : "Unknown error",
                      });
                    }
                  }}
                  aria-label="Upload image"
                >
                  <ImageUpIcon className="mr-2 size-4" />
                  {isUploading ? `Uploading ${progress}%` : "Upload"}
                </Button>
                {field.value && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      field.onChange("");
                      if (files[0]?.id) removeFile(files[0]?.id);
                      setIsUploading(false);
                      setProgress(0);
                    }}
                    aria-label="Remove image"
                  >
                    <XIcon className="mr-2 size-4" />
                    {"Remove"}
                  </Button>
                )}
              </div>
            </div>
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
          {errors?.length !== 0 && <FormMessage>{errors?.map((error) => error).join(", ")}</FormMessage>}
        </FormItem>
      )}
    />
  );
};
