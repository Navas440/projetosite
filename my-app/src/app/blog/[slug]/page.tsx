import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug } from "@/data/posts";
import { formatDate } from "@/lib/time";

const categoryColor: Record<string, string> = {
  Bastidores: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  "Capítulo Novo": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
  Divulgação: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  Lore: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostDetail(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
          ← Voltar para o Blog
        </Link>

        <div className="w-full h-56 rounded-2xl mt-6" style={{ background: post.gradient }} />

        <span className={`inline-block text-xs px-2 py-1 rounded-full border mt-6 ${categoryColor[post.category]}`}>
          {post.category}
        </span>
        <h1 className="text-4xl font-bold neon-text mt-3">{post.title}</h1>
        <p className="text-sm text-gray-500 mt-2">{formatDate(post.date)}</p>

        <div className="p-8 mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
        </div>
      </div>
    </div>
  );
}
