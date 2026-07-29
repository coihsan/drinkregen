import { type ReactNode } from "react";

interface BGDotProps {
  children: ReactNode;
  className?: string;
  dotColor?: string;
}

const BGDot = ({ children, className, dotColor }: BGDotProps) => {
  return (
    <div
      className={`${className} h-full w-full relative z-0  selection:text-white`}
      style={{
        backgroundImage:`radial-gradient(${dotColor || "#CBD5E1"} 2px, transparent 2px)`,
        backgroundSize: "24px 24px",
      }}
    >
      {children}
    </div>
  );
};
export default BGDot;
