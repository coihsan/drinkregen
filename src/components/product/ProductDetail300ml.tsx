import { CheckCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { NilaiGiziItem, VitaminGiziItem } from "@/lib/InformasiGizi";
import LogoRegen from "../LogoRegen";
import InformasiNilaiGizi from "@/lib/InformasiGizi";
// import LogoRegenWhite from "../assets/icons/logo-regen-white.svg";

interface ProductItem300mlProps {
  sourceImage: string;
  productName: string;
  productUSP: string;
  titleColor: string;
  description?: string;
  productComp?: string;
  vitaminContent: string[];
  vitaminColor: string;
  nutritionFacts?: NilaiGiziItem[];
  vitaminFacts?: VitaminGiziItem[];
  nutritionTags?: string[];
  compositionNote?: string;
}

const DEFAULT_NUTRITION_TAGS = ["0 Kalori", "0% Gula", "Glikosida Steviol"];

interface VitaminListItemProps {
  content: string[];
  vitaminColor: string;
}

const ProductDetail300ml = ({
  sourceImage,
  productName,
  productUSP,
  productComp,
  description,
  titleColor,
  vitaminContent,
  vitaminColor,
  nutritionFacts,
  vitaminFacts,
  nutritionTags = DEFAULT_NUTRITION_TAGS,
  compositionNote = "Tanpa pemanis buatan",
}: ProductItem300mlProps) => {
  return (
    <main className="w-full mx-auto">
      <section className="flex-1 flex items-start justify-between w-full px-1 py-8">
        <ProductIntro
          description={description}
          productName={productName}
          productUSP={productUSP}
          titleColor={titleColor}
          vitaminColor={vitaminColor}
          vitaminContent={vitaminContent}
          nutritionTags={nutritionTags}
        />
        <div className="flex-1 flex justify-center max-w-[500px]">
          <ProductImage productName={productName} sourceImage={sourceImage} />
        </div>
      </section>
      <section className="flex items-center px-1 py-8">
        <ProductFacts
          nutritionFacts={nutritionFacts}
          productComp={productComp}
          vitaminFacts={vitaminFacts}
          compositionNote={compositionNote}
        />
      </section>
    </main>
  );
};
export default ProductDetail300ml;

const ProductIntro = ({
  description,
  productName,
  productUSP,
  titleColor,
  vitaminColor,
  vitaminContent,
  nutritionTags,
}: Pick<
  ProductItem300mlProps,
  | "description"
  | "productName"
  | "productUSP"
  | "titleColor"
  | "vitaminColor"
  | "vitaminContent"
  | "nutritionTags"
>) => {
  return (
    <div>
      <h2 className="text-4xl md:text-4xl lg:text-6xl font-bold uppercase leading-none inline-block items-center mt-6">
        <LogoRegen
          className={`${titleColor} inline-block align-middle h-[0.85em] w-auto fill-green-500 inline-middle`}
          width={120}
          height={30}
        />{" "}
        <span
          className={`${titleColor} font-bold italic inline-block align-middle`}
        >
          {productName}
        </span>
      </h2>
      <h3 className="font-bold block uppercase text-4xl md:text-4xl lg:text-6xl text-gray-600">
        {productUSP}
      </h3>
      <div className="pt-4">
        <p className="text-gray-500 leading-6 pb-3 max-w-[500px] w-full">{description}</p>
        <NutritionTagListItem content={nutritionTags ?? DEFAULT_NUTRITION_TAGS} />
        <div className="mt-4">
          <h5 className="font-semibold italic">Sumber Vitamin:</h5>
          <VitaminListItem
            vitaminColor={vitaminColor}
            content={vitaminContent}
          />
        </div>
      </div>
    </div>
  );
};

const ProductFacts = ({
  productComp,
  nutritionFacts,
  vitaminFacts,
  compositionNote,
}: Pick<
  ProductItem300mlProps,
  "productComp" | "nutritionFacts" | "vitaminFacts" | "compositionNote"
>) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md mt-0 md:mt-10 w-full">
      {nutritionFacts && nutritionFacts.length > 0 ? (
        <div className="mb-0">
          <InformasiNilaiGizi
            content={nutritionFacts}
            vitamins={vitaminFacts}
          />
        </div>
      ) : null}
      <Separator className="my-5" />
      <h5 className="font-semibold uppercase">Komposisi:</h5>
      <p className="text-gray-500 pt-2">{productComp}</p>
      {compositionNote ? (
        <p className="font-semibold text-gray-500 pt-2">{compositionNote}</p>
      ) : null}
      <Separator className="my-5" />
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="px-6 py-4 max-h-[60px] h-full flex items-center justify-center rounded-lg border-2 border-muted-foreground">
          <img
            src="/element/halal.svg"
            width={100}
            height={20}
            alt="logo halal"
          />
        </div>
        <div className="px-6 py-4 max-h-[60px] h-full flex items-center justify-center rounded-lg border-2 border-muted-foreground">
          <img
            src="/element/BPOM.svg"
            width={140}
            height={20}
            alt="logo BPOM"
          />
        </div>
      </div>
    </div>
  );
};

const ProductImage = ({
  productName,
  sourceImage,
}: Pick<ProductItem300mlProps, "productName" | "sourceImage">) => {
  return (
    <div className="max-w-[500px] w-full flex items-center justify-center">
      <img
        className="rounded-2xl pointer-event-none"
        src={sourceImage}
        width={150}
        height={100}
        alt={`Regen ${productName} product`}
      />
    </div>
  );
};

const NutritionTagListItem = ({ content }: { content: string[] }) => {
  return (
    <ul className="flex flex-wrap gap-2 items-center">
      {content.map((item, key) => (
        <li
          key={key}
          className="flex items-center justify-center flex-wrap font-semibold gap-2 px-4 py-2 rounded-full bg-white shadow-md w-auto"
        >
          <CheckCheck className="text-green-500" /> {item}
        </li>
      ))}
    </ul>
  );
};

const VitaminListItem = ({ content, vitaminColor }: VitaminListItemProps) => {
  return (
    <ul className="flex flex-wrap gap-2 items-center text-gray-600 mt-2">
      {content.map((item, key) => (
        <li
          className={`flex items-center justify-center rounded-full text-white font-bold text-2xl uppercase size-16 ${vitaminColor}`}
          key={key}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
