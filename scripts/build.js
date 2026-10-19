import { cp, mkdir, rm } from "node:fs/promises";

await rm("public", { recursive: true, force: true });
await mkdir("public", { recursive: true });
for (const file of ["index.html", "signature-config.js", "assets"]) {
  await cp(file, "public/" + file, { recursive: true });
}
console.log("Built generator and preserved all existing asset URLs.");
