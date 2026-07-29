export type OnlineStore = {
  name: string;
  urlStore: string;
  imageURL: string;
  ariaLabel: string;
};

export type OfflineStore = {
  name: string;
  query: string;
  imageURL: string;
  ariaLabel?: string;
};

export type ProductAvailability = {
  urlImage: string;
  productName: string;
  ariaLabel: string;
  bgProduct: string;
  isAvailable: boolean;
  stores: {
    online?: OnlineStore[];
    offline?: OfflineStore[];
  };
};

type ProductAvailabilityKey =
  | "orange"
  | "peach"
  | "lychee"
  | "watermelon"
  | "apple"
  | "lemonlime";
type ProductAvailability450mlKey = "watermelon" | "apple" | "lemonlime";
type ProductSizeKey = "300ml" | "450ml";

type OnlineStoreName = "Klik Indomaret" | "Alfagift" | "Shopee";
type OfflineStoreName =
  | "Indomaret"
  | "FamilyMart"
  | "Indogrosir"
  | "AlfaMart"
  | "K3Mart"
  | "Lawson"
  | "PrimaFood"
  | "CircleK"
  | "Superindo";

type OnlineStoreInput = {
  name: OnlineStoreName;
  urlStore: string;
};

const createOnlineStores = (productName: string, stores: OnlineStoreInput[]) =>
  stores.map((storeName) => {
    if (storeName.name === "Klik Indomaret") {
      return {
        name: storeName.name,
        urlStore: storeName.urlStore,
        imageURL: "/store/klik_indomaret.svg",
        ariaLabel: `Beli Regen ${productName} di Klik Indomaret`,
      };
    }

    if (storeName.name === "Alfagift") {
      return {
        name: storeName.name,
        urlStore: storeName.urlStore,
        imageURL: "/store/alfagift.svg",
        ariaLabel: `Beli Regen ${productName} di Alfagift`,
      };
    }

    return {
      name: storeName.name,
      urlStore: storeName.urlStore,
      imageURL: "/store/shopee.svg",
      ariaLabel: `Beli Regen ${productName} di Shopee`,
    };
  });

const createOfflineStores = (
  productName: string,
  stores: OfflineStoreName[],
) =>
  stores.map((storeName) => {
    if (storeName === "Indomaret") {
      return {
        name: storeName,
        query: "Indomaret terdekat",
        imageURL: "/store/indomaret.svg",
        ariaLabel: `Cari Indomaret terdekat untuk membeli Regen ${productName}`,
      };
    }
    if (storeName === "AlfaMart") {
      return {
        name: storeName,
        query: "Alfamart terdekat",
        imageURL: "/store/alfamart.svg",
        ariaLabel: `Cari Alfamart terdekat untuk membeli Regen ${productName}`,
      };
    }
    if (storeName === "FamilyMart") {
      return {
        name: storeName,
        query: "FamilyMart terdekat",
        imageURL: "/store/familymart.svg",
        ariaLabel: `Cari FamilyMart terdekat untuk membeli Regen ${productName}`,
      };
    }
    if (storeName === "Indogrosir") {
      return {
        name: storeName,
        query: "Indogrosir terdekat",
        imageURL: "/store/indogrosir.svg",
        ariaLabel: `Cari Indogrosir terdekat untuk membeli Regen ${productName}`,
      };
    }
    if (storeName === "K3Mart") {
      return {
        name: storeName,
        query: "K3Mart terdekat",
        imageURL: "/store/k3mart.svg",
        ariaLabel: `Cari K3Mart terdekat untuk membeli Regen ${productName}`,
      };
    }
    if (storeName === "Lawson") {
      return {
        name: storeName,
        query: "Lawson terdekat",
        imageURL: "/store/lawson.svg",
        ariaLabel: `Cari Lawson terdekat untuk membeli Regen ${productName}`,
      };
    }

    return {
      name: storeName,
      query: "FamilyMart terdekat",
      imageURL: "/store/familymart.svg",
      ariaLabel: `Cari FamilyMart terdekat untuk membeli Regen ${productName}`,
    };
  });

const createProductAvailability = ({
  key,
  productSize,
  productName,
  urlImage,
  bgProduct,
  online,
  offline,
}: {
  key: ProductAvailabilityKey;
  productSize: ProductSizeKey;
  productName: string;
  urlImage?: string;
  bgProduct: string;
  online: OnlineStoreInput[];
  offline: OfflineStoreName[];
}): ProductAvailability => ({
  urlImage: urlImage ?? `/${productSize}/${key}.webp`,
  productName: `${productName} ${productSize}`,
  ariaLabel: `Regen ${productName} ${productSize}`,
  bgProduct,
  isAvailable: true,
  stores: {
    online: createOnlineStores(`${productName} ${productSize}`, online),
    offline: createOfflineStores(`${productName} ${productSize}`, offline),
  },
});

