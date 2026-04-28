import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.slug
  const article = await fetch(`https://api.test.com/post/${id}`).then((res) => res.json())

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.thumbnailUrl],
      type: 'article',
      publishedTime: article.createdAt,
      authors: [article.authorName],
    },
  }
}