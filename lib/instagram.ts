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
  children?: {
    data: { media_url: string }[];
  };
};

export function extractInstagramApiPosts(payload: unknown): InstagramApiPost[] {
  const maybePayload = payload as {
    business_discovery?: {
      media?: { data?: InstagramApiPost[] };
      username?: { media?: { data?: InstagramApiPost[] } };
    };
  };

  return (
    maybePayload?.business_discovery?.media?.data ??
    maybePayload?.business_discovery?.username?.media?.data ??
    []
  );
}

export function normalizeInstagramApiPosts(
  apiPosts: InstagramApiPost[],
  username = "drinkregenid",
): InstagramPost[] {
  return apiPosts
    .map((post) => {
      let finalMediaUrl = post.media_url ?? "";

      if (!finalMediaUrl && post.children?.data?.length) {
        const childMedia = post.children.data.find((child) => Boolean(child.media_url));
        finalMediaUrl = childMedia?.media_url || "";
      }

      if (!finalMediaUrl && post.thumbnail_url) {
        finalMediaUrl = post.thumbnail_url;
      }

      return {
        id: post.id,
        caption: post.caption,
        mediaType: post.media_type,
        mediaUrl: finalMediaUrl,
        permalink: post.permalink ?? `https://www.instagram.com/${username}/`,
        timestamp: post.timestamp,
      };
    })
    .filter((post) => post.mediaUrl.length > 0);
}

const fallbackInstagramPosts: InstagramPost[] = [
  {
    id: "fallback-1",
    caption: "Regen Asli Nol Kalori",
    mediaType: "IMAGE",
    mediaUrl: "/banner-product.webp",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
  {
    id: "fallback-2",
    caption: "Regen untuk aktivitas harian",
    mediaType: "IMAGE",
    mediaUrl: "/regen.webp",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
  {
    id: "fallback-3",
    caption: "Kesegaran Regen",
    mediaType: "IMAGE",
    mediaUrl: "/regen-dark.webp",
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
    mediaUrl: "/regen-logo.webp",
    permalink: "https://www.instagram.com/drinkregenid/",
  },
];

export async function getLatestInstagramPosts(
  limit = 10,
): Promise<InstagramPost[]> {
  const accessToken = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramAccountId = import.meta.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const apiVersion = import.meta.env.INSTAGRAM_GRAPH_API_VERSION ?? "v23.0";
  const targetAccount = "drinkregenid";

  if (!accessToken || !instagramAccountId) {
    console.warn("Instagram credentials are missing; using fallback posts.");
    return fallbackInstagramPosts;
  }

  const endpoint = new URL(`https://graph.facebook.com/${apiVersion}/${instagramAccountId}`);
  const queryFields = `business_discovery.username(${targetAccount}){media.limit(${limit}){id,caption,timestamp,media_type,permalink,media_url,thumbnail_url,children{media_url}}}`;

  endpoint.searchParams.set("fields", queryFields);
  endpoint.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Instagram API Error:", errorText);
      return fallbackInstagramPosts;
    }

    const payload = await response.json();
    const apiPosts = extractInstagramApiPosts(payload);

    const posts = normalizeInstagramApiPosts(apiPosts, targetAccount);
    return posts.length > 0 ? posts : fallbackInstagramPosts;
  } catch (error) {
    console.error("Failed to fetch Instagram posts:", error);
    return fallbackInstagramPosts;
  }
}