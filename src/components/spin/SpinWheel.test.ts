import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SpinWheel from "./SpinWheel";

test("wheel renders nine named segments without prize icons or images", () => {
  const rewards = Array.from({ length: 9 }, (_, i) => ({
    code: `POINTS_5_TEST${i}`,
    name: `Bonus ${i + 1}`,
    points: i + 1,
  }));
  const markup = renderToStaticMarkup(
    createElement(SpinWheel, {
      rewards,
      result: null,
      onComplete() {},
      onSpin() {},
      disabled: false,
      spinning: false,
    }),
  );
  assert.equal((markup.match(/<g /g) ?? []).length, 9);
  assert.equal((markup.match(/<text /g) ?? []).length, 9);
  assert.match(markup, /BONUS 9/);
  assert.doesNotMatch(
    markup,
    /<image|lucide-coins|lucide-ticket|lucide-rotate/,
  );
  assert.match(markup, /320deg 359.5deg/);
});

test("empty catalog does not silently add default prizes", () => {
  const markup = renderToStaticMarkup(
    createElement(SpinWheel, {
      rewards: [],
      result: null,
      onComplete() {},
      onSpin() {},
      disabled: false,
      spinning: false,
    }),
  );
  assert.equal((markup.match(/<text /g) ?? []).length, 0);
  assert.match(markup, /<button[^>]*disabled/);
});
