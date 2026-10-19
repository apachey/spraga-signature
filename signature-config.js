// Shared by the generator and PNG renderer so every theme uses the same palette.
export const THEMES = {
  original: { label: "Original", background: "#CDAF32", foreground: "#6C3520" },
  lemon: { label: "Lemon", background: "#F0EA35", foreground: "#366132" },
  pomegranate: { label: "Granate", background: "#EA89A8", foreground: "#7C124C" },
  apple: { label: "Apple", background: "#69AC3E", foreground: "#042F20" },
  mint: { label: "Mint", background: "#D6F6B3", foreground: "#E20303" },
  mango: { label: "Mango", background: "#F0A80B", foreground: "#9E371A" },
  peach: { label: "Peach", background: "#FFF5AD", foreground: "#9E243D" }
};

// Increment the image version if the renderer changes. Old emails keep their URLs.
export const IMAGE_VERSION = "1";
export const PARTS = {
  left: { x: 0, y: 0, width: 148, height: 147 },
  header: { x: 148, y: 0, width: 446, height: 73 },
  contact0: { x: 148, y: 73, width: 144, height: 20 },
  contact1: { x: 292, y: 73, width: 302, height: 20 },
  contact2: { x: 148, y: 93, width: 144, height: 20 },
  contact3: { x: 292, y: 93, width: 302, height: 20 },
  footer: { x: 148, y: 113, width: 446, height: 34 }
};
