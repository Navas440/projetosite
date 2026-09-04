import Link from "next/link";
import { notFound } from "next/navigation";
import { listarLivros, obterLivro, obterCapitulo } from "@/lib/api";
import ChapterProgressToggle from "@/components/ChapterProgressToggle";
import CommentSection from "@/components/CommentSection";

export const revalidate = 60;

export async function generateStaticParams() {
  const livros = await listarLivros();
  const grupos = await Promise.all(
    livros.map(async (l) => {
      const detalhe = await obterLivro(l.slug);
      return detalhe.capitulos.map((c) => ({ slug: l.slug, chapter: c.slug }));
    })
  );
  return grupos.flat();
}

export default async function ChapterPage(props: PageProps<"/livros/[slug]/[chapter]">) {
  const { slug, chapter: chapterSlug } = await props.params;
  let capitulo;
  try {
    capitulo = await obterCapitulo(slug, chapterSlug);
  } catch {
    notFound();
  }

  const paragrafos = capitulo.content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="max-w-3xl mx-auto">
        <Link href={`/livros/${slug}#capitulos`} className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
          ← Voltar para {capitulo.livro.title}
        </Link>

        <span className="block text-fuchsia-400 text-sm font-semibold tracking-widest uppercase mt-6">
          Capítulo {capitulo.order}
        </span>
        <h1 className="text-4xl font-bold neon-text mt-2">{capitulo.title}</h1>

        <div className="p-8 mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-gray-300 leading-relaxed text-lg">{capitulo.excerpt}</p>
          {paragrafos.length > 0 ? (
            paragrafos.map((p, i) => (
              <p key={i} className="text-gray-300 leading-relaxed mt-6">
                {p}
              </p>
            ))
          ) : (
            <p className="text-gray-500 mt-6 italic">O restante deste capítulo ainda está sendo escrito.</p>
          )}
        </div>

        <div className="mt-8">
          <ChapterProgressToggle livroSlug={slug} capituloSlug={chapterSlug} />
        </div>

        <CommentSection livroSlug={slug} capituloSlug={chapterSlug} />
      </div>
    </div>
  );
}
