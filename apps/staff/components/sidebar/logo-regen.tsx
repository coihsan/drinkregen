"use client"

import { useSidebar } from "@workspace/ui/components/sidebar";
import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoRegenProps {
  width: number;
  height: number;
}

const LogoRegen = ({ width, height }: LogoRegenProps) => {
  const { open } = useSidebar();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div>
      {open ? (
        isDark ? (
          <Image
            src={"/regen-logo.webp"}
            width={width}
            height={height}
            alt="logo regen"
          />
        ) : (
          <Image
            src={"/regen-dark.webp"}
            width={width}
            height={height}
            alt="logo regen"
          />
        )
      ) : isDark ? (
        <Image src={"/regen-r.png"} width={32} height={32} alt="logo regen" />
      ) : (
        <Image
          className="grayscale"
          src={"/regen-r.png"}
          width={32}
          height={32}
          alt="logo regen"
        />
      )}
    </div>
  );
};
export default LogoRegen;
