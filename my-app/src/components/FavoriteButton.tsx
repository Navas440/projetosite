"use client";

import { useEffect, useState } from "react";
import { obterMe, estaFavoritado, favoritar, desfavoritar, type Usuario } from "@/lib/api";

export default function FavoriteButton({ slug }: { slug: string }) {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);
  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    obterMe()
      .then((u) => {
        setUsuario(u);
        return estaFavoritado(slug);
      })
      .then(setFavoritado)
      .catch(() => setUsuario(null));
  }, [slug]);

  if (usuario === undefined) return null;

  if (usuario === null) {
    return (
      <a href="/login" className="text-sm text-fuchsia-400 hover:text-fuchsia-300 whitespace-nowrap">
        Entrar para favoritar
      </a>
    );
  }

  async function alternar() {
    setCarregando(true);
    const anterior = favoritado;
    setFavoritado(!anterior);
    try {
      if (anterior) {
        await desfavoritar(slug);
      } else {
        await favoritar(slug);
      }
    } catch {
      setFavoritado(anterior);
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
                 neon-text text-sm shadow-[0_0_20px_#ff00ff] disabled:opacity-50 whitespace-nowrap"
    >
      {favoritado ? "★ Favoritado" : "☆ Favoritar"}
    </button>
  );
}
