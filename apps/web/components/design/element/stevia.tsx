import { Leaf } from "lucide-react";
import React from "react";

const SteviaElement = () => {
  return (
    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-brand-stevia/50 border-dashed flex items-center justify-center shrink-0 animate-[spin_20s_linear_infinite]">
      <div className="w-24 h-24 md:w-36 md:h-36 bg-brand-stevia/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
        <Leaf className="text-4xl md:text-6xl" />
      </div>
    </div>
  );
};
export default SteviaElement;
