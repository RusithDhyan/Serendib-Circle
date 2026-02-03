import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  // SAFETY: extract filename from URL, not params
  const url = new URL(req.url);
  const filename = url.pathname.split("/").pop();

  if (!filename) {
    return new Response("Filename missing", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", "profiles", filename);

  if (!fs.existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".png"
      ? "image/png"
      : ext === ".gif"
      ? "image/gif"
      : "application/octet-stream";

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store", // IMPORTANT
    },
  });
}
