import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch(
    'https://mendoza.edu.ar/wp-json/wp/v2/posts?categories=6&per_page=8&_embed'
  )
  const data = await res.json()
  const formatted = data.map((post: any) => ({
    id: post.id,
    title: post.title,
    link: post.link,
    date: post.date,
    featured_media_url:
      post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg',
  }))
  return NextResponse.json(formatted)
}
