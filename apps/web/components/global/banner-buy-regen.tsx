import Image from "next/image";
import Link from "next/link";

const BannerBuyRegenContent = () => {
  return (
    <section className="container">
      <div className="bg-green-500 rounded-lg p-6 flex flex-col items-start gap-4">
        <div className=" lg:max-w-lg">
          <h2 className="font-bold text-white leading-tight text-3xl md:text-5xl">
            Dapatkan{" "}
            <Image
              src="/icons/logo-regen-white.svg"
              className="inline-block h-[0.9em] w-auto align-middle"
              alt="Banner Buy Regen"
              width={100}
              height={40}
            />{" "}
            di toko online favoritmu
          </h2>
        </div>
        <div className="pt-6 group">
          <Link
            className="group-hover:bg-white rounded-lg flex items-center gap-2 transition-color duration-300 px-6 py-4"
            href={"/"}
          >
            <Image
              src="/icons/shopee.svg"
              alt="Banner Buy Regen"
              width={30}
              height={40}
            />
            <span className="text-white group-hover:text-black transition-color duration-300 text-2xl font-medium">
              Shopee
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default BannerBuyRegenContent;
