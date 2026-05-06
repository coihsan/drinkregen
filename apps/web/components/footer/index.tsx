import Image from "next/image";
import QuickLink from "./quick-link";
import SocialLink from "./social-link";

const Footer = () => {
  return (
    <footer className="w-full bg-lime-500 relative overflow-hidden">
      <div className="flex-col md:flex items-start justify-between w-full px-6 py-12 mx-auto z-10">
        <div>
          <Image
            src={"/regen.webp"}
            width={150}
            height={109}
            alt="regen logo"
            className="z-10"
          />
          <p>PT Global Enak Nikmat</p>
          <SocialLink className="w-full" />
        </div>
        <QuickLink className="sm:flex-col sm:text-center flex-wrap flex items-center gap-4" />
      </div>
      <Image
        src={"/icons/logo-regen-white.svg"}
        alt="footer background"
        width={1440}
        height={810}
        className="object-fit z-1 w-full md:object-cover object-center absolute top-0 opacity-20 pointer-events-none"
      />
      <div className="flex items-center justify-center w-full text-white bg-green-600 py-6 flex-wrap gap-2">
        <p>PT Global Enak Nikmat</p>
        <p>2026 © Copyright Regen. All rights Reserved</p>
      </div>
    </footer>
  );
};
export default Footer;
