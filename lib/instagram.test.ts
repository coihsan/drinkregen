import { describe, expect, it } from "vitest";

import { extractInstagramApiPosts, normalizeInstagramApiPosts } from "./instagram";

describe("extractInstagramApiPosts", () => {
  it("reads posts from business_discovery.media.data", () => {
    const payload = {
      business_discovery: {
        media: {
          data: [
            {
              id: "1",
              caption: "Hello",
              media_type: "IMAGE",
              media_url: "https://example.com/photo.jpg",
              permalink: "https://www.instagram.com/p/1/",
            },
          ],
        },
      },
    };

    expect(extractInstagramApiPosts(payload)).toHaveLength(1);
    expect(extractInstagramApiPosts(payload)[0]?.id).toBe("1");
  });
});

describe("normalizeInstagramApiPosts", () => {
  it("maps Graph API media payload into Instagram posts", () => {
    const apiPosts = [
      {
        id: "1",
        caption: "Hello",
        media_type: "IMAGE",
        media_url: "https://example.com/photo.jpg",
        permalink: "https://www.instagram.com/p/1/",
        timestamp: "2024-01-01T00:00:00+00:00",
      },
    ];

    expect(normalizeInstagramApiPosts(apiPosts)).toEqual([
      {
        id: "1",
        caption: "Hello",
        mediaType: "IMAGE",
        mediaUrl: "https://example.com/photo.jpg",
        permalink: "https://www.instagram.com/p/1/",
        timestamp: "2024-01-01T00:00:00+00:00",
      },
    ]);
  });

  it("uses child media_url when media_url is missing", () => {
    const apiPosts = [
      {
        id: "2",
        caption: "Child media",
        media_type: "CAROUSEL_ALBUM",
        thumbnail_url: "https://example.com/thumb.jpg",
        children: {
          data: [{ media_url: "https://example.com/child.jpg" }],
        },
      },
    ];

    expect(normalizeInstagramApiPosts(apiPosts)).toEqual([
      {
        id: "2",
        caption: "Child media",
        mediaType: "CAROUSEL_ALBUM",
        mediaUrl: "https://example.com/child.jpg",
        permalink: "https://www.instagram.com/drinkregenid/",
        timestamp: undefined,
      },
    ]);
  });

  it("uses thumbnail_url for video posts", () => {
    const apiPosts = [
      {
        id: "3",
        caption: "Video post",
        media_type: "VIDEO",
        media_url: "https://example.com/video.mp4",
        thumbnail_url: "https://example.com/thumb.jpg",
        permalink: "https://www.instagram.com/p/3/",
      },
    ];

    expect(normalizeInstagramApiPosts(apiPosts)).toEqual([
      {
        id: "3",
        caption: "Video post",
        mediaType: "VIDEO",
        mediaUrl: "https://example.com/thumb.jpg",
        permalink: "https://www.instagram.com/p/3/",
        timestamp: undefined,
      },
    ]);
  });
});
