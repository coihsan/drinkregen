import type { NilaiGiziItem, VitaminGiziItem } from "./InformasiGizi";

export type ProductSize = "300ml" | "450ml";
export type Sweetener = "stevia" | "sucralose";
export type FlavorId =
  | "orange"
  | "lychee"
  | "peach"
  | "watermelon"
  | "apple"
  | "lemonlime";
export type Product450mlFlavorId = "watermelon" | "apple" | "lemonlime";

export type ProductVariant = {
  id: FlavorId;
  productSize: ProductSize;
  sweetener: Sweetener;
  name: string;
  displayName: string;
  usp: string;
  flavorTitle: string;
  tagline: string;
  description: string;
  textColor: string;
  bgColor: string;
  bgGradient: string;
  accentColor: string;
  textColorDark: string;
  liquidColor: string;
  labelColor: string;
  titleColor: string;
  vitaminColor: string;
  bottleImage: string;
  labelImage: string;
  detailUrl: string;
  nutrition: {
    calories: string;
    sugar: string;
    vitaminC?: string;
    vitamin?: string[];
    benefits: string[];
  };
  vitamin: string[];
  nutritionFacts: NilaiGiziItem[];
  vitaminFacts: VitaminGiziItem[];
  komposisi: string;
};

const create300mlVariant = (
  variant: Omit<
    ProductVariant,
    | "productSize"
    | "sweetener"
    | "bottleImage"
    | "labelImage"
    | "detailUrl"
  >,
): ProductVariant => ({
  ...variant,
  productSize: "300ml",
  sweetener: "stevia",
  bottleImage: `/300ml/${variant.id}.webp`,
  labelImage: `/product/${variant.id}.webp`,
  detailUrl: `/product/regen-300ml/${variant.id}`,
});

const create450mlVariant = (
  variant: Omit<
    ProductVariant,
    | "productSize"
    | "sweetener"
    | "bottleImage"
    | "labelImage"
    | "detailUrl"
  > & { id: Product450mlFlavorId },
): ProductVariant => ({
  ...variant,
  productSize: "450ml",
  sweetener: "sucralose",
  bottleImage: `/450ml/${variant.id}-450ml.webp`,
  labelImage: `/product/${variant.id}.webp`,
  detailUrl: `/product/regen-450ml/${variant.id}`,
});

