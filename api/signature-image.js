import { createHash } from "node:crypto";
import { parseImageRequest, renderSignaturePart } from "../lib/signature-renderer.js";

export async function GET(request) {
  let model;
  try { model = parseImageRequest(new URL(request.url)); }
  catch { return new Response("Invalid signature image", { status: 400, headers: { "Cache-Control": "no-store" } }); }
  try {
    const png = await renderSignaturePart(model);
    const etag = '"' + createHash("sha256").update(png).digest("hex") + '"';
    const headers = {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "public, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ETag: etag
    };
    if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
    return new Response(png, { headers });
  } catch (error) {
    // Do not log signature text or query strings.
    console.error("Signature image render failed:", error.message);
    return new Response("Signature image unavailable", { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function HEAD(request) {
  const response = await GET(request);
  return new Response(null, { status: response.status, headers: response.headers });
}
