import { NextResponse } from 'next/server'

type WPPost = {
  id: number
  title: { rendered: string }
  link: string
  date: string
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch(
      'https://mendoza.edu.ar/wp-json/wp/v2/posts?categories=6&per_page=8&_embed',
      { cache: 'no-store' }
    )

    if (!res.ok) {
      console.error('Error HTTP WordPress:', res.statusText)
      return NextResponse.json([])
    }

    const data: WPPost[] = await res.json()

    const formatted = data.map((post) => ({
      id: post.id,
      title: post.title,
      link: post.link,
      date: post.date,
      featured_media_url:
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg',
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('Error en API proxy /posts:', err)
    return NextResponse.json([])
  }
}
