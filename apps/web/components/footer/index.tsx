import Image from "next/image";
import QuickLink from "./quick-link";
import SocialLink from "./social-link";

const Footer = () => {
  return (
    <footer className="w-full relative bg-[#27C00C] relative overflow-hidden">
      <Image
        src={"/icons/logo-regen-white.svg"}
        alt="footer background"
        width={1440}
        height={810}
        className="object-fit block z-1 w-full md:object-cover object-center opacity-20 pointer-events-none"
      />
      <div className="flex flex-col md:flex-row items-center justify-between w-full px-6 py-12 mx-auto z-50">
        <div className="w-full md:max-w-sm items-center justify-center">
          <Image
            src={"/element/logo-pt-global-enak-nikmat.svg"}
            width={250}
            height={109}
            alt="regen logo"
            className="inset-0 z-10 pb-5 mx-auto md:mx-0"
          />
          <p className="text-center text-white md:text-start">
            Jl. K.S. Tubun No.81B, RT.9/RW.5, Slipi, Kec. Palmerah, Kota Jakarta
            Barat, Daerah Khusus Ibukota Jakarta 11410
          </p>
        </div>
        <div className="flex-col w-full md:max-w-sm pt-12 md:pt-0">
          <SocialLink className="w-full pb-4 mx-auto" />
          <QuickLink className="sm:text-center flex-wrap items-center justify-center flex gap-2 text-white" />
        </div>
      <Image
        src={"/element/pattern.svg"}
        alt="footer background"
        width={1440}
        height={810}
        className=" object-fit z-0 w-full md:object-cover object-center absolute top-0 opacity-20 pointer-events-none"
      />
      </div>
      <div className="flex items-center justify-center w-full text-white bg-green-600 py-6 flex-wrap gap-2 z-10">
        <p>2026 © Copyright Regen. All rights Reserved</p>
      </div>
    </footer>
  );
};
export default Footer;
