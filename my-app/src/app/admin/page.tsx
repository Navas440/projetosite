"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  criarCapitulo,
  criarLivro,
  listarLivros,
  logout,
  verificarAdmin,
  type Livro,
} from "@/lib/api";

const inputClass =
  "px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white " +
  "placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400";

export default function AdminPainel() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);

  const [novoLivro, setNovoLivro] = useState({
    slug: "",
    title: "",
    tagline: "",
    synopsis: "",
    gradient: "linear-gradient(135deg, #7a00ff, #ff003c)",
    progress: 0,
    featured: false,
  });
  const [mensagemLivro, setMensagemLivro] = useState("");

  const [novoCapitulo, setNovoCapitulo] = useState({ livroSlug: "", slug: "", title: "", excerpt: "" });
  const [mensagemCapitulo, setMensagemCapitulo] = useState("");

  useEffect(() => {
    verificarAdmin()
      .then(() => setAutorizado(true))
      .catch(() => {
        setAutorizado(false);
        router.replace("/admin/login");
      });
  }, [router]);

  useEffect(() => {
    if (!autorizado) return;
    listarLivros()
      .then(setLivros)
      .catch(() => setLivros([]));
  }, [autorizado]);

  async function sair() {
    await logout();
    router.push("/admin/login");
  }

  async function handleCriarLivro(e: React.FormEvent) {
    e.preventDefault();
    setMensagemLivro("");
    try {
      const livro = await criarLivro(novoLivro);
      setLivros((prev) => [...prev, livro]);
      setMensagemLivro(`Livro "${livro.title}" criado com sucesso.`);
      setNovoLivro({
        slug: "",
        title: "",
        tagline: "",
        synopsis: "",
        gradient: "linear-gradient(135deg, #7a00ff, #ff003c)",
        progress: 0,
        featured: false,
      });
    } catch (err) {
      setMensagemLivro(err instanceof Error ? err.message : "Erro ao criar livro");
    }
  }

  async function handleCriarCapitulo(e: React.FormEvent) {
    e.preventDefault();
    setMensagemCapitulo("");
    try {
      const { livroSlug, ...dados } = novoCapitulo;
      if (!livroSlug) {
        setMensagemCapitulo("Escolha um livro.");
        return;
      }
      await criarCapitulo(livroSlug, dados);
      setMensagemCapitulo(`Capítulo "${dados.title}" criado com sucesso.`);
      setNovoCapitulo({ livroSlug, slug: "", title: "", excerpt: "" });
    } catch (err) {
      setMensagemCapitulo(err instanceof Error ? err.message : "Erro ao criar capítulo");
    }
  }

  if (!autorizado) return null;

  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="flex items-center justify-between max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-bold neon">Painel do Admin</h1>
        <button onClick={sair} className="text-sm text-fuchsia-400 hover:text-fuchsia-300">
          Sair
        </button>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <section className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 neon-text">Novo livro</h2>
          <form onSubmit={handleCriarLivro} className="flex flex-col gap-4">
            <input
              className={inputClass}
              placeholder="Slug (ex: vexon)"
              value={novoLivro.slug}
              onChange={(e) => setNovoLivro({ ...novoLivro, slug: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Título"
              value={novoLivro.title}
              onChange={(e) => setNovoLivro({ ...novoLivro, title: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Tagline"
              value={novoLivro.tagline}
              onChange={(e) => setNovoLivro({ ...novoLivro, tagline: e.target.value })}
            />
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Sinopse"
              value={novoLivro.synopsis}
              onChange={(e) => setNovoLivro({ ...novoLivro, synopsis: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Gradiente CSS (ex: linear-gradient(135deg, #7a00ff, #ff003c))"
              value={novoLivro.gradient}
              onChange={(e) => setNovoLivro({ ...novoLivro, gradient: e.target.value })}
            />
            <input
              className={inputClass}
              type="number"
              min={0}
              max={100}
              placeholder="Progresso (%)"
              value={novoLivro.progress}
              onChange={(e) => setNovoLivro({ ...novoLivro, progress: Number(e.target.value) })}
            />
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={novoLivro.featured}
                onChange={(e) => setNovoLivro({ ...novoLivro, featured: e.target.checked })}
              />
              Livro em destaque (hero da home)
            </label>

            {mensagemLivro && <p className="text-sm text-fuchsia-300">{mensagemLivro}</p>}

            <button type="submit" className="vexon-btn mt-2">
              Criar livro
            </button>
          </form>
        </section>

        <section className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 neon-text">Novo capítulo</h2>
          <form onSubmit={handleCriarCapitulo} className="flex flex-col gap-4">
            <select
              className={inputClass}
              value={novoCapitulo.livroSlug}
              onChange={(e) => setNovoCapitulo({ ...novoCapitulo, livroSlug: e.target.value })}
            >
              <option value="">Selecione um livro</option>
              {livros.map((livro) => (
                <option key={livro.slug} value={livro.slug}>
                  {livro.title}
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Slug do capítulo (ex: capitulo-4)"
              value={novoCapitulo.slug}
              onChange={(e) => setNovoCapitulo({ ...novoCapitulo, slug: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Título do capítulo"
              value={novoCapitulo.title}
              onChange={(e) => setNovoCapitulo({ ...novoCapitulo, title: e.target.value })}
            />
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Trecho/resumo do capítulo"
              value={novoCapitulo.excerpt}
              onChange={(e) => setNovoCapitulo({ ...novoCapitulo, excerpt: e.target.value })}
            />

            {mensagemCapitulo && <p className="text-sm text-fuchsia-300">{mensagemCapitulo}</p>}

            <button type="submit" className="vexon-btn mt-2">
              Criar capítulo
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
