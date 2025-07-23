'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Post = {
  id: number
  title: { rendered: string }
  link: string
  featured_media: number
  date: string
}

type MenuItem = {
  id: number
  title: string
  url: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [images, setImages] = useState<string[]>([
    '/slider1.jpg',
    '/slider2.jpg',
    '/slider3.jpg',
    '/slider4.jpg',
  ])
  const [featuredImages, setFeaturedImages] = useState<{ [id: number]: string }>({})

  useEffect(() => {
    fetch(
      'https://mendoza.edu.ar/wp-json/wp/v2/posts?categories=6&per_page=8&_embed'
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        const imgMap: { [id: number]: string } = {}
        data.forEach((post: any) => {
          const img =
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'
          imgMap[post.id] = img
        })
        setFeaturedImages(imgMap)
      })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-md w-full sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-800">DGE</div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-700 hover:text-blue-700 font-semibold">Institucional</a>
            <a href="#" className="text-gray-700 hover:text-blue-700 font-semibold">Recursos</a>
            <a href="#" className="text-gray-700 hover:text-blue-700 font-semibold">Servicios</a>
            <a href="#" className="text-gray-700 hover:text-blue-700 font-semibold">Novedades</a>
            <a href="#" className="text-gray-700 hover:text-blue-700 font-semibold">Aulas Virtuales</a>
          </nav>
        </div>
      </header>

      <section className="relative w-full overflow-hidden">
        <div className="w-full h-[320px] md:h-[460px] bg-blue-900 flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative animate-fade"
              style={{ animationDelay: `${index * 4}s` }}
            >
              <Image
                src={src}
                alt={`Slider ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-4 md:px-10 bg-blue-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Últimas noticias</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <Link key={post.id} href={post.link} target="_blank" rel="noopener noreferrer">
              <div className="bg-white shadow-lg rounded-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="h-40 w-full relative">
                  <Image
                    src={featuredImages[post.id] || '/placeholder.jpg'}
                    alt={post.title.rendered}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="text-gray-800 font-semibold text-sm md:text-base mb-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <p className="text-gray-500 text-xs">{new Date(post.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
