import {
  getProductVariant,
  type ProductSize,
  type FlavorId,
} from "@/lib/product-catalog";
import { DetailProductAvailableByVariant } from "@/lib/product-availability";

interface SchemaParams {
  size: ProductSize;
  flavorId: FlavorId;
  pageUrl: string;
  siteUrl?: string;
}

export const generateRegenProductSchema = ({
  size,
  flavorId,
  pageUrl,
  siteUrl = "https://drinkregen.com",
}: SchemaParams) => {
  const variant = getProductVariant(size, flavorId);

  const availability =
    size === "300ml"
      ? DetailProductAvailableByVariant["300ml"][flavorId as keyof typeof DetailProductAvailableByVariant["300ml"]]
      : DetailProductAvailableByVariant["450ml"][flavorId as keyof typeof DetailProductAvailableByVariant["450ml"]];

  if (!variant) {
    return null; 
  }

  const absoluteImageUrl = new URL(variant.bottleImage, siteUrl).href;

  const onlineStores = availability?.stores?.online || [];
  
  const productPrice = size === "300ml" ? "7000" : "14500"; 

  const offers =
    onlineStores.length > 0
      ? onlineStores.map((store) => ({
          "@type": "Offer",
          url: store.urlStore,
          priceCurrency: "IDR",
          price: productPrice,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: store.name, 
          },
        }))
      : {

          "@type": "Offer",
          url: pageUrl,
          priceCurrency: "IDR",
          price: productPrice,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${variant.name} ${variant.productSize}`,
    image: [absoluteImageUrl],
    description: `${variant.tagline} ${variant.description}`,
    sku: `REGEN-${variant.id.toUpperCase()}-${variant.productSize.toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "Regen",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Keunggulan",
        value: variant.usp,
      },
      {
        "@type": "PropertyValue",
        name: "Pemanis",
        value: variant.sweetener,
      }
    ],
    offers: offers,
  };
};