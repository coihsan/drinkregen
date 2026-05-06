import Image from "next/image";
import Link from "next/link";

const BannerBuyRegenContent = () => {
  return (
    <section className="px-4 pt-12 h-[400px]">
      <div className="bg-green-500 rounded-lg p-6 flex flex-col items-start gap-4">
        <div className="flex justify-start lg:max-w-lg">
          <h2 className="font-bold text-white leading-tight text-3xl md:text-5xl">
            Dapatkan{" "}
            <Image
              src="/icons/logo-regen-white.svg"
              className="inline-block h-[1em] w-auto align-middle"
              alt="Banner Buy Regen"
              width={100}
              height={40}
            />{" "}
            di toko online favoritmu
          </h2>
        </div>
        <div className="pt-6">
          <Link className="flex items-center gap-2" href={"/"}>
            <span className="bg-white p-2 rounded-xl aspect-square size-22 flex items-center justify-center">
              <Image
                src="/icons/shopee.svg"
                alt="Banner Buy Regen"
                width={50}
                height={40}
              />
            </span>
            <span className="text-white text-2xl font-medium">Shopee</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default BannerBuyRegenContent;
