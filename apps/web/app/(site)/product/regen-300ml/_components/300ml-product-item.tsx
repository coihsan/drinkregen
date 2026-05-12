"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import * as motion from "motion/react-client";
import { useScroll, type Variants } from "motion/react";
import LogoRegen from "@/components/global/logo";
import Link from "next/link";

interface ProductItem300mlProps {
  sourceImage: string;
  productName: string;
  productUSP: string;
  titleColor?: string;
  bgColor: string;
  description?: string;
  urlProduct: string
}

const ProductItem300ml = ({
  sourceImage,
  productName,
  productUSP,
  description,
  titleColor,
  bgColor,
  urlProduct,
}: ProductItem300mlProps) => {
  return (
    <motion.div className="flex flex-col md:flex-row items-start md:justify-between gap-6 w-full min-h-[500px] relative">
      <motion.div className="max-w-2xl">
        <h2 className="text-4xl md:text-4xl lg:text-6xl font-bold uppercase leading-none inline-block items-center">
          <LogoRegen
            className={`${titleColor} inline-block h-[0.85em] w-auto fill-green-500 inline-middle`}
            width={120}
            height={30}
          />{" "}
          <span className={`${titleColor} font-bold leading-none italic`}>{productName}</span>
        </h2>
        <h3 className="font-semibold block uppercase text-4xl md:text-4xl lg:text-6xl">{productUSP}</h3>
        <div className="flex items-center pt-4">
          <p className="text-gray-500 leading-6">{description}</p>
        </div>
        <div className="pt-4">
          <Link className={`${bgColor} w-fit px-6 py-3 font-semibold text-white rounded-full`} href={urlProduct} aria-label={productName}>Lihat</Link>
        </div>
      </motion.div>
      <motion.div
        className={`flex items-center justify-center`}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.8 }}
      >
        <Image
          className="object fit w-auto rounded-xl"
          src={sourceImage}
          width={600}
          height={500}
          alt="Regen 300ml"
        />
      </motion.div>
    </motion.div>
  );
};
export default ProductItem300ml;
