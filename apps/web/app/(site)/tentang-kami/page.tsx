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
        <div className="text-2xl w-full h-full flex items-center justify-center mx-auto">
            Tentang Kami
        </div>
    )
}
export default TentangKami