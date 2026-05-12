interface EllipseElementProps {
    className?: string
}

const EllipseElement = ({className} : EllipseElementProps) => {
    return (
        <div className={className}>
            <div className="absolute top-40 right-20 w-16 h-16 bg-[#00E53B] border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-12 -z-10 rounded-full" />
        </div>
    )
}
export default EllipseElement