import BannerHeader from '@/components/global/banner-header'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang Regen',
  description: 'Tempat belajar Next.js App Router terlengkap di Indonesia.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const TentangKami = () => {
    return (
        <div className="text-2xl w-full h-full">
          <BannerHeader content={[{
            desktopImageUrl: "/img-3.png",
            tabletImageUrl: "/img-3.png",
            mobileImageUrl: "/img-3.png",
            alt: "Hero Slide 1",
            arialLabel: "Banner header tentang kami"
          }]} />
            <div className=''>
              Tentang Kami
            </div>
        </div>
    )
}
export default TentangKami