export const PRODUCT300ML_VARIANTS = [
  create300mlVariant({
    id: "orange",
    name: "Regen Orange",
    displayName: "ORANGE",
    usp: "TINGGI VITAMIN C",
    flavorTitle: "MINUMAN RASA JERUK",
    tagline:
      "Ledakan kesegaran jeruk dengan Vitamin C melimpah. Bikin seharian berenergi tanpa beban kalori!",
    description:
      "Kesegaran buah Orange yang autentik dipadukan dengan manisnya Stevia. Cocok dikonsumsi setelah olahraga, saat bekerja, atau kapanpun kamu butuh hidrasi yang ringan.",
    textColor: "text-[#EAB308]",
    textColorDark: "text-[#F97316]",
    titleColor: "text-orange-500",
    vitaminColor: "bg-orange-500",
    bgColor: "#F4AF1B",
    bgGradient: "from-[#F59E0B] via-[#D97706] to-[#B45309]",
    accentColor: "#F97316",
    liquidColor: "rgba(255, 140, 0, 0.75)",
    labelColor: "#F97316",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitaminC: "1000mg",
      vitamin: ["C", "B2", "B3", "B5", "B6", "B12"],
      benefits: [
        "Supports cardiovascular wellness",
        "Boosts immune response",
        "Improves iron absorption",
        "Radiant skin glow",
      ],
    },
    vitamin: ["C", "B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "60mg", dailyValue: "4%" },
    ],
    vitaminFacts: [
      { vitamin: "C", dailyValue: "100%" },
      { vitamin: "B2", dailyValue: "20%" },
      { vitamin: "B3", dailyValue: "20%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "30%" },
      { vitamin: "B12", dailyValue: "25%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Malat, Asam Sitrat, Natrium Sitrat), Pengemulsi (Natrium Karboksimetil Selulosa, Pati Natrium Oktenilsuksinat), Perisa Alami, Perisa Sintetik Jeruk (mengandung antioksidan alfa tokoferol), Garam, Antioksidan Asam Askorbat, Pengawet Natrium Benzoat, Pemanis Alami Glikosida Steviol (0,031%), Pengental Gom Xanthan, Pewarna Alami Beta Karoten, Ekstrak Guarana, Perisa Alami, Konsentrat Jeruk (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
  create300mlVariant({
    id: "lychee",
    name: "Regen Lychee",
    displayName: "LYCHEE",
    usp: "ENERGI DARI DALAM",
    flavorTitle: "MINUMAN RASA LECI",
    tagline:
      "Manisnya leci yang lembut, siap balikin semangat kamu. Segarnya dapet, bebas rasa bersalah!",
    description:
      "Rasakan kesegaran Leci dalam setiap tegukan Regen Lychee. Dengan rasa manis alami dari stevia, minuman ini memberikan kenikmatan tanpa kalori tambahan. Cocok untuk menemani hari-harimu dengan cita rasa yang menyegarkan dan bebas gula.",
    textColor: "text-[#EC4899]",
    textColorDark: "text-[#BE185D]",
    titleColor: "text-pink-500",
    vitaminColor: "bg-pink-500",
    bgColor: "#FCE7F3",
    bgGradient: "from-[#FEE2E2] via-[#FCE7F3] to-[#F472B6]",
    accentColor: "#EC4899",
    liquidColor: "rgba(255, 240, 245, 0.85)",
    labelColor: "#E11D48",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Aids digestion & blood flow", "Restores cell vitality", "Packed with polyphenols", "Balances mental fatigue"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "60mg", dailyValue: "4%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "20%" },
      { vitamin: "B3", dailyValue: "20%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "25%" },
      { vitamin: "B12", dailyValue: "25%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Malat, Natrium Sitrat), Pengemulsi Natrium Karboksimetil Selulosa dan Pati Natrium Oktenilsuksinat), Perisa Alami, Perisa Sintetik Leci, Garam, Pengawet Natrium Benzoat, Pemanis Alami Glikosida Steviol (0.031%), Pengental Gom Xanthan, Perisa Alami, Ekstrak Guarana, Konsentrat Leci (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
  create300mlVariant({
    id: "peach",
    name: "Regen Peach",
    displayName: "PEACH",
    usp: "DUKUNG KILAUMU",
    flavorTitle: "MINUMAN RASA PERSIK",
    tagline:
      "Wangi persik yang memikat, bantu jaga hidrasi dan pancarkan kilau aktif dari dalam.",
    description:
      "Rasakan kesegaran Persik dalam setiap tegukan Regen Peach. Dengan rasa manis alami dari stevia, minuman ini memberikan kenikmatan tanpa kalori tambahan. Cocok untuk menemani hari-harimu dengan cita rasa yang menyegarkan dan bebas gula.",
    textColor: "text-[#F97316]",
    textColorDark: "text-[#C2410C]",
    titleColor: "text-orange-300",
    vitaminColor: "bg-orange-300",
    bgColor: "#FFEDD5",
    bgGradient: "from-[#FFEDD5] via-[#FED7AA] to-[#FDBA74]",
    accentColor: "#FB923C",
    liquidColor: "rgba(255, 186, 116, 0.75)",
    labelColor: "#FB923C",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Enhances skin elasticity", "Encourages cell longevity", "Potassium-rich electrolyte base", "Promotes digestive comfort"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "60mg", dailyValue: "4%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "20%" },
      { vitamin: "B3", dailyValue: "20%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "30%" },
      { vitamin: "B12", dailyValue: "25%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Malat, Natrium Sitrat), Pengemulsi Natrium Karboksimetil Selulosa, Perisa Alami, Perisa Sintetik Persik, Garam, Pengawet Natrium Benzoat, Pemanis Alami Glikosida Steviol (0,031%), Pengental Gom Xanthan, Pewarna Alami Karmin CI. No. 75470, Ekstrak Guarana, Perisa Alami, Ekstrak Persik (0.005%) (mengandung Pewarna Alami Beta karoten (sintetik) CI. No. 40800), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
  create300mlVariant({
    id: "watermelon",
    name: "Regen Watermelon",
    displayName: "WATERMELON",
    usp: "HIDRASI MAKSIMAL",
    flavorTitle: "MINUMAN RASA SEMANGKA",
    tagline:
      "Pelepas dahaga paling juara dari kesegaran semangka asli. Rehidrasi instan pasca-aktivitas!",
    description:
      "Nikmati kesegaran Semangka dalam setiap tegukan Regen Watermelon. Dengan rasa manis alami dari stevia, minuman ini memberikan kenikmatan tanpa kalori tambahan. Cocok untuk menemani hari-harimu dengan cita rasa yang menyegarkan dan bebas gula.",
    textColor: "text-[#10B981]",
    textColorDark: "text-[#047857]",
    titleColor: "text-green-500",
    vitaminColor: "bg-green-500",
    bgColor: "#EF4444",
    bgGradient: "from-[#10B981] via-[#059669] to-[#047857]",
    accentColor: "#10B981",
    liquidColor: "rgba(225, 29, 72, 0.8)",
    labelColor: "#10B981",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Instant rehydration matrix", "Speeds up muscle recovery", "Contains L-Citrulline amino acids", "Zero glycemic impact"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "60mg", dailyValue: "4%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "20%" },
      { vitamin: "B3", dailyValue: "20%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "30%" },
      { vitamin: "B12", dailyValue: "25%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Sitrat, Asam Malat, Natrium Sitrat), Pengemulsi Natrium Karboksimetil Selulosa, Perisa Alami, Perisa Sintetik Semangka, Garam, Pemanis Alami Glikosida Steviol (0.031%), Pengawet Natrium Benzoat, Pengental Gom Xanthan, Pewarna Alami Antosianin, Ekstrak Guarana, Perisa Alami, Ekstrak Semangka (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12), Pewarna Alami Karamel IV Amonia Sulfit Proses.",
  }),
  create300mlVariant({
    id: "apple",
    name: "Regen Apple",
    displayName: "APPLE",
    usp: "MENDUKUNG IMUN",
    flavorTitle: "MINUMAN RASA APEL",
    tagline:
      "Segarnya apel autentik yang kaya antioksidan. Benteng pertahanan tubuh kamu setiap hari.",
    description:
      "Nikmati kesegaran Apel dalam setiap tegukan Regen Apple. Dengan rasa manis alami dari stevia, minuman ini memberikan kenikmatan tanpa kalori tambahan. Cocok untuk menemani hari-harimu dengan cita rasa yang menyegarkan dan bebas gula.",
    textColor: "text-[#F43F5E]",
    textColorDark: "text-[#BE1230]",
    titleColor: "text-pink-500",
    vitaminColor: "bg-pink-500",
    bgColor: "#FFE4E6",
    bgGradient: "from-[#000000] via-[#F43F5E] to-[#E11D48]",
    accentColor: "#F43F5E",
    liquidColor: "rgba(255, 175, 180, 0.75)",
    labelColor: "#EC4899",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Rich in antioxidant active protection", "Enhances cellular barrier defense", "Promotes respiratory health", "Crisp natural energy replenishment"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "60mg", dailyValue: "4%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "20%" },
      { vitamin: "B3", dailyValue: "20%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "30%" },
      { vitamin: "B12", dailyValue: "25%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Sitrat, Asam Malat, Natrium Sitrat), Pengemulsi Natrium Karboksimetil Selulosa, Perisa Alami, Perisa Sintetik Apel, Garam, Pemanis Alami Glikosida Steviol (0.031%), Pengawet Natrium Benzoat, Gula Terkaramelisasi, Pengental Gom Xanthan, Ekstrak Guarana, Perisa Alami, Konsentrat Apel (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
  create300mlVariant({
    id: "lemonlime",
    name: "Regen Lemon Lime",
    displayName: "LEMON LIME",
    usp: "PENAMBAH SEMANGAT",
    flavorTitle: "MINUMAN RASA LEMON LIME",
    tagline:
      "Kombinasi lemon-jeruk nipis yang super nendang. Fokus auto balik, mood langsung naik!",
    description:
      "Nikmati kesegaran Lemon dan jeruk nipis dalam setiap tegukan Regen Lemon Lime. Dengan rasa manis alami dari stevia, minuman ini memberikan kenikmatan tanpa kalori tambahan. Cocok untuk menemani hari-harimu dengan cita rasa yang menyegarkan dan bebas gula.",
    textColor: "text-[#84CC16]",
    textColorDark: "text-[#4D7C0F]",
    titleColor: "text-lime-400",
    vitaminColor: "bg-lime-500",
    bgColor: "#D9F99D",
    bgGradient: "from-[#A3E635] via-[#84CC16] to-[#65A30D]",
    accentColor: "#84CC16",
    liquidColor: "rgba(217, 249, 157, 0.7)",
    labelColor: "#84CC16",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Immediate cognitive clarity", "Alkalizing electrolyte blend", "Supports natural detoxification", "Crisp morning pick-me-up"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "60mg", dailyValue: "4%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "20%" },
      { vitamin: "B3", dailyValue: "20%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "30%" },
      { vitamin: "B12", dailyValue: "25%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Sitrat, Asam Malat, Natrium Sitrat), Pengemulsi Natrium Karboksimetil Selulosa, Perisa Alami, Perisa Sintetik Lemon Lime, Garam, Pemanis Alami Glikosida Steviol (0,031%), Pengawet Natrium Benzoat, Pengental Gom Xanthan, Ekstrak Guarana, Perisa Alami, Konsentrat Lemon (0.005%), Bubuk Konsentrat Sari Buah Jeruk Nipis (0.004%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
] as const;

export const PRODUCT450ML_VARIANTS = [
  create450mlVariant({
    id: "watermelon",
    name: "Regen Watermelon",
    displayName: "WATERMELON",
    usp: "HIDRASI MAKSIMAL",
    flavorTitle: "MINUMAN RASA SEMANGKA",
    tagline:
      "Pelepas dahaga paling juara dari kesegaran semangka asli. Rehidrasi instan pasca-aktivitas!",
    description:
      "Nikmati kesegaran Semangka dalam setiap tegukan Regen Watermelon. Dengan pemanis sukralosa, minuman ini memberikan kesegaran bebas gula untuk menemani aktivitas harian Anda.",
    textColor: "text-[#10B981]",
    textColorDark: "text-[#047857]",
    titleColor: "text-green-500",
    vitaminColor: "bg-green-500",
    bgColor: "#EF4444",
    bgGradient: "from-[#10B981] via-[#059669] to-[#047857]",
    accentColor: "#10B981",
    liquidColor: "rgba(225, 29, 72, 0.8)",
    labelColor: "#10B981",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Instant rehydration matrix", "Speeds up muscle recovery", "Contains L-Citrulline amino acids", "Zero glycemic impact"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "85mg", dailyValue: "6%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "8%" },
      { vitamin: "B3", dailyValue: "10%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "20%" },
      { vitamin: "B12", dailyValue: "20%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Sitrat, Asam Malat, Natrium Sitrat) Pengemulsi Natrium Karboksimetil Selulosa, Perisa Sintetik Semangka, Garam, Pengawet Natrium Benzoat, Pewarna Alami Antosianin, Pengental (Xanthan Gum), Pemanis Buatan Sukralosa, Ekstrak Guarana, Perisa Alami, Pewarna Alami Karamel IV Amonia Sulfit Proses, Ekstrak Semangka (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
  create450mlVariant({
    id: "apple",
    name: "Regen Apple",
    displayName: "APPLE",
    usp: "MENDUKUNG IMUN",
    flavorTitle: "MINUMAN RASA APEL",
    tagline:
      "Segarnya apel autentik yang kaya antioksidan. Benteng pertahanan tubuh kamu setiap hari.",
    description:
      "Nikmati kesegaran Apel dalam setiap tegukan Regen Apple. Dengan pemanis sukralosa, minuman ini memberikan kesegaran bebas gula untuk menemani aktivitas harian Anda.",
    textColor: "text-[#F43F5E]",
    textColorDark: "text-[#BE1230]",
    titleColor: "text-pink-500",
    vitaminColor: "bg-pink-500",
    bgColor: "#FFE4E6",
    bgGradient: "from-[#000000] via-[#F43F5E] to-[#E11D48]",
    accentColor: "#F43F5E",
    liquidColor: "rgba(255, 175, 180, 0.75)",
    labelColor: "#EC4899",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Rich in antioxidant active protection", "Enhances cellular barrier defense", "Promotes respiratory health", "Crisp natural energy replenishment"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "85mg", dailyValue: "6%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "8%" },
      { vitamin: "B3", dailyValue: "10%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "20%" },
      { vitamin: "B12", dailyValue: "20%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Sitrat, Asam Malat, Natrium Sitrat) Pengemulsi Natrium Karboksimetil Selulosa, Perisa Sintetik Apel, Gula Terkaramelisasi, Garam, Pengawet Natrium Benzoat, Pengental (Xanthan Gum), Pemanis Buatan Sukralosa, Ekstrak Guarana, Perisa Alami, Konsentrat Apel (0.005%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
  create450mlVariant({
    id: "lemonlime",
    name: "Regen Lemon Lime",
    displayName: "LEMON LIME",
    usp: "PENAMBAH SEMANGAT",
    flavorTitle: "MINUMAN RASA LEMON LIME",
    tagline:
      "Kombinasi lemon-jeruk nipis yang super nendang. Fokus auto balik, mood langsung naik!",
    description:
      "Nikmati kesegaran Lemon dan jeruk nipis dalam setiap tegukan Regen Lemon Lime. Dengan pemanis sukralosa, minuman ini memberikan kesegaran bebas gula untuk menemani aktivitas harian Anda.",
    textColor: "text-[#84CC16]",
    textColorDark: "text-[#4D7C0F]",
    titleColor: "text-lime-400",
    vitaminColor: "bg-lime-500",
    bgColor: "#D9F99D",
    bgGradient: "from-[#A3E635] via-[#84CC16] to-[#65A30D]",
    accentColor: "#84CC16",
    liquidColor: "rgba(217, 249, 157, 0.7)",
    labelColor: "#84CC16",
    nutrition: {
      calories: "0 Kalori",
      sugar: "0g",
      vitamin: ["B2", "B3", "B5", "B6", "B12"],
      benefits: ["Immediate cognitive clarity", "Alkalizing electrolyte blend", "Supports natural detoxification", "Crisp morning pick-me-up"],
    },
    vitamin: ["B2", "B3", "B5", "B6", "B12"],
    nutritionFacts: [
      { label: "Lemak Total", amount: "0g", dailyValue: "0%" },
      { label: "Lemak Jenuh", amount: "0g", dailyValue: "0%" },
      { label: "Karbohidrat Total", amount: "0g", dailyValue: "0%" },
      { label: "Gula", amount: "0g", dailyValue: "0%" },
      { label: "Garam (Natrium)", amount: "85mg", dailyValue: "6%" },
    ],
    vitaminFacts: [
      { vitamin: "B2", dailyValue: "8%" },
      { vitamin: "B3", dailyValue: "10%" },
      { vitamin: "B5", dailyValue: "20%" },
      { vitamin: "B6", dailyValue: "20%" },
      { vitamin: "B12", dailyValue: "20%" },
    ],
    komposisi:
      "Air, Pengatur Keasaman (Asam Sitrat, Asam Malat, Natrium Sitrat) Pengemulsi Natrium Karboksimetil Selulosa, Perisa Sintetik Lemon Lime, Garam, Pengawet Natrium Benzoat, Pengental (Xanthan Gum), Pemanis Buatan Sukralosa, Ekstrak Guarana, Perisa Alami, Konsentrat Lemon (0.005%), Bubuk Konsentrat Sari Buah Jeruk Nipis (0.004%), Premiks Vitamin B (B2,B3,B5,B6,B12).",
  }),
] as const;

export const PRODUCT_VARIANTS_BY_SIZE = {
  "300ml": PRODUCT300ML_VARIANTS,
  "450ml": PRODUCT450ML_VARIANTS,
} as const;

export const getProductVariant = (size: ProductSize, id: FlavorId) =>
  PRODUCT_VARIANTS_BY_SIZE[size].find((variant) => variant.id === id);
