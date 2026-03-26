import { Loader } from "lucide-react";
import Shell from "@/shared/components/layout/shell";

export default function Loading() {
  return (
    <Shell>
      <Shell.Section>
        <div className="flex min-h-[50vh] w-full items-center justify-center">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      </Shell.Section>
    </Shell>
  );
}
