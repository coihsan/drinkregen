import BannerHeader from '@/components/global/banner-header'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Event Regen',
  description: 'Temukan berbagai event menarik seputar produk Regen, mulai dari peluncuran produk baru, promo spesial, hingga kolaborasi seru dengan berbagai komunitas. Jangan lewatkan kesempatan untuk bergabung dalam pengalaman seru bersama Regen!',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const EventPage = () => {
    return (
        <div className="text-2xl w-full h-full flex items-center justify-center mx-auto">
          <BannerHeader
          content={[{ 
            desktopImageUrl: "/banner-product.webp", 
            tabletImageUrl: "/banner-product-tablet.webp",
            mobileImageUrl: "/banner-product-mobile.webp",
            alt: "Banner product regen" }]}
        />
        </div>
    )
}
export default EventPage