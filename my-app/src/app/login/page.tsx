"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, salvarToken, USER_TOKEN_KEY } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const { token } = await login(email, senha);
      salvarToken(USER_TOKEN_KEY, token);
      router.push("/");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 fade">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                      shadow-[0_0_25px_rgba(255,0,255,0.12)]">
        <h1 className="text-3xl font-bold text-center mb-2 neon-text">Login</h1>
        <p className="text-gray-300 text-center mb-8">
          Entre no <strong className="vexon-subtitle-vexon">Universo Vexon</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}

          <button type="submit" disabled={carregando} className="vexon-btn mt-4 disabled:opacity-50">
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Não tem uma conta?{" "}
          <a href="/cadastro" className="text-fuchsia-400 hover:text-fuchsia-300">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
