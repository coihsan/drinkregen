import assert from "node:assert/strict";
import { test } from "node:test";
import { getPosts } from "./blog";

test("CMS article links resolve to published frontend pages during sanitization", async () => {
  const links = [
    ["https://cms.drinkregen.com/?p=27", "/blog/kurangi-gula"],
    ["https://cms.drinkregen.com/?p=27&amp;utm_source=blog#tips", "/blog/kurangi-gula?utm_source=blog#tips"],
    ["http://cms.drinkregen.com/kurangi-gula/", "/blog/kurangi-gula"],
    ["//cms.drinkregen.com/2026/10/kurangi-gula/#tips", "/blog/kurangi-gula#tips"],
    ["https://cms.drinkregen.com/?p=99", "https://cms.drinkregen.com/?p=99"],
    ["https://cms.drinkregen.com/wp-content/uploads/image.jpg", "https://cms.drinkregen.com/wp-content/uploads/image.jpg"],
    ["https://example.com/?p=27", "https://example.com/?p=27"],
    ["/blog/kurangi-gula", "/blog/kurangi-gula"],
    ["#tips", "#tips"],
  ];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ data: [
    {
      id: 27, slug: "kurangi-gula", status: "publish",
      link: "https://cms.drinkregen.com/2026/10/kurangi-gula/",
      title: { rendered: "Kurangi gula" }, excerpt: { rendered: "Ringkasan" },
      content: { rendered: links.map(([href], index) => `<a href="${href}">Link ${index}</a>`).join("") + '<script>alert(1)</script><a href="javascript:alert(1)">Unsafe</a>' },
      featured_media: 0,
    },
    { id: 99, slug: "draft", status: "draft" },
  ] }));
  try {
    const posts = await getPosts();
    assert.equal(posts.length, 1);
    for (const [, expected] of links) {
      assert.ok(posts[0].content.includes(`href="${expected}"`), expected);
    }
    assert.ok(!posts[0].content.includes("<script"));
    assert.ok(!posts[0].content.includes("javascript:"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
