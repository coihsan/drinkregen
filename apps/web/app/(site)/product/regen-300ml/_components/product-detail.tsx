import LogoRegen from "@/components/global/logo";
import { CheckCheck } from "lucide-react";
import Image from "next/image";

interface ProductItem300mlProps {
  sourceImage: string;
  productName: string;
  productUSP: string;
  titleColor: string;
  description?: string;
  productComp?: string;
  vitaminContent: string[];
  vitaminColor:string;
}

const NutritionTagList = ["0 Kalori", "0% Gula", "Glikosida Steviol"];

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
}: ProductItem300mlProps) => {
  return (
    <main className="flex flex-col flex-col-reverse lg:flex-row items-center justify-between w-full mx-auto">
      <div className="flex-1">
        <h2 className="text-4xl md:text-4xl lg:text-6xl font-bold uppercase leading-none inline-block items-center mt-6">
          <LogoRegen
            className={`${titleColor} inline-block h-[0.85em] w-auto fill-green-500 inline-middle`}
            width={120}
            height={30}
          />{" "}
          <span className={`${titleColor} font-bold leading-none italic`}>
            {productName}
          </span>
        </h2>
        <h3 className="font-semibold block uppercase text-4xl md:text-4xl lg:text-6xl">
          {productUSP}
        </h3>
        <div className="pt-4">
          <p className="text-gray-500 leading-6 pb-3">{description}</p>
          <NutritionTagListItem />
          <div className="mt-4">
            <h5 className="font-semibold italic">Sumber Vitamin:</h5>
            <VitaminListItem vitaminColor={vitaminColor} content={vitaminContent} />
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded-md mt-10">
          <h5 className="font-semibold">Komposisi:</h5>
          <p className="text-gray-500 pt-2">{productComp}</p>
          <p className="font-semibold text-gray-500 pt-2">
            Tanpa pemanis buatan
          </p>
        </div>
      </div>
      <div className="flex-1 w-full flex items-center justify-center md:justify-end lg:justify-end">
        <Image
          className="rounded-2xl"
          src={sourceImage}
          width={500}
          height={500}
          alt="regen 300ml orange product"
        />
      </div>
    </main>
  );
};
export default ProductDetail300ml;

const NutritionTagListItem = () => {
  return (
    <ul className="flex flex-warp gap-2 items-center">
      {NutritionTagList.map((item, key) => (
        <li key={key} className="flex items-center font-semibold gap-2 px-4 py-2 rounded-full bg-white shadow-md">
          <CheckCheck className="text-green-500" /> {item}
        </li>
      ))}
    </ul>
  );
};

const VitaminListItem = ({content, vitaminColor} : VitaminListItemProps) => {
  return (
    <ul className="flex flex-wrap gap-2 items-center text-gray-600 mt-2">
      {content.map((item, key) => (
        <li className={`flex items-center justify-center rounded-full text-white font-bold text-2xl uppercase size-16 ${vitaminColor}`} key={key}>{item}</li>
      ))}
    </ul>
  )
}
