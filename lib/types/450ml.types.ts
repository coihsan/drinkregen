import { PRODUCT450ML_VARIANTS } from "@/lib/product-catalog";
import type {
  Product450mlFlavorId,
  ProductVariant,
} from "@/lib/product-catalog";

export type { Product450mlFlavorId };

export interface NutritionInfo450ml {
  calories: string;
  sugar: string;
  vitamin: string[];
  benefits: string[];
}

export type FlavorMetadata450ml = ProductVariant & {
  id: Product450mlFlavorId;
  productSize: "450ml";
  sweetener: "sucralose";
  nutrition: NutritionInfo450ml;
};

export const PRODUCT450mlFLAVORS = PRODUCT450ML_VARIANTS as unknown as FlavorMetadata450ml[];
