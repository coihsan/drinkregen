import Image from "next/image";
import Link from "next/link";

const BeralihKeRegen = () => {
  return (
    <div className="container">
      <div className="relative h-[250px] lg:h-[500px] flex items-start md:items-center lg:items-center justify-center w-full bg-[#27C00C] rounded-xl relative overflow-hidden p-5">
        <div className="flex items-center flex-col gap-4">
          <h1 className="text-white text-4xl md:text-4xl lg:text-8xl font-black text-center italic z-10">
            Siap Beralih ke yang <br />{" "}
            <span className="text-yellow-300">#AsliNolKalori?</span>
          </h1>
          <Image
            className="object-cover object-center opacity-10 z-1"
            src={"/thunderbolt.svg"}
            fill
            alt="pattern"
          />
          <Link
            href={"/"}
            className="bg-[#FFD70C] hover:bg-[#F0C801] text-yellow-950 px-4 py-2 font-semibold rounded-full z-10 transition-color duration-300"
          >
            Beli di Shopee
          </Link>
        </div>
        <Image
          className="absolute left-1 lg:left-5 -bottom-9 lg:-bottom-10 rotate-15 h-50 lg:h-99 w-auto z-1"
          src={"/product/orange.webp"}
          width={300}
          height={200}
          alt="regen orange 300ml"
        />
        <Image
          className="absolute right-0 -bottom-5 -rotate-15 h-45 lg:h-99 w-auto z-1"
          src={"/product/lychee.webp"}
          width={300}
          height={200}
          alt="regen orange 300ml"
        />
        <Image
          className="absolute right-10 lg:right-20 -bottom-9 lg:-bottom-19 -rotate-15 h-45 lg:h-99 w-auto z-1"
          src={"/product/peach.webp"}
          width={300}
          height={200}
          alt="regen orange 300ml"
        />
      </div>
    </div>
  );
};
export default BeralihKeRegen;
