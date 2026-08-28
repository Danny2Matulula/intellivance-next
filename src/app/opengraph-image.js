import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Intellivance — Build the operating system behind growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const image = await readFile(path.join(process.cwd(), "public", "og-kinetic-source.png"));
  const source = `data:image/png;base64,${image.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", overflow: "hidden", background: "#07101e", color: "white" }}>
        <img src={source} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 472, height: 158, display: "flex", alignItems: "center", padding: "0 52px", borderTop: "1px solid rgba(255,255,255,.2)", background: "#07101e", color: "#dbe4f2", fontSize: 22, fontWeight: 700, letterSpacing: 2.5 }}>
          REVENUE&nbsp;&nbsp;/&nbsp;&nbsp;OPERATIONS&nbsp;&nbsp;/&nbsp;&nbsp;TECHNOLOGY&nbsp;&nbsp;/&nbsp;&nbsp;EXECUTION
        </div>
      </div>
    ),
    size,
  );
}
