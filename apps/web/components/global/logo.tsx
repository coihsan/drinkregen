import Image from "next/image";
import Link from "next/link";

interface LogoRegenProps {
  width: number;
  height: number;
  isLink?: boolean;
}

const LogoRegen = ({ width, height, isLink }: LogoRegenProps) => {
  return (
    <>
      {isLink ? (
        <Link href={"/"}>
          <Image
            src={"/regen.webp"}
            width={width}
            height={height}
            alt="logo regen"
          />
        </Link>
      ) : (
        <Image
          src={"/regen.webp"}
          width={width}
          height={height}
          alt="logo regen"
        />
      )}
    </>
  );
};
export default LogoRegen;
