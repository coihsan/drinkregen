import { PRODUCT300ML_VARIANTS } from "@/lib/product-catalog";
import type { FlavorId, ProductVariant } from "@/lib/product-catalog";

export type { FlavorId };

export interface NutritionInfo {
  calories: string;
  sugar: string;
  vitaminC?: string;
  vitamin?: string[];
  stevia?: string;
  benefits: string[];
}

export type FlavorMetadata = ProductVariant & {
  productSize: "300ml";
  sweetener: "stevia";
  nutrition: NutritionInfo;
};

export const PRODUCT300mlFLAVORS = PRODUCT300ML_VARIANTS as unknown as FlavorMetadata[];
