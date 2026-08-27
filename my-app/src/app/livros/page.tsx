import { books } from "@/data/books";
import BookCard from "@/components/BookCard";

export default function Livros() {
  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <h1 className="text-5xl font-bold neon mb-10 text-center">Meus Livros</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
    </div>
  );
}
