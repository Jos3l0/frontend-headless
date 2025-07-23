import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type WPPost = {
  id: number
  title: { rendered: string }
  link: string
  date: string
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string
    }[]
  }
}

type Post = {
  id: number
  title: { rendered: string }
  link: string
  date: string
  featured_media_url: string
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      'https://mendoza.edu.ar/wp-json/wp/v2/posts?categories=6&per_page=8&_embed',
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      console.error('Error al obtener posts:', res.statusText)
      return []
    }

    const data: WPPost[] = await res.json()

    return data.map((post) => ({
      id: post.id,
      title: post.title,
      link: post.link,
      date: post.date,
      featured_media_url:
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg',
    }))
  } catch (err) {
    console.error('Error fatal en getPosts:', err)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-md w-full sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image
            src="https://www.mendoza.edu.ar/wp-content/uploads/2022/02/logodge2024enc.png"
            alt="Logo DGE"
            width={160}
            height={48}
            priority
          />
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
        <div className="w-full h-[280px] md:h-[420px] bg-blue-900 relative">
          <Image
            src="/slider-feria.png"
            alt="Slider Feria de Ciencias"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      <section className="py-10 px-4 md:px-10 bg-blue-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Últimas noticias</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.length === 0 && (
            <p className="text-gray-600 col-span-full">No se pudieron cargar las noticias.</p>
          )}
          {posts.map((post) => (
            <Link key={post.id} href={post.link} target="_blank" rel="noopener noreferrer">
              <div className="bg-white shadow-lg rounded-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="h-40 w-full relative">
                  <Image
                    src={post.featured_media_url}
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
                  <p className="text-gray-500 text-xs">
                    {new Date(post.date).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}