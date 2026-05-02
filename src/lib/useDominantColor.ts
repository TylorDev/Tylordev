import { useState, useEffect } from "react";

interface DominantColor {
  hex: string;
  rgb: string;
}

const DEFAULT: DominantColor = { hex: "#2e2e34", rgb: "46, 46, 52" };
const cache = new Map<string, DominantColor>();

async function extractDominantColor(src: string): Promise<DominantColor> {
  if (cache.has(src)) return cache.get(src)!;

  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=10&h=10&output=jpg`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("proxy failed");

    const blob   = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width  = 10;
    canvas.height = 10;
    const ctx = canvas.getContext("2d");
    if (!ctx) return DEFAULT;

    ctx.drawImage(bitmap, 0, 0, 10, 10);
    const { data } = ctx.getImageData(0, 0, 10, 10);

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      if (lum > 30 && lum < 220) { r += data[i]; g += data[i + 1]; b += data[i + 2]; count++; }
    }
    if (count === 0) return DEFAULT;

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    // Ensure visibility on dark backgrounds
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 60) { r = Math.min(255, r + 60); g = Math.min(255, g + 60); b = Math.min(255, b + 60); }

    const result: DominantColor = { hex: `rgb(${r}, ${g}, ${b})`, rgb: `${r}, ${g}, ${b}` };
    cache.set(src, result);
    return result;
  } catch {
    return DEFAULT;
  }
}

/** Returns the dominant color extracted from an image URL. */
export function useDominantColor(src?: string): DominantColor {
  const [color, setColor] = useState<DominantColor>(DEFAULT);

  useEffect(() => {
    if (!src) return;
    let alive = true;
    extractDominantColor(src).then(c => { if (alive) setColor(c); });
    return () => { alive = false; };
  }, [src]);

  return color;
}
