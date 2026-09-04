"use client";

import { useEffect, useState } from "react";
import {
  obterMe,
  listarComentarios,
  criarComentario,
  excluirComentario,
  type Usuario,
  type Comentario,
} from "@/lib/api";

export default function CommentSection({
  livroSlug,
  capituloSlug,
}: {
  livroSlug: string;
  capituloSlug: string;
}) {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarComentarios(livroSlug, capituloSlug)
      .then(setComentarios)
      .catch(() => setComentarios([]));
    obterMe()
      .then(setUsuario)
      .catch(() => setUsuario(null));
  }, [livroSlug, capituloSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    setErro("");
    setEnviando(true);
    try {
      const comentario = await criarComentario(livroSlug, capituloSlug, texto);
      setComentarios((prev) => [...prev, comentario]);
      setTexto("");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao comentar");
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(id: number) {
    try {
      await excluirComentario(id);
      setComentarios((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // silencioso — o item continua na lista se falhar
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold neon mb-4">Comentários</h2>

      {comentarios.length === 0 ? (
        <p className="text-gray-400 mb-6">Nenhum comentário ainda.</p>
      ) : (
        <ul className="flex flex-col gap-4 mb-6">
          {comentarios.map((c) => (
            <li key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-fuchsia-400 font-semibold text-sm">{c.usuario.nome}</span>
                {usuario && (usuario.id === c.usuario.id || usuario.isAdmin) && (
                  <button
                    onClick={() => handleExcluir(c.id)}
                    className="text-xs text-gray-500 hover:text-red-400"
                  >
                    Apagar
                  </button>
                )}
              </div>
              <p className="text-gray-300 mt-2">{c.texto}</p>
            </li>
          ))}
        </ul>
      )}

      {usuario ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            maxLength={2000}
            className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                       placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
          />
          {erro && <p className="text-red-400 text-sm">{erro}</p>}
          <button type="submit" disabled={enviando || !texto.trim()} className="vexon-btn self-start disabled:opacity-50">
            {enviando ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        usuario === null && (
          <a href="/login" className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
            Entrar para comentar
          </a>
        )
      )}
    </div>
  );
}
