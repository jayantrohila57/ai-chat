import { put } from "@vercel/blob";
import { getServerSession } from "@/core/auth/auth.server";
import { jsonFailure, jsonSuccess } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";

export async function POST(request: Request) {
  try {
    const { session, user } = await getServerSession();
    if (!session || !user?.id) {
      return jsonFailure({
        message: "Authentication required",
        code: "UNAUTHORIZED",
        kind: "auth",
        httpStatus: 401,
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return jsonFailure({
        message: "No file uploaded",
        code: "BAD_REQUEST",
        kind: "validation",
        httpStatus: 400,
        status: "failed",
      });
    }

    const uploaded = await put(file.name, file, { access: "public", addRandomSuffix: true });
    return jsonSuccess({ url: uploaded.url, pathname: uploaded.pathname }, "Upload completed successfully.", 200);
  } catch (error) {
    debugError("VERCEL_BLOB", { error });
    return jsonFailure({
      message: "Upload failed",
      code: "INTERNAL_SERVER_ERROR",
      kind: "server",
      httpStatus: 500,
    });
  }
}
