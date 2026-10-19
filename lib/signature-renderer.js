import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { fileURLToPath } from "node:url";
import { IMAGE_VERSION, PARTS, THEMES } from "../signature-config.js";

for (const face of ["Regular", "Bold", "Italic", "BoldItalic"]) {
  const registered = GlobalFonts.registerFromPath(fileURLToPath(new URL("../fonts/LiberationSans-" + face + ".ttf", import.meta.url)));
  if (!registered) throw new Error("Signature font could not be loaded");
}

const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const clean = text => text.replace(/[\r\n\t\u0000-\u001f]/g, " ");

export function parseImageRequest(url) {
  const query = url.searchParams;
  const theme = query.get("theme");
  const part = query.get("part");
  const inversion = query.get("i");
  if (url.search.length > 7000 || query.get("v") !== IMAGE_VERSION || !owns(THEMES, theme) || !owns(PARTS, part) || !["0", "1"].includes(inversion)) {
    throw new TypeError("Invalid image parameters");
  }
  const name = query.get("n") || "YOUR NAME";
  const phone = query.get("p") || "";
  if (name.length > 160 || phone.length > 64) throw new TypeError("Signature text is too long");
  let runs;
  try { runs = JSON.parse(query.get("r") || '[{"text":"POSITION / DIRECTION / COUNTRY"}]'); }
  catch { throw new TypeError("Invalid role formatting"); }
  if (!Array.isArray(runs) || runs.length > 64 || runs.some(run => !run || typeof run !== "object" || typeof run.text !== "string" || ["bold", "italic", "underline", "strike"].some(key => key in run && typeof run[key] !== "boolean")) || runs.reduce((sum, run) => sum + run.text.length, 0) > 300) {
    throw new TypeError("Invalid role formatting");
  }
  const contact = query.get("c") || "empty";
  if (!["phone", "website", "instagram", "linkedin", "empty"].includes(contact)) throw new TypeError("Invalid contact");
  return { theme, part, inverted: inversion === "1", name: clean(name), phone: clean(phone), runs: runs.map(run => ({ ...run, text: clean(run.text) })), contact };
}

function font(run, size) {
  return (run.italic ? "italic " : "") + (run.bold ? "bold " : "") + size + 'px "Liberation Sans"';
}

function drawText(context, runs, x, baseline, baseSize, minimumSize, maxWidth, color) {
  const measure = size => runs.reduce((width, run) => {
    context.font = font(run, size);
    return width + context.measureText(run.text).width;
  }, 0);
  let size = baseSize;
  while (size > minimumSize && measure(size) > maxWidth) size -= 0.5;
  context.save();
  context.beginPath();
  context.rect(x, baseline - baseSize - 2, maxWidth, baseSize + 7);
  context.clip();
  context.fillStyle = color;
  context.strokeStyle = color;
  context.textBaseline = "alphabetic";
  context.lineWidth = Math.max(0.7, size / 16);
  for (const run of runs) {
    context.font = font(run, size);
    const width = context.measureText(run.text).width;
    context.fillText(run.text, x, baseline);
    for (const y of [run.underline && baseline + 1.5, run.strike && baseline - size * 0.3].filter(value => value !== false)) {
      context.beginPath(); context.moveTo(x, y); context.lineTo(x + width, y); context.stroke();
    }
    x += width;
  }
  context.restore();
}

export async function renderSignaturePart(model) {
  const part = PARTS[model.part];
  const palette = THEMES[model.theme];
  const background = model.inverted ? palette.foreground : palette.background;
  const foreground = model.inverted ? palette.background : palette.foreground;
  const variant = model.inverted ? "inverted" : "normal";
  const canvas = createCanvas(part.width * 2, part.height * 2);
  const context = canvas.getContext("2d");
  context.scale(2, 2);
  context.translate(-part.x, -part.y);
  context.beginPath();
  context.roundRect(0, 0, 594, 147, 20);
  context.clip();
  context.fillStyle = background;
  context.fillRect(0, 0, 594, 147);

  if (model.part === "left") {
    const highResolution = ["original", "lemon", "pomegranate", "apple"].includes(model.theme) ? "-448" : "";
    const logo = await loadImage(fileURLToPath(new URL("../assets/" + model.theme + "-" + variant + "-logo" + highResolution + ".png", import.meta.url)));
    context.drawImage(logo, 18, 18, 112, 112);
  } else if (model.part === "header") {
    drawText(context, [{ text: model.name, bold: true }], 148, 38, 16, 10, 428, foreground);
    drawText(context, model.runs, 148, 58, 12, 10, 428, foreground);
  } else if (model.part.startsWith("contact") && model.contact !== "empty") {
    const icon = await loadImage(fileURLToPath(new URL("../assets/" + model.theme + "-" + variant + "-" + model.contact + ".png", import.meta.url)));
    const x = part.x + (part.x === 148 ? 4 : 0);
    context.drawImage(icon, x, part.y + 2.5, 15, 15);
    const text = { phone: model.phone, website: "SPRAGA.FR", instagram: "@SPRAGA.FR", linkedin: "LINKEDIN" }[model.contact];
    drawText(context, [{ text }], x + 19, part.y + 14, 12, 9, part.width - (x - part.x) - 22, foreground);
  }
  return canvas.toBuffer("image/png");
}
