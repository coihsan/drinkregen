import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Lychee - Inner Power',
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const LycheePage = () => {
    return (
        <div>
            Lychee Page
        </div>
    )
}
export default LycheePage