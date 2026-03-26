import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/core/auth/auth";
import { checkArcjet } from "./arkjet.config";

const authHandlers = toNextJsHandler(auth);
export const { GET } = authHandlers;

export async function POST(request: Request) {
  const clonedRequest = request.clone();
  if (request) {
    const decision = await checkArcjet(request);
    if (decision.isDenied()) {
      return new Response(null, {
        status: 403,
        statusText: "Too many requests Please try again later",
      });
    }
    return authHandlers.POST(clonedRequest);
  }
  return authHandlers.POST(clonedRequest);
}
