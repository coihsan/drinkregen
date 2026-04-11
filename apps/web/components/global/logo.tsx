import Image from "next/image";

interface LogoRegenProps {
    width: number;
    height: number;
}

const LogoRegen = ({width, height} : LogoRegenProps) => {
    return <Image src={'/regen.webp'} width={width} height={height} alt="logo regen" />
}
export default LogoRegen