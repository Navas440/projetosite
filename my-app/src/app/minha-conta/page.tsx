"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  obterMe,
  editarBio,
  listarFavoritos,
  obterProgresso,
  type Usuario,
  type Livro,
  type ProgressoLivro,
} from "@/lib/api";
import BookCard from "@/components/BookCard";

export default function MinhaConta() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [bio, setBio] = useState("");
  const [mensagemBio, setMensagemBio] = useState("");
  const [salvandoBio, setSalvandoBio] = useState(false);

  const [favoritos, setFavoritos] = useState<Livro[]>([]);
  const [progresso, setProgresso] = useState<ProgressoLivro[]>([]);

  useEffect(() => {
    obterMe()
      .then((u) => {
        setUsuario(u);
        setBio(u.bio ?? "");
        setAutorizado(true);
      })
      .catch(() => {
        setAutorizado(false);
        router.replace("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!autorizado) return;
    listarFavoritos().then(setFavoritos).catch(() => setFavoritos([]));
    obterProgresso().then(setProgresso).catch(() => setProgresso([]));
  }, [autorizado]);

  async function handleSalvarBio(e: React.FormEvent) {
    e.preventDefault();
    setMensagemBio("");
    setSalvandoBio(true);
    try {
      const atualizado = await editarBio(bio);
      setUsuario(atualizado);
      setMensagemBio("Bio atualizada.");
    } catch (err) {
      setMensagemBio(err instanceof Error ? err.message : "Erro ao salvar bio");
    } finally {
      setSalvandoBio(false);
    }
  }

  if (!autorizado || !usuario) return null;

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold neon">Minha conta</h1>
          <p className="text-gray-400 mt-2">
            {usuario.nome} — {usuario.email}
          </p>
        </div>

        <section className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 neon-text">Bio</h2>
          <form onSubmit={handleSalvarBio} className="flex flex-col gap-4">
            <textarea
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
              rows={4}
              maxLength={500}
              placeholder="Fale um pouco sobre você"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            {mensagemBio && <p className="text-sm text-fuchsia-300">{mensagemBio}</p>}
            <button type="submit" disabled={salvandoBio} className="vexon-btn self-start disabled:opacity-50">
              {salvandoBio ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 neon-text">Favoritos</h2>
          {favoritos.length === 0 ? (
            <p className="text-gray-400">Você ainda não favoritou nenhum livro.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {favoritos.map((livro) => (
                <BookCard key={livro.slug} book={livro} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 neon-text">Progresso de leitura</h2>
          {progresso.length === 0 ? (
            <p className="text-gray-400">Nenhum capítulo lido ainda.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {progresso.map((p) => (
                <div key={p.livro.slug} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{p.livro.title}</span>
                    <span className="text-sm text-gray-400">
                      {p.capitulosLidos}/{p.totalCapitulos} capítulos
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.totalCapitulos > 0 ? (p.capitulosLidos / p.totalCapitulos) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #7a00ff, #ff003c)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
