import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Orange - High Vitamin C',
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const OrangePage = () => {
    return (
        <div>
            Orange Page
        </div>
    )
}
export default OrangePage