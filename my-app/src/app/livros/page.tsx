import { listarLivros } from "@/lib/api";
import BookCard from "@/components/BookCard";

export const revalidate = 60;

export default async function Livros() {
  const livros = await listarLivros();
  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <h1 className="text-5xl font-bold neon mb-10 text-center">Meus Livros</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {livros.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
    </div>
  );
}
