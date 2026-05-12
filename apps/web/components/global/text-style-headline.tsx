interface TextStyleHeadlineProps {
  text: string;
  textSpan: string;
  textH1Color?: string;
}

const TextStyleHeadline = ({text, textSpan, textH1Color} : TextStyleHeadlineProps) => {
  return (
    <div>
      <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black italic uppercase leading-[0.85] tracking-tighter text-white mb-10" style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0 #000, 8px 8px 0 #FF005C, 12px 12px 0 #000' }}>
          {text}{" "}<span className="text-[#FFEA00]">{textSpan}</span>
        </h1>
    </div>
  );
};
export default TextStyleHeadline
