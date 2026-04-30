import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Watermelon - Hydration Hero',
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
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