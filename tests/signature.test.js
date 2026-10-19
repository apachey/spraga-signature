import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { GET, HEAD } from "../api/signature-image.js";
import { IMAGE_VERSION, PARTS, THEMES } from "../signature-config.js";

function request(parameters = {}) {
  const url = new URL("https://signature.test/api/signature-image");
  for (const [key, value] of Object.entries({ v: IMAGE_VERSION, theme: "original", i: "0", part: "header", ...parameters })) url.searchParams.set(key, value);
  return new Request(url);
}

test("all 14 palettes render exact background and text pixels, with seamless image slices", async () => {
  for (const [theme, palette] of Object.entries(THEMES)) for (const inverted of [false, true]) {
    const bg = inverted ? palette.foreground : palette.background;
    const fg = inverted ? palette.background : palette.foreground;
    const card = createCanvas(1188, 294);
    const context = card.getContext("2d");
    for (const [part, geometry] of Object.entries(PARTS)) {
      const response = await GET(request({ theme, i: inverted ? "1" : "0", part, n: "Ірина Коваль", r: JSON.stringify([{ text: "Sales / Ukraine", bold: true, italic: true, underline: true, strike: true }]), c: "website" }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "image/png");
      const image = await loadImage(Buffer.from(await response.arrayBuffer()));
      assert.equal(image.width, geometry.width * 2);
      assert.equal(image.height, geometry.height * 2);
      context.drawImage(image, geometry.x * 2, geometry.y * 2);
    }
    const rgb = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16));
    assert.deepEqual([...context.getImageData(400, 20, 1, 1).data], [...rgb(bg), 255]);
    const namePixels = context.getImageData(296, 44, 856, 40).data;
    let exactForeground = 0;
    for (let i = 0; i < namePixels.length; i += 4) if (rgb(fg).every((value, channel) => value === namePixels[i + channel]) && namePixels[i + 3] === 255) exactForeground++;
    assert(exactForeground > 50, theme + " name must retain its foreground color");
    const pixels = context.getImageData(40, 40, 1108, 214).data;
    for (let i = 3; i < pixels.length; i += 4) assert.equal(pixels[i], 255, theme + " image slices must not leave gaps");
    assert.equal(context.getImageData(0, 0, 1, 1).data[3], 0, "outer corner remains transparent");
  }
});

test("malformed/oversized input is rejected without rendering or caching", async () => {
  for (const parameters of [
    { theme: "__proto__" }, { theme: "../fonts" }, { part: "constructor" },
    { i: "2" }, { v: "future" }, { n: "x".repeat(161) }, { p: "1".repeat(65) },
    { r: "null" }, { r: "{}" }, { r: "[null]" }, { r: '[{"text":123}]' },
    { r: JSON.stringify([{ text: "x".repeat(301) }]) }, { r: '[{"text":"role","bold":"yes"}]' },
    { c: "https://example.com/tracker.png" }
  ]) {
    const response = await GET(request(parameters));
    assert.equal(response.status, 400, JSON.stringify(parameters));
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("image URLs are immutable, deterministic, conditional and HEAD requests work", async () => {
  const first = await GET(request({ n: '<script>alert("x")</script> & Ірина' }));
  const second = await GET(request({ n: '<script>alert("x")</script> & Ірина' }));
  assert.deepEqual(Buffer.from(await first.arrayBuffer()), Buffer.from(await second.arrayBuffer()));
  assert.match(first.headers.get("cache-control"), /immutable/);
  const conditional = request({ n: '<script>alert("x")</script> & Ірина' });
  conditional.headers.set("if-none-match", first.headers.get("etag"));
  assert.equal((await GET(conditional)).status, 304);
  const head = await HEAD(request());
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
});
