import Link from "next/link";
import { notFound } from "next/navigation";
import { books, getBookBySlug } from "@/data/books";
import BookCover from "@/components/BookCover";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default async function BookDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="max-w-4xl mx-auto">
        <BookCover book={book} className="w-full h-72 md:h-96 rounded-2xl" />

        <h1 className="text-4xl md:text-5xl font-bold neon-text mt-8">{book.title}</h1>
        <p className="text-gray-400 mt-2">{book.tagline}</p>

        <div className="mt-6 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${book.progress}%`,
              background: "linear-gradient(90deg, #7a00ff, #ff003c)",
            }}
          />
        </div>
        <span className="text-sm text-gray-500 mt-1 block">{book.progress}% concluído</span>

        <div className="p-6 mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-3 neon">Sinopse</h2>
          <p className="text-gray-300 leading-relaxed">{book.synopsis}</p>
        </div>

        <div id="capitulos" className="mt-10 scroll-mt-28">
          <h2 className="text-2xl font-bold neon mb-4">Capítulos</h2>

          {book.chapters.length === 0 ? (
            <p className="text-gray-400">Nenhum capítulo publicado ainda.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {book.chapters.map((chapter, index) => (
                <li key={chapter.slug}>
                  <Link
                    href={`/livros/${book.slug}/${chapter.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10
                               hover:border-fuchsia-400/60 hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-fuchsia-400 font-bold">{index + 1}</span>
                    <span className="text-white font-medium">{chapter.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
