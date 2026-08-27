import Link from "next/link";
import type { Book } from "@/data/books";
import BookCover from "./BookCover";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/livros/${book.slug}`}
      className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/5
                 transition-all duration-300 hover:-translate-y-1
                 hover:shadow-[0_0_30px_rgba(255,0,255,0.35)]"
    >
      <BookCover
        book={book}
        className="w-full aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold neon-text">{book.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{book.tagline}</p>

        <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${book.progress}%`,
              background: "linear-gradient(90deg, #7a00ff, #ff003c)",
            }}
          />
        </div>
        <span className="text-xs text-gray-500 mt-1 block">{book.progress}% concluído</span>
      </div>
    </Link>
  );
}
