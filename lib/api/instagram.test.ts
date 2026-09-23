import assert from "node:assert/strict";
import { test } from "node:test";
import { getLatestInstagramPosts, normalizeInstagramPosts } from "./instagram";
const post = { id: "1", media_type: "IMAGE", media_url: "https://cdn.example.com/post.jpg", permalink: "https://www.instagram.com/p/regen/" };
test("normalizes native and camelCase fields, including video thumbnails", () => {
  const result = normalizeInstagramPosts({ data: [post, { id: "2", mediaType: "VIDEO", mediaUrl: "https://cdn.example.com/video.mp4", thumbnailUrl: "https://cdn.example.com/thumb.jpg", permalink: post.permalink }] }, 10);
  assert.equal(result[0].mediaType, "IMAGE");
  assert.equal(result[1].thumbnailUrl, "https://cdn.example.com/thumb.jpg");
});
test("filters malformed, duplicate and unsafe posts before limiting", () => {
  const result = normalizeInstagramPosts({ success: true, data: [null, {...post, id:"bad", permalink:"https://instagram.com.evil.test/p/x"}, {...post,id:"unsafe",media_url:"javascript:alert(1)"}, post, post, {...post,id:"2"}] }, 1);
  assert.deepEqual(result.map(item => item.id), ["1"]);
});
test("distinguishes an empty feed from an invalid response", () => {
  assert.deepEqual(normalizeInstagramPosts({data:[]}, 10), []);
  assert.throws(() => normalizeInstagramPosts({success:false,data:[]}, 10));
  assert.throws(() => normalizeInstagramPosts({data:{}}, 10));
});
test("HTTP errors are surfaced and request limits are bounded", async () => {
  const original=globalThis.fetch;
  globalThis.fetch=async input => { assert.equal(new URL(String(input)).searchParams.get("limit"), "20"); return new Response("missing",{status:404}); };
  try { await assert.rejects(getLatestInstagramPosts(100, undefined, "https://api.example.com/instagram"), /404/); } finally {globalThis.fetch=original;}
});
test("caller cancellation reaches the network request", async () => {
  const original=globalThis.fetch;
  const controller=new AbortController(); controller.abort();
  globalThis.fetch=async (_input,init) => { assert.equal(init?.signal?.aborted,true); throw new DOMException("Aborted","AbortError"); };
  try { await assert.rejects(getLatestInstagramPosts(10,controller.signal,"https://api.example.com/instagram"),{name:"AbortError"}); } finally {globalThis.fetch=original;}
});
test("unconfigured integration does not make a network request", async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => { requests++; throw new Error("Unexpected request"); };
  try {
    await assert.rejects(getLatestInstagramPosts(10, undefined, ""), /not configured/);
    assert.equal(requests, 0);
  } finally { globalThis.fetch = original; }
});
