import { Resvg } from "@resvg/resvg-wasm";
import type { ConversionOptions, ConversionRequest } from "~/lib/types";

let wasmInitialized = false;

// biome-ignore lint/suspicious/useAwait: ignore
const ensureWasmInitialized = async (): Promise<void> => {
  if (wasmInitialized) {
    return;
  }

  // The WASM runtime is eagerly initialized when bundled with Cloudflare.
  // Keeping this hook allows us to implement explicit initialization later if needed.
  wasmInitialized = true;
};

export const convertSvgToPng = async (
  svgContent: string,
  options: ConversionOptions
): Promise<Uint8Array> => {
  await ensureWasmInitialized();

  try {
    const resvg = new Resvg(svgContent, {
      background: options.transparent ? "transparent" : "#ffffff",
      fitTo: {
        mode: "width",
        value: options.width,
      },
    });

    const pngData = resvg.render();
    return pngData.asPng();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: ignore
    console.error("SVG to PNG conversion failed:", error);
    throw new Error(`Conversion failed: ${error}`);
  }
};

// biome-ignore lint/suspicious/useAwait: ignore
export const convertSvgToPngSharp = async (
  _svgContent: string,
  _options: ConversionOptions
): Promise<Uint8Array> => {
  // Placeholder for environments where sharp is available.
  throw new Error("Sharp conversion not implemented");
};

export const convertMultipleSvgsToPng = async (
  requests: ConversionRequest[]
): Promise<{ success: boolean; data?: Uint8Array; error?: string }[]> => {
  const results = await Promise.allSettled(
    requests.map(async (req) => {
      const svgResponse = await fetch(req.svgPath);
      if (!svgResponse.ok) {
        throw new Error(`Failed to fetch ${req.svgPath}`);
      }

      const svgContent = await svgResponse.text();
      return convertSvgToPng(svgContent, req);
    })
  );

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return { success: true, data: result.value };
    }

    return { success: false, error: result.reason.message };
  });
};

// biome-ignore lint/style/useNamingConvention: ignore
export const generateETag = async (
  svgPath: string,
  width: number,
  height: number
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${svgPath}-${width}x${height}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return (
    hashArray
      // biome-ignore lint/style/noMagicNumbers: ignore
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
      // biome-ignore lint/style/noMagicNumbers: ignore
      .substring(0, 16)
  );
};

export const convertSvgPathToPng = async (
  request: ConversionRequest
): Promise<{ png: Uint8Array; etag: string }> => {
  const { svgPath, width, height, transparent = true, quality = 90 } = request;

  const svgResponse = await fetch(svgPath);
  if (!svgResponse.ok) {
    throw new Error("SVG not found");
  }

  const svgContent = await svgResponse.text();
  const png = await convertSvgToPng(svgContent, {
    width,
    height,
    transparent,
    quality,
  });

  const etag = await generateETag(svgPath, width, height);
  return { png, etag };
};

export const getHealthStatus = () => ({
  status: "healthy" as const,
  timestamp: new Date().toISOString(),
  wasmInitialized,
});

export const isWasmInitialized = () => wasmInitialized;
