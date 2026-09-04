"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  criarCapitulo,
  criarLivro,
  editarLivro,
  excluirLivro,
  editarCapitulo,
  excluirCapitulo,
  uploadCapa,
  listarLivros,
  obterLivro,
  obterCapitulo,
  logout,
  verificarAdmin,
  type Livro,
  type Capitulo,
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

  const [livroEditando, setLivroEditando] = useState<string | null>(null);
  const [edicaoLivro, setEdicaoLivro] = useState({
    title: "",
    tagline: "",
    synopsis: "",
    gradient: "",
    progress: 0,
    featured: false,
  });
  const [mensagemEdicaoLivro, setMensagemEdicaoLivro] = useState("");
  const [enviandoCapa, setEnviandoCapa] = useState<string | null>(null);

  const [novoCapitulo, setNovoCapitulo] = useState({ livroSlug: "", slug: "", title: "", excerpt: "" });
  const [mensagemCapitulo, setMensagemCapitulo] = useState("");
  const [capitulosDoLivro, setCapitulosDoLivro] = useState<Capitulo[]>([]);

  const [capituloEditando, setCapituloEditando] = useState<string | null>(null);
  const [edicaoCapitulo, setEdicaoCapitulo] = useState({ title: "", excerpt: "", content: "" });
  const [mensagemEdicaoCapitulo, setMensagemEdicaoCapitulo] = useState("");

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

  useEffect(() => {
    if (!novoCapitulo.livroSlug) {
      setCapitulosDoLivro([]);
      return;
    }
    obterLivro(novoCapitulo.livroSlug)
      .then((livro) => setCapitulosDoLivro(livro.capitulos))
      .catch(() => setCapitulosDoLivro([]));
  }, [novoCapitulo.livroSlug]);

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

  function iniciarEdicaoLivro(livro: Livro) {
    setLivroEditando(livro.slug);
    setEdicaoLivro({
      title: livro.title,
      tagline: livro.tagline,
      synopsis: livro.synopsis,
      gradient: livro.gradient,
      progress: livro.progress,
      featured: livro.featured,
    });
    setMensagemEdicaoLivro("");
  }

  async function handleSalvarEdicaoLivro(slug: string) {
    setMensagemEdicaoLivro("");
    try {
      const atualizado = await editarLivro(slug, edicaoLivro);
      setLivros((prev) => prev.map((l) => (l.slug === slug ? atualizado : l)));
      setLivroEditando(null);
    } catch (err) {
      setMensagemEdicaoLivro(err instanceof Error ? err.message : "Erro ao editar livro");
    }
  }

  async function handleExcluirLivro(slug: string) {
    if (!confirm(`Excluir o livro "${slug}"? Isso apaga também seus capítulos, favoritos, progresso e comentários relacionados.`)) return;
    try {
      await excluirLivro(slug);
      setLivros((prev) => prev.filter((l) => l.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir livro");
    }
  }

  async function handleUploadCapa(slug: string, arquivo: File) {
    setEnviandoCapa(slug);
    try {
      const { capaUrl } = await uploadCapa(slug, arquivo);
      setLivros((prev) => prev.map((l) => (l.slug === slug ? { ...l, capaUrl } : l)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar capa");
    } finally {
      setEnviandoCapa(null);
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
      const capitulo = await criarCapitulo(livroSlug, dados);
      setCapitulosDoLivro((prev) => [...prev, capitulo]);
      setMensagemCapitulo(`Capítulo "${dados.title}" criado com sucesso.`);
      setNovoCapitulo({ livroSlug, slug: "", title: "", excerpt: "" });
    } catch (err) {
      setMensagemCapitulo(err instanceof Error ? err.message : "Erro ao criar capítulo");
    }
  }

  async function iniciarEdicaoCapitulo(capSlug: string) {
    const capitulo = await obterCapitulo(novoCapitulo.livroSlug, capSlug);
    setCapituloEditando(capSlug);
    setEdicaoCapitulo({ title: capitulo.title, excerpt: capitulo.excerpt, content: capitulo.content });
    setMensagemEdicaoCapitulo("");
  }

  async function handleSalvarEdicaoCapitulo(capSlug: string) {
    setMensagemEdicaoCapitulo("");
    try {
      await editarCapitulo(novoCapitulo.livroSlug, capSlug, edicaoCapitulo);
      setCapitulosDoLivro((prev) =>
        prev.map((c) => (c.slug === capSlug ? { ...c, title: edicaoCapitulo.title, excerpt: edicaoCapitulo.excerpt } : c))
      );
      setCapituloEditando(null);
    } catch (err) {
      setMensagemEdicaoCapitulo(err instanceof Error ? err.message : "Erro ao editar capítulo");
    }
  }

  async function handleExcluirCapitulo(capSlug: string) {
    if (!confirm(`Excluir o capítulo "${capSlug}"? Isso apaga também progresso e comentários relacionados.`)) return;
    try {
      await excluirCapitulo(novoCapitulo.livroSlug, capSlug);
      setCapitulosDoLivro((prev) => prev.filter((c) => c.slug !== capSlug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir capítulo");
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
          <h2 className="text-2xl font-bold mb-6 neon-text">Livros existentes</h2>
          {mensagemEdicaoLivro && <p className="text-sm text-red-400 mb-4">{mensagemEdicaoLivro}</p>}
          <div className="flex flex-col gap-4">
            {livros.map((livro) => (
              <div key={livro.slug} className="p-4 rounded-xl bg-black/30 border border-white/10">
                {livroEditando === livro.slug ? (
                  <div className="flex flex-col gap-3">
                    <input
                      className={inputClass}
                      placeholder="Título"
                      value={edicaoLivro.title}
                      onChange={(e) => setEdicaoLivro({ ...edicaoLivro, title: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Tagline"
                      value={edicaoLivro.tagline}
                      onChange={(e) => setEdicaoLivro({ ...edicaoLivro, tagline: e.target.value })}
                    />
                    <textarea
                      className={inputClass}
                      rows={3}
                      placeholder="Sinopse"
                      value={edicaoLivro.synopsis}
                      onChange={(e) => setEdicaoLivro({ ...edicaoLivro, synopsis: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Gradiente CSS"
                      value={edicaoLivro.gradient}
                      onChange={(e) => setEdicaoLivro({ ...edicaoLivro, gradient: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Progresso (%)"
                      value={edicaoLivro.progress}
                      onChange={(e) => setEdicaoLivro({ ...edicaoLivro, progress: Number(e.target.value) })}
                    />
                    <label className="flex items-center gap-2 text-gray-300 text-sm">
                      <input
                        type="checkbox"
                        checked={edicaoLivro.featured}
                        onChange={(e) => setEdicaoLivro({ ...edicaoLivro, featured: e.target.checked })}
                      />
                      Livro em destaque (hero da home)
                    </label>
                    <div className="flex gap-3">
                      <button onClick={() => handleSalvarEdicaoLivro(livro.slug)} className="vexon-btn">
                        Salvar
                      </button>
                      <button
                        onClick={() => setLivroEditando(null)}
                        className="text-sm text-gray-400 hover:text-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-medium">
                        {livro.title} <span className="text-gray-500 text-sm">({livro.slug})</span>
                      </p>
                      {livro.capaUrl && (
                        <p className="text-xs text-gray-500 mt-1 break-all">Capa: {livro.capaUrl}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="text-xs text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer">
                        {enviandoCapa === livro.slug ? "Enviando..." : "Enviar capa"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={enviandoCapa === livro.slug}
                          onChange={(e) => {
                            const arquivo = e.target.files?.[0];
                            if (arquivo) handleUploadCapa(livro.slug, arquivo);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        onClick={() => iniciarEdicaoLivro(livro)}
                        className="text-sm text-fuchsia-400 hover:text-fuchsia-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluirLivro(livro.slug)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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

          {novoCapitulo.livroSlug && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 neon-text">Capítulos deste livro</h3>
              {mensagemEdicaoCapitulo && <p className="text-sm text-red-400 mb-4">{mensagemEdicaoCapitulo}</p>}
              {capitulosDoLivro.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum capítulo ainda.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {capitulosDoLivro.map((cap) => (
                    <div key={cap.slug} className="p-4 rounded-xl bg-black/30 border border-white/10">
                      {capituloEditando === cap.slug ? (
                        <div className="flex flex-col gap-3">
                          <input
                            className={inputClass}
                            placeholder="Título"
                            value={edicaoCapitulo.title}
                            onChange={(e) => setEdicaoCapitulo({ ...edicaoCapitulo, title: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            placeholder="Trecho/resumo"
                            value={edicaoCapitulo.excerpt}
                            onChange={(e) => setEdicaoCapitulo({ ...edicaoCapitulo, excerpt: e.target.value })}
                          />
                          <textarea
                            className={inputClass}
                            rows={10}
                            placeholder="Texto completo do capítulo (parágrafos separados por linha em branco)"
                            value={edicaoCapitulo.content}
                            onChange={(e) => setEdicaoCapitulo({ ...edicaoCapitulo, content: e.target.value })}
                          />
                          <div className="flex gap-3">
                            <button onClick={() => handleSalvarEdicaoCapitulo(cap.slug)} className="vexon-btn">
                              Salvar
                            </button>
                            <button
                              onClick={() => setCapituloEditando(null)}
                              className="text-sm text-gray-400 hover:text-gray-200"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-white">
                            {cap.order}. {cap.title}
                          </span>
                          <div className="flex gap-3">
                            <button
                              onClick={() => iniciarEdicaoCapitulo(cap.slug)}
                              className="text-sm text-fuchsia-400 hover:text-fuchsia-300"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleExcluirCapitulo(cap.slug)}
                              className="text-sm text-red-400 hover:text-red-300"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
