import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/core/auth/auth";
import { APP_ROLE, normalizeRole } from "@/core/auth/auth.roles";

export async function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/studio")) {
    const session = await auth.api.getSession({ headers: request.headers });
    const role = normalizeRole(session?.user?.role);

    const isStaffOrAdmin = role === APP_ROLE.ADMIN || role === APP_ROLE.STAFF;

    if (!session?.session || !isStaffOrAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/studio/:path*"],
};
