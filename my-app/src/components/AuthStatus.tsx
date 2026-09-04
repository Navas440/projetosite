"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obterMe, logout, type Usuario } from "@/lib/api";

export default function AuthStatus() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null | undefined>(undefined);

  useEffect(() => {
    obterMe()
      .then(setUsuario)
      .catch(() => setUsuario(null));
  }, []);

  if (usuario === undefined) return null;

  if (usuario === null) {
    return (
      <>
        <a
          href="/login"
          className="px-4 py-2 rounded-lg border border-fuchsia-500/60 bg-black/40 backdrop-blur-sm
                     hover:bg-fuchsia-600 hover:border-fuchsia-300 transition-all duration-300
                     neon-text text-sm shadow-[0_0_20px_#ff00ff]"
        >
          Login
        </a>

        <a
          href="/cadastro"
          className="hidden sm:inline-block px-4 py-2 rounded-lg border border-fuchsia-500/60 bg-black/40
                     backdrop-blur-sm hover:bg-fuchsia-600 hover:border-fuchsia-300 transition-all
                     duration-300 neon-text text-sm shadow-[0_0_20px_#ff00ff]"
        >
          Cadastro
        </a>
      </>
    );
  }

  async function sair() {
    await logout();
    setUsuario(null);
    router.push("/");
  }

  return (
    <>
      <a href="/minha-conta" className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
        Minha conta
      </a>
      <button onClick={sair} className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
        Sair
      </button>
    </>
  );
}
