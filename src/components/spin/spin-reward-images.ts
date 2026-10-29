export function getSpinRewardImage(reward: {
  code: string;
  name?: string;
  points?: number;
}): string | undefined {
  if (reward.code.startsWith("TRY_AGAIN")) return "/hadiah-spin/cobalagi.webp";
  if (reward.code.startsWith("POINTS_")) {
    const points = reward.points ?? Number(reward.code.split("_")[1]);
    return points === 10
      ? "/hadiah-spin/poin10.webp"
      : points === 5
        ? "/hadiah-spin/poin5.webp"
        : undefined;
  }
  if (reward.code.startsWith("VOUCHER_")) {
    const percentage =
      reward.name?.match(/(\d+)\s*%/)?.[1] ?? reward.code.split("_")[1];
    if (percentage === "20" || percentage === "50")
      return `/hadiah-spin/voucher${percentage}.webp`;
  }
  return undefined;
}
