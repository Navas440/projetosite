import Link from "next/link";
import { notFound } from "next/navigation";
import { books, getBookBySlug } from "@/data/books";

export function generateStaticParams() {
  return books.flatMap((book) =>
    book.chapters.map((chapter) => ({ slug: book.slug, chapter: chapter.slug }))
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter: chapterSlug } = await params;
  const book = getBookBySlug(slug);
  const chapter = book?.chapters.find((c) => c.slug === chapterSlug);
  if (!book || !chapter) notFound();

  const index = book.chapters.findIndex((c) => c.slug === chapterSlug);

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="max-w-3xl mx-auto">
        <Link href={`/livros/${book.slug}#capitulos`} className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
          ← Voltar para {book.title}
        </Link>

        <span className="block text-fuchsia-400 text-sm font-semibold tracking-widest uppercase mt-6">
          Capítulo {index + 1}
        </span>
        <h1 className="text-4xl font-bold neon-text mt-2">{chapter.title}</h1>

        <div className="p-8 mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-gray-300 leading-relaxed text-lg">{chapter.excerpt}</p>
          <p className="text-gray-500 mt-6 italic">O restante deste capítulo ainda está sendo escrito.</p>
        </div>
      </div>
    </div>
  );
}
