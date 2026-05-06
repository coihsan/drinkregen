import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Regen Apple - Immune Support',
  description: 'Bebas Gula, Manis Alami, Stevia dan Tanpa bahan pengawet.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const ApplePage = () => {
    return (
        <div>
          <h1>Apple Page</h1>
        </div>
    )
}
export default ApplePage