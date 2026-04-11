"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import type { ComponentProps } from "react";

type ErrorCorrectionLevel = ComponentProps<typeof QRCodeSVG>["level"];

interface QRGeneratorProps {
  url: string;
  title: string;
}

const QRGenerator = ({ url, title }: QRGeneratorProps) => {
  const [value, setValue] = useState(url);

  return (
    <>
      <QRCodeSVG
        value={value}
        title={title}
        size={128}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        imageSettings={{
          src: "/regen.webp",
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          opacity: 1,
          excavate: true,
        }}
      />
    </>
  );
};

export default QRGenerator;
