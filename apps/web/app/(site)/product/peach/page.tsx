import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Peach - Active Glow',
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const PeachPage = () => {
    return (
        <div>
            Peach Page
        </div>
    )
}
export default PeachPage