export type InstagramPost = {
  id: string;
  caption?: string;
  mediaType?: string;
  mediaUrl: string;
  permalink: string;
  timestamp?: string;
};

type InstagramApiPost = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

const fallbackInstagramPosts: InstagramPost[] = [
  {
    id: "fallback-1",
    caption: "Regen Asli Nol Kalori",
    mediaType: "IMAGE",
    mediaUrl: "/img-1.png",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
  {
    id: "fallback-2",
    caption: "Regen untuk aktivitas harian",
    mediaType: "IMAGE",
    mediaUrl: "/img-2.png",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
  {
    id: "fallback-3",
    caption: "Kesegaran Regen",
    mediaType: "IMAGE",
    mediaUrl: "/img-3.png",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
  {
    id: "fallback-4",
    caption: "Regen 450ml",
    mediaType: "IMAGE",
    mediaUrl: "/banner-product.webp",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
  {
    id: "fallback-5",
    caption: "Regen 300ml",
    mediaType: "IMAGE",
    mediaUrl: "/product/regen.webp",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
];

export async function getLatestInstagramPosts(
  limit = 8,
): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramAccountId =
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ?? process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !instagramAccountId) {
    return fallbackInstagramPosts;
  }

  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION ?? "v24.0";
  const endpoint = new URL(
    `https://graph.facebook.com/${apiVersion}/${instagramAccountId}/media`,
  );

  endpoint.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
  );
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 * 30 },
    });

    if (!response.ok) {
      return fallbackInstagramPosts;
    }

    const payload = (await response.json()) as { data?: InstagramApiPost[] };
    const posts =
      payload.data
        ?.map((post) => ({
          id: post.id,
          caption: post.caption,
          mediaType: post.media_type,
          mediaUrl: post.thumbnail_url ?? post.media_url ?? "",
          permalink:
            post.permalink ?? "https://www.instagram.com/drinkregenid/",
          timestamp: post.timestamp,
        }))
        .filter((post) => post.mediaUrl.length > 0) ?? [];

    return posts.length > 0 ? posts : fallbackInstagramPosts;
  } catch {
    return fallbackInstagramPosts;
  }
}
