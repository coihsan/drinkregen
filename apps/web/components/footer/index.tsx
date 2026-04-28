import Image from "next/image"
import QuickLink from "./quick-link"
import SocialLink from "./social-link"

const Footer = () => {
    return (
        <footer className="w-full bg-lime-500 px-6 pt-12">
            <div className="flex items-start justify-between w-full">
                <div>
                    <Image src={'/regen.webp'} width={150} height={109} alt="regen logo" />
                    <p>PT Global Enak Nikmat</p>
                    <SocialLink className="w-full" />
                </div>
                <QuickLink />
                <QuickLink />
            </div>
            <div className="flex items-center justify-center w-full h-8 text-white bg-green-600 rounded-full">
                <p>Regen - 2026</p>
            </div>
        </footer>
    )
}
export default Footer