const DetailProductAvailable300mlByVariant: Record<
  ProductAvailabilityKey,
  ProductAvailability
> = {
  orange: createProductAvailability({
    key: "orange",
    productSize: "300ml",
    productName: "Orange",
    bgProduct: "bg-orange-400",
    online: [
      {
        name: "Klik Indomaret",
        urlStore: "https://www.klikindomaret.com/xpress/regen-regen-minuman-isotonik-btl-300ml",
      },
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/product/1604974893/43980615755",
      },
    ],
    offline: ["Indomaret"],
  }),
  peach: createProductAvailability({
    key: "peach",
    productSize: "300ml",
    productName: "Peach",
    bgProduct: "bg-orange-200",
    online: [
      {
        name: "Alfagift",
        urlStore: "https://alfagift.id/p/regen-minuman-sehat-bebas-gula-peach-300-ml-832955",
      },
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/product/1604974893/46609973942",
      },
    ],
    offline: ["K3Mart"],
  }),
  lychee: createProductAvailability({
    key: "lychee",
    productSize: "300ml",
    productName: "Lychee",
    bgProduct: "bg-rose-500",
    online: [
      {
        name: "Alfagift",
        urlStore: "https://alfagift.id/p/regen-minuman-sehat-bebas-gula-leci-300-ml-832956",
      },
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/product/1604974893/53559956240",
      },
    ],
    offline: ["K3Mart"],
  }),
  watermelon: createProductAvailability({
    key: "watermelon",
    productSize: "300ml",
    productName: "Watermelon",
    bgProduct: "bg-green-400",
    online: [
      {
        name: "Alfagift",
        urlStore: "https://alfagift.id/p/regen-minuman-sehat-bebas-gula-semangka-300-ml-824020",
      },
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/product/1604974893/58159432420",
      },
    ],
    offline: ["AlfaMart", "FamilyMart"],
  }),
  apple: createProductAvailability({
    key: "apple",
    productSize: "300ml",
    productName: "Apple",
    bgProduct: "bg-pink-400",
    online: [
      {
        name: "Alfagift",
        urlStore: "https://alfagift.id/p/regen-minuman-sehat-bebas-gula-apel-300-ml-824022",
      },
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/product/1604974893/44130615738",
      },
    ],
    offline: ["AlfaMart", "FamilyMart"],
  }),
  lemonlime: createProductAvailability({
    key: "lemonlime",
    productSize: "300ml",
    productName: "Lemon Lime",
    bgProduct: "bg-lime-400",
    online: [
      {
        name: "Alfagift",
        urlStore: "https://alfagift.id/p/regen-minuman-sehat-bebas-gula-lemon-jeruk-nipis-300-ml-824021",
      },
      {
        name: "Klik Indomaret",
        urlStore: "https://www.klikindomaret.com/xpress/regen-regen-minuman-isotonik-btl-300ml-1",
      },
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/product/1604974893/24298138604",
      },
    ],
    offline: ["AlfaMart", "Indomaret", "FamilyMart", "Lawson"],
  }),
};

const DetailProductAvailable450mlByVariant: Record<
  ProductAvailability450mlKey,
  ProductAvailability
> = {
  watermelon: createProductAvailability({
    key: "watermelon",
    productSize: "450ml",
    productName: "Watermelon",
    urlImage: "/450ml/watermelon-450ml.webp",
    bgProduct: "bg-green-500",
    online: [
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/regendrink",
      },
    ],
    offline: ["AlfaMart", "FamilyMart"],
  }),
  apple: createProductAvailability({
    key: "apple",
    productSize: "450ml",
    productName: "Apple",
    urlImage: "/450ml/apple-450ml.webp",
    bgProduct: "bg-pink-500",
    online: [
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/regendrink",
      },
    ],
    offline: ["AlfaMart", "FamilyMart"],
  }),
  lemonlime: createProductAvailability({
    key: "lemonlime",
    productSize: "450ml",
    productName: "Lemon Lime",
    urlImage: "/450ml/lemonlime-450ml.webp",
    bgProduct: "bg-lime-500",
    online: [
      {
        name: "Shopee",
        urlStore: "https://shopee.co.id/regendrink",
      },
    ],
    offline: ["AlfaMart", "Indomaret", "FamilyMart", "Lawson"],
  }),
};

export const DetailProductAvailableByVariant = {
  ...DetailProductAvailable300mlByVariant,
  "300ml": DetailProductAvailable300mlByVariant,
  "450ml": DetailProductAvailable450mlByVariant,
} satisfies Record<ProductAvailabilityKey, ProductAvailability> &
  Record<"300ml", Record<ProductAvailabilityKey, ProductAvailability>> &
  Record<"450ml", Record<ProductAvailability450mlKey, ProductAvailability>>;
