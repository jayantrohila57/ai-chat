import { Spinner } from "@/shared/components/ui/spinner";

export default function AuthPageLoading() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <Spinner />
    </div>
  );
}
