export const redemptionImages: Record<string, string> = {
  CARTON: "/spin/karton-regen.webp",
  THREE_BOTTLES: "/spin/3botol-regen.webp",
};

export const defaultRedemptionImage = "/spin/3botol-regen.webp";

export function getRedemptionImage(option: {
  id: string;
  type?: string;
  imageUrl?: string;
}): string | undefined {
  if (option.imageUrl) {
    const origin = new URL(
      import.meta.env?.PUBLIC_SPIN_API_URL || "https://api.drinkregen.com",
    ).origin;
    try {
      const url = new URL(option.imageUrl, origin);
      if (["https:", "http:"].includes(url.protocol)) return url.href;
    } catch {}
  }
  return (
    redemptionImages[option.id] ??
    (
      {
        CARTON_MIX: "/spin/karton-regen.webp",
        BOTTLE: "/spin/3botol-regen.webp",
      } as Record<string, string>
    )[option.type ?? ""]
  );
}
