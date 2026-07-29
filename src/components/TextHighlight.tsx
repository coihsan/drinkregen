interface TextHighLightProps {
    hightLightDefault?: boolean;
    text: string;
}

const TextHighLight = ({ text, hightLightDefault }: TextHighLightProps) => {
    return (
        hightLightDefault ? (

        <div className="inline-block bg-[#00E53B] px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-2 mb-8">
          <h2 className="font-black italic text-xl uppercase tracking-widest text-black">
            {text}
          </h2>
        </div>
        ) : (
        <div className="bg-black p-4 inline-block -rotate-1 shadow-[8px_8px_0_0_#00E53B]">
          <p className="text-xl md:text-3xl font-bold text-white tracking-wide">
            {text}
          </p>
        </div>
        )
    )
}
export default TextHighLight