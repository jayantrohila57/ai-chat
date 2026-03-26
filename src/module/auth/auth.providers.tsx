"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

const GitHubSignIn = dynamic(() => import("./auth.github-sign-in").then((mod) => mod.GitHubSignIn), {
  loading: () => <Skeleton className="h-10 w-full rounded-full" />,
});
// const PasskeyButton = dynamic(() => import('./auth.passkey-button').then((mod) => mod.PasskeyButton), {
//   loading: () => <Skeleton className="h-10 w-full rounded-full" />,
// })

export function AuthProviders() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Suspense>
        <GitHubSignIn />
      </Suspense>
      {/* <Suspense>
        <PasskeyButton />
      </Suspense> */}
    </div>
  );
}
