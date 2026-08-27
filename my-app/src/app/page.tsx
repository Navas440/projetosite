import Link from "next/link";
import { books, getFeaturedBook } from "@/data/books";
import { posts } from "@/data/posts";
import { updates } from "@/data/updates";
import BookCard from "@/components/BookCard";
import PostsCarousel from "@/components/PostsCarousel";
import UpdatesFeed from "@/components/UpdatesFeed";
import BookCover from "@/components/BookCover";

export default function Home() {
  const featured = getFeaturedBook();

  return (
    <div className="relative">
      {/* HERO BANNER */}
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden fade">
        <BookCover book={featured} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-16 max-w-3xl">
          <span className="text-fuchsia-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Em lançamento
          </span>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-wide text-white glitch"
            data-text={featured.title.toUpperCase()}
          >
            {featured.title.toUpperCase()}
          </h1>
          <p className="text-xl text-gray-200 mt-4 max-w-xl">{featured.tagline}</p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link href={`/livros/${featured.slug}`} className="vexon-btn">
              Ler Sinopse
            </Link>
            <Link
              href={`/livros/${featured.slug}#capitulos`}
              className="vexon-btn"
              style={{ background: "transparent", border: "2px solid #ff00ff" }}
            >
              Ver Capítulos
            </Link>
          </div>
        </div>
      </section>

      {/* ÚLTIMOS POSTS */}
      <section className="mt-24 px-6 md:px-16 fade">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold neon">Últimos Posts</h2>
          <Link href="/blog" className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
            Ver todos →
          </Link>
        </div>
        <PostsCarousel posts={posts} />
      </section>

      {/* MEUS LIVROS */}
      <section className="mt-28 px-6 md:px-16 fade">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold neon">Meus Livros</h2>
          <Link href="/livros" className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      {/* ÚLTIMAS ATUALIZAÇÕES */}
      <section className="mt-28 mb-24 px-6 md:px-16 max-w-3xl mx-auto fade">
        <h2 className="text-3xl font-bold neon mb-6">Últimas Atualizações</h2>
        <UpdatesFeed updates={updates} />
      </section>
    </div>
  );
}
