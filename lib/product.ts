import {
  PRODUCT300ML_VARIANTS,
  PRODUCT450ML_VARIANTS,
  type ProductVariant,
} from "@/lib/product-catalog";

const toLegacyItemProduct = (variant: ProductVariant) => ({
  name: variant.name.replace("Regen ", ""),
  bgColor: variant.productSize === "300ml" ? variant.vitaminColor : variant.vitaminColor,
  titleColor: variant.titleColor,
  usp: variant.usp,
  description: variant.description,
  imageUrl: variant.bottleImage,
  vitamin: variant.vitamin,
  url: variant.detailUrl,
  komposisi: variant.komposisi,
});

const toLegacy450mlProduct = (variant: ProductVariant) => ({
  name: variant.name,
  usp: variant.usp,
  description: variant.description,
  imageUrl: variant.bottleImage,
  vitamin: variant.vitamin,
  komposisi: variant.komposisi,
});

export const waterMelonProduct450ml = toLegacy450mlProduct(
  PRODUCT450ML_VARIANTS.find((variant) => variant.id === "watermelon")!,
);

export const appleProduct450ml = toLegacy450mlProduct(
  PRODUCT450ML_VARIANTS.find((variant) => variant.id === "apple")!,
);

export const lemonLimeProduct450ml = toLegacy450mlProduct(
  PRODUCT450ML_VARIANTS.find((variant) => variant.id === "lemonlime")!,
);

export const ItemProduct300ml = PRODUCT300ML_VARIANTS.map(toLegacyItemProduct);

export const ProductDisplaySection = PRODUCT300ML_VARIANTS.map((variant) => ({
  id: variant.id,
  name: variant.displayName,
  prefix: "REGEN",
  usp: variant.usp,
  image: variant.labelImage,
  bg: variant.vitaminColor,
  regenColor: variant.id === "watermelon" ? "text-white" : "text-[#00A651]",
  nameColor: variant.textColorDark,
  uspColor: variant.id === "watermelon" ? "text-white" : variant.textColorDark,
}));
