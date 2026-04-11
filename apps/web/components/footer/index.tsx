import Image from "next/image"
import QuickLink from "./quick-link"

const Footer = () => {
    return (
        <div className="w-full bg-lime-500 p-6">
            <Image src={'/regen.webp'} width={150} height={109} alt="regen logo" />
            <QuickLink />
        </div>
    )
}
export default Footer