import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Tentang Regen',
  description: 'Tempat belajar Next.js App Router terlengkap di Indonesia.',
  keywords: ['Regen Asli Nol Kalori', 'Bebas Gula', 'Manis Alami', 'dengan pemanis Stevia'],
  authors: [{ name: 'Regen' }],
  robots: {
    index: true,
    follow: true,
  },
}

const PromosiItemPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  return (
    <div>
        <div>My Promosi: {slug}</div>
    </div>
  )
}
export default PromosiItemPage