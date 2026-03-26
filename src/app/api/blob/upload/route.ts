import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "@/core/auth/auth.server";
import { debugError } from "@/shared/utils/lib/logger.utils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    const uploaded = await put(file.name, file, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ url: uploaded.url, pathname: uploaded.pathname }, { status: 200 });
  } catch (error) {
    debugError("VERCEL BLOB", { error });
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
