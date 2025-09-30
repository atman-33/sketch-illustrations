/**
 * Static Assets Utility
 *
 * Provides unified access to static files across different environments:
 * - Development (Vite): Uses standard fetch()
 * - Production (Cloudflare Workers): Uses ASSETS binding
 * - Build time (Node.js): Falls back to file system access
 */

type CloudflareContext = {
  cloudflare?: {
    env: Env;
  };
};

/**
 * Determines if we have access to Cloudflare Workers ASSETS binding
 */
function hasAssetsBinding(context?: CloudflareContext): boolean {
  return !!context?.cloudflare?.env?.ASSETS;
}

/**
 * Fetches a static asset with automatic fallback between ASSETS and standard fetch
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
export async function fetchStaticAsset(
  path: string,
  context?: CloudflareContext,
  request?: Request
): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Try Static Assets first if available
  if (hasAssetsBinding(context) && context?.cloudflare?.env?.ASSETS) {
    try {
      const assetUrl = new URL(normalizedPath, "https://example.com");
      const assetRequest = new Request(assetUrl.toString());

      const response = await context.cloudflare.env.ASSETS.fetch(assetRequest);

      if (response.ok) {
        return response;
      }

      // Log fallback only in development
      if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV === "development"
      ) {
        // biome-ignore lint/suspicious/noConsole: ignore
        console.warn(
          `[Static Assets] Failed for ${normalizedPath} (${response.status}), using fallback`
        );
      }
    } catch (error) {
      // Log errors only in development
      if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV === "development"
      ) {
        // biome-ignore lint/suspicious/noConsole: ignore
        console.warn(`[Static Assets] Error for ${normalizedPath}:`, error);
      }
    }
  }

  // Fallback: Use standard fetch
  let url = normalizedPath;

  if (request) {
    const requestUrl = new URL(request.url);
    url = `${requestUrl.origin}${normalizedPath}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Static asset not found: ${normalizedPath} (${response.status})`
    );
  }

  return response;
}

/**
 * Fetches and parses a JSON static asset
 */
export async function fetchStaticJson<T>(
  path: string,
  context?: CloudflareContext,
  request?: Request
): Promise<T> {
  try {
    const response = await fetchStaticAsset(path, context, request);
    const json = await response.json();
    return json as T;
  } catch (error) {
    // Log detailed errors only in development
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      // biome-ignore lint/suspicious/noConsole: ignore
      console.error(`Failed to fetch static JSON ${path}:`, error);
    }
    throw new Error(`Failed to load JSON asset: ${path}`);
  }
}

/**
 * Fetches a text static asset
 */
export async function fetchStaticText(
  path: string,
  context?: CloudflareContext,
  request?: Request
): Promise<string> {
  try {
    const response = await fetchStaticAsset(path, context, request);
    const text = await response.text();
    return text;
  } catch (error) {
    // Log detailed errors only in development
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      // biome-ignore lint/suspicious/noConsole: ignore
      console.error(`Failed to fetch static text ${path}:`, error);
    }
    throw new Error(`Failed to load text asset: ${path}`);
  }
}

/**
 * Type-safe wrapper for React Router context
 */
export type ReactRouterContext = {
  cloudflare?: {
    env: Env;
  };
};

/**
 * React Router specific helper for fetching static JSON
 */

// biome-ignore lint/suspicious/useAwait: ignore
export async function fetchStaticJsonFromRoute<T>(
  path: string,
  context: ReactRouterContext,
  request?: Request
): Promise<T> {
  return fetchStaticJson<T>(path, context, request);
}

/**
 * React Router specific helper for fetching static text
 */

// biome-ignore lint/suspicious/useAwait: ignore
export async function fetchStaticTextFromRoute(
  path: string,
  context: ReactRouterContext,
  request?: Request
): Promise<string> {
  return fetchStaticText(path, context, request);
}
