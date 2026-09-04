import type { Livro } from "@/lib/api";

export default function BookCover({
  book,
  className = "",
}: {
  book: Pick<Livro, "title" | "gradient" | "capaUrl">;
  className?: string;
}) {
  if (book.capaUrl) {
    return (
      <div
        className={`bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url('${book.capaUrl}')` }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-center p-4 ${className}`}
      style={{ background: book.gradient }}
    >
      <span className="text-white font-extrabold tracking-wide text-xl drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]">
        {book.title}
      </span>
    </div>
  );
}
