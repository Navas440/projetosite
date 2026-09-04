"use client";

import { useEffect, useState } from "react";
import { obterMe, capituloLido, marcarLido, desmarcarLido, type Usuario } from "@/lib/api";

export default function ChapterProgressToggle({
  livroSlug,
  capituloSlug,
}: {
  livroSlug: string;
  capituloSlug: string;
}) {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);
  const [lido, setLido] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    obterMe()
      .then((u) => {
        setUsuario(u);
        return capituloLido(livroSlug, capituloSlug);
      })
      .then(setLido)
      .catch(() => setUsuario(null));
  }, [livroSlug, capituloSlug]);

  if (usuario === undefined) return null;

  if (usuario === null) {
    return (
      <a href="/login" className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
        Entrar para acompanhar seu progresso de leitura
      </a>
    );
  }

  async function alternar() {
    setCarregando(true);
    const anterior = lido;
    setLido(!anterior);
    try {
      if (anterior) {
        await desmarcarLido(livroSlug, capituloSlug);
      } else {
        await marcarLido(livroSlug, capituloSlug);
      }
    } catch {
      setLido(anterior);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <button
      onClick={alternar}
      disabled={carregando}
      className="px-4 py-2 rounded-lg border border-fuchsia-500/60 bg-black/40 backdrop-blur-sm
                 hover:bg-fuchsia-600 hover:border-fuchsia-300 transition-all duration-300
                 neon-text text-sm shadow-[0_0_20px_#ff00ff] disabled:opacity-50"
    >
      {lido ? "✓ Capítulo lido" : "Marcar como lido"}
    </button>
  );
}
