import { data } from "react-router";
import { HTTP_STATUS } from "~/lib/constants/http-status";
import { convertSvgPathToPng } from "~/lib/server/png-converter.server";
import { ConversionRequestSchema } from "~/lib/types";
import type { Route } from "./+types/route";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method === "OPTIONS") {
    return data(null, { status: HTTP_STATUS.noContent, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return data("Method not allowed", {
      status: HTTP_STATUS.methodNotAllowed,
      headers: corsHeaders,
    });
  }

  try {
    const rawBody = await request.json();
    const parsed = ConversionRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return data(
        {
          error: "Invalid conversion request",
          details: parsed.error.flatten(),
        },
        {
          status: HTTP_STATUS.badRequest,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { png, etag } = await convertSvgPathToPng(parsed.data);

    return data(png, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Content-Length": png.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000",
        // biome-ignore lint/style/useNamingConvention: ignore
        ETag: `"${etag}"`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status =
      message === "SVG not found"
        ? HTTP_STATUS.notFound
        : HTTP_STATUS.internalServerError;

    if (status === HTTP_STATUS.internalServerError) {
      // biome-ignore lint/suspicious/noConsole: ignore
      console.error("PNG conversion error:", error);
    }

    return data(
      { error: message },
      {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
};
