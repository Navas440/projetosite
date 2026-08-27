import Link from "next/link";
import { posts } from "@/data/posts";
import { formatDate } from "@/lib/time";

const categoryColor: Record<string, string> = {
  Bastidores: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  "Capítulo Novo": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
  Divulgação: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  Lore: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
};

export default function Blog() {
  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <h1 className="text-5xl font-bold neon mb-10 text-center">Blog</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5
                       transition-all duration-300 hover:-translate-y-1
                       hover:shadow-[0_0_25px_rgba(255,0,255,0.3)]"
          >
            <div
              className="w-full h-40 transition-transform duration-300 group-hover:scale-105"
              style={{ background: post.gradient }}
            />
            <div className="p-5">
              <span className={`inline-block text-xs px-2 py-1 rounded-full border ${categoryColor[post.category]}`}>
                {post.category}
              </span>
              <h3 className="mt-3 font-bold text-white text-lg leading-snug">{post.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{post.excerpt}</p>
              <p className="text-xs text-gray-500 mt-3">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
