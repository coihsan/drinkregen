export type InstagramPost = {
  id: string;
  caption?: string;
  mediaType?: string;
  mediaUrl: string;
  permalink: string;
  timestamp?: string;
};

// Kita sesuaikan tipe dari API Meta untuk Business Discovery
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
  limit = 10,
): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  // Ini adalah ID pengakses Anda (misal: 17841447581538769 dari kode Vue sebelumnya)
  const instagramAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID; 

  if (!accessToken || !instagramAccountId) {
    return fallbackInstagramPosts;
  }

  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION ?? "v23.0";
  const targetAccount = "drinkregenid"; // Target akun yang ingin di-fetch
  
  // URL dasar endpoint (tanpa /media, karena kita menggunakan business_discovery)
  const endpoint = new URL(
    `https://graph.facebook.com/${apiVersion}/${instagramAccountId}`,
  );

  // Field spesifik dari Business Discovery API
  // Mengambil data media dari targetAccount beserta children (untuk tipe carousel/slide)
  const queryFields = `business_discovery.username(${targetAccount}){media.limit(${limit}){id,caption,timestamp,media_type,permalink,media_url,thumbnail_url,children{media_url}}}`;

  endpoint.searchParams.set("fields", queryFields);
  endpoint.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(endpoint, {
      // Fitur Next.js: Cache data selama 30 menit untuk mengurangi hit API Meta
      next: { revalidate: 60 * 30 }, 
    });

    if (!response.ok) {
      console.error("Instagram API Error:", await response.text());
      return fallbackInstagramPosts;
    }

    const payload = await response.json();
    
    // Akses array post yang tersembunyi di dalam business_discovery
    const apiPosts: InstagramApiPost[] = payload.business_discovery?.media?.data ?? [];

    const posts = apiPosts
      .map((post) => {
        // Penanganan untuk postingan Carousel:
        // Terkadang root 'media_url' kosong pada tipe carousel, jadi kita ambil dari children pertama
        let finalMediaUrl = post.thumbnail_url ?? post.media_url ?? "";
        if (!finalMediaUrl && post.children?.data?.length) {
          finalMediaUrl = post.children.data[0]?.media_url || "";
        }

        return {
          id: post.id,
          caption: post.caption,
          mediaType: post.media_type,
          mediaUrl: finalMediaUrl,
          permalink: post.permalink ?? `https://www.instagram.com/${targetAccount}/`,
          timestamp: post.timestamp,
        };
      })
      .filter((post) => post.mediaUrl.length > 0);

    return posts.length > 0 ? posts : fallbackInstagramPosts;
  } catch (error) {
    console.error("Failed to fetch Instagram posts:", error);
    return fallbackInstagramPosts;
  }
}