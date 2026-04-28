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

const BlogPage = () => {
    return (
        <div>Blog Page</div>
    )
}
export default BlogPage