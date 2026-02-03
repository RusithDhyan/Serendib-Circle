import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), "uploads", filename);
  console.log("filepath", filePath);

  if (!fs.existsSync(filePath)) {
    return new Response(`Not found = ${filePath}`, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  // Detect MIME type by extension (basic)
  const ext = path.extname(filename).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  if (ext === ".png") contentType = "image/png";
  if (ext === ".gif") contentType = "image/gif";

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
