import BannerHeader from "@/components/global/banner-header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Lemon Lime - Mood Booster',
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const LemonLimePage = () => {
    return (
        <div>
            <BannerHeader content={[{
            desktopImageUrl: "/img-3.png",
            tabletImageUrl: "/img-3.png",
            mobileImageUrl: "/img-3.png",
            alt: "Hero Slide 1",
            arialLabel: "Banner header tentang kami"
            }]} />
        </div>
    )
}
export default LemonLimePage