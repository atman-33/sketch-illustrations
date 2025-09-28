/** biome-ignore-all lint/suspicious/noConsole: ignore */
/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { Resvg } from "@resvg/resvg-wasm";
import type { ConversionOptions } from "../app/lib/types";

// WASM binary - will be loaded at runtime
const wasmInitialized = false;

// biome-ignore lint/suspicious/noEmptyBlockStatements: ignore
async function ensureWasmInitialized() {}

export type ConversionRequest = {
  svgPath: string;
  width: number;
  height: number;
  transparent?: boolean;
  quality?: number;
};

export async function convertSvgToPng(
  svgContent: string,
  options: ConversionOptions
): Promise<Uint8Array> {
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
    console.error("SVG to PNG conversion failed:", error);
    throw new Error(`Conversion failed: ${error}`);
  }
}

export async function handlePngConversion(request: Request): Promise<Response> {
  // Handle CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = (await request.json()) as ConversionRequest;
    const { svgPath, width, height, transparent = true, quality = 90 } = body;

    // Validate input
    if (!svgPath) {
      return new Response("SVG path is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (width <= 0 || height <= 0 || width > 2048 || height > 2048) {
      return new Response("Invalid dimensions", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Fetch SVG content
    const svgResponse = await fetch(svgPath);
    if (!svgResponse.ok) {
      return new Response("SVG not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    const svgContent = await svgResponse.text();

    // Convert to PNG
    const pngBuffer = await convertSvgToPng(svgContent, {
      width,
      height,
      transparent,
      quality,
    });

    // Return PNG with appropriate headers
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    return new Response(pngBuffer as any, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Content-Length": pngBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000", // 1 year cache
        // biome-ignore lint/style/useNamingConvention: ignore
        ETag: `"${await generateETag(svgPath, width, height)}"`,
      },
    });
  } catch (error) {
    console.error("PNG conversion error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// biome-ignore lint/style/useNamingConvention: ignore
async function generateETag(
  svgPath: string,
  width: number,
  height: number
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${svgPath}-${width}x${height}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 16);
}

// Alternative implementation using sharp (if available in the worker environment)
// biome-ignore lint/suspicious/useAwait: ignore
export async function convertSvgToPngSharp(
  _svgContent: string,
  _options: ConversionOptions
): Promise<Uint8Array> {
  // This would use sharp if available
  // For now, we'll implement a basic canvas-based conversion
  throw new Error("Sharp conversion not implemented");
}

// Batch conversion support
export async function convertMultipleSvgsToPng(
  requests: ConversionRequest[]
): Promise<{ success: boolean; data?: Uint8Array; error?: string }[]> {
  const results = await Promise.allSettled(
    requests.map(async (req) => {
      const svgResponse = await fetch(req.svgPath);
      if (!svgResponse.ok) {
        throw new Error(`Failed to fetch ${req.svgPath}`);
      }
      const svgContent = await svgResponse.text();
      // biome-ignore lint/suspicious/noExplicitAny: ignore
      return convertSvgToPng(svgContent, req as any);
    })
  );

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return { success: true, data: result.value };
    }
    return { success: false, error: result.reason.message };
  });
}

// Health check endpoint
export function handleHealthCheck(): Response {
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      wasmInitialized,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
