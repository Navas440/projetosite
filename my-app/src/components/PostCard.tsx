import Link from "next/link";
import type { Post } from "@/data/posts";
import { formatDate } from "@/lib/time";

const categoryColor: Record<string, string> = {
  Bastidores: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  "Capítulo Novo": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
  Divulgação: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  Lore: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group shrink-0 w-72 snap-start rounded-2xl overflow-hidden border border-white/10
                 bg-white/5 transition-all duration-300 hover:-translate-y-1
                 hover:shadow-[0_0_25px_rgba(255,0,255,0.3)]"
    >
      <div
        className="w-full h-36 transition-transform duration-300 group-hover:scale-105"
        style={{ background: post.gradient }}
      />
      <div className="p-4">
        <span
          className={`inline-block text-xs px-2 py-1 rounded-full border ${categoryColor[post.category]}`}
        >
          {post.category}
        </span>
        <h3 className="mt-3 font-bold text-white leading-snug">{post.title}</h3>
        <p className="text-xs text-gray-500 mt-2">{formatDate(post.date)}</p>
      </div>
    </Link>
  );
}
