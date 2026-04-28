import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Orang - High Vitamin C',
  description: 'Tempat belajar Next.js App Router terlengkap di Indonesia.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const WatermelonPage = () => {
    return (
        <div>
            Watermelon Page
        </div>
    )
}
export default WatermelonPage