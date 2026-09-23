export interface InstagramPost {
  id: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
}

function httpsUrl(value: unknown, instagramOnly = false): string | undefined {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return;
    if (instagramOnly && url.hostname !== "instagram.com" && !url.hostname.endsWith(".instagram.com")) return;
    return url.href;
  } catch { return; }
}

/** Accept our API's camelCase fields and Instagram's native snake_case fields. */
export function normalizeInstagramPosts(payload: unknown, limit: number): InstagramPost[] {
  if (!payload || typeof payload !== "object") throw new Error("Invalid Instagram response");
  const result = payload as Record<string, unknown>;
  if (result.success === false || !Array.isArray(result.data)) throw new Error("Invalid Instagram response");
  const seen = new Set<string>();
  return result.data.flatMap((item): InstagramPost[] => {
    if (!item || typeof item !== "object") return [];
    const post = item as Record<string, unknown>;
    const id = typeof post.id === "string" || typeof post.id === "number" ? String(post.id) : "";
    const mediaUrl = httpsUrl(post.mediaUrl ?? post.media_url);
    const permalink = httpsUrl(post.permalink, true);
    const mediaType = post.mediaType ?? post.media_type;
    if (!id || seen.has(id) || !mediaUrl || !permalink || !["IMAGE", "VIDEO", "CAROUSEL_ALBUM"].includes(String(mediaType))) return [];
    seen.add(id);
    return [{ id, mediaUrl, permalink, mediaType: mediaType as InstagramPost["mediaType"],
      caption: typeof post.caption === "string" ? post.caption : undefined,
      thumbnailUrl: httpsUrl(post.thumbnailUrl ?? post.thumbnail_url),
      timestamp: typeof post.timestamp === "string" ? post.timestamp : "",
    }];
  }).slice(0, limit);
}

export async function getLatestInstagramPosts(
  limit = 10,
  signal?: AbortSignal,
  endpoint = import.meta.env?.PUBLIC_INSTAGRAM_API_URL,
): Promise<InstagramPost[]> {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(20, Math.floor(limit))) : 10;
  // Public URL only. Tokens and Instagram credentials must remain on the API server.
  // An unavailable integration should show the slider's error placeholder without a network request.
  if (!endpoint?.trim()) throw new Error("Instagram API is not configured");
  const url = new URL(endpoint);
  url.searchParams.set("limit", String(safeLimit));
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) abort();
  const timeout = setTimeout(abort, 12000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Instagram API error: ${response.status}`);
    return normalizeInstagramPosts(await response.json(), safeLimit);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
