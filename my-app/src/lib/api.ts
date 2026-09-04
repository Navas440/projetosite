const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

interface LoginResponse {
  usuario: Usuario;
}

export interface Livro {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  gradient: string;
  progress: number;
  featured: boolean;
  capaUrl: string | null;
}

export interface Capitulo {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  order: number;
}

export interface CapituloDetalhe extends Capitulo {
  content: string;
  livro: { slug: string; title: string };
}

export interface LivroDetalhe extends Livro {
  capitulos: Capitulo[];
}

export interface Comentario {
  id: number;
  texto: string;
  createdAt: string;
  usuario: { id: number; nome: string };
}

export interface NovoLivro {
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  gradient: string;
  progress: number;
  featured: boolean;
}

export interface NovoCapitulo {
  slug: string;
  title: string;
  excerpt: string;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  senha: string;
}

async function parseErro(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.erro || `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}

let refreshEmAndamento: Promise<boolean> | null = null;

function tentarRefresh(): Promise<boolean> {
  if (!refreshEmAndamento) {
    refreshEmAndamento = fetch(`${API_URL}/refresh`, { method: "POST", credentials: "include" })
      .then((res) => res.ok)
      .finally(() => {
        refreshEmAndamento = null;
      });
  }
  return refreshEmAndamento;
}

let csrfTokenCache: Promise<string> | null = null;

function obterCsrfTokenCacheado(): Promise<string> {
  if (!csrfTokenCache) csrfTokenCache = obterCsrfToken();
  return csrfTokenCache;
}

function invalidarCsrfCache() {
  csrfTokenCache = null;
}

/**
 * Toda escrita autenticada passa por aqui: trata tanto access token expirado
 * (401) quanto CSRF obsoleto (403) no mesmo laço, porque um não implica o
 * outro isoladamente — o cookie do access token some sozinho quando expira,
 * o que faz a primeira falha depois de expirado chegar como 403 (CSRF), não
 * 401. Até 3 tentativas: CSRF obsoleto -> ainda sem access_token -> refresh -> sucesso.
 */
async function comCsrfERefresh(fazer: (csrfToken: string) => Promise<Response>): Promise<Response> {
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const csrfToken = await obterCsrfTokenCacheado();
    const res = await fazer(csrfToken);
    if (res.ok) return res;
    if (res.status === 401 && (await tentarRefresh())) {
      invalidarCsrfCache();
      continue;
    }
    if (res.status === 403) {
      invalidarCsrfCache();
      continue;
    }
    return res;
  }
  const csrfToken = await obterCsrfTokenCacheado();
  return fazer(csrfToken);
}

let meCache: Promise<Usuario> | null = null;

export function invalidarMeCache() {
  meCache = null;
}

export async function obterMe(): Promise<Usuario> {
  if (!meCache) {
    meCache = (async () => {
      let res = await fetch(`${API_URL}/me`, { credentials: "include" });
      if (res.status === 401 && (await tentarRefresh())) {
        res = await fetch(`${API_URL}/me`, { credentials: "include" });
      }
      if (!res.ok) throw new Error(await parseErro(res));
      return res.json();
    })();
    meCache.catch(() => {
      meCache = null;
    });
  }
  return meCache;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
}

export async function verificarAdmin(): Promise<Usuario> {
  let res = await fetch(`${API_URL}/admin/me`, { credentials: "include" });
  if (res.status === 401 && (await tentarRefresh())) {
    res = await fetch(`${API_URL}/admin/me`, { credentials: "include" });
  }
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function obterCsrfToken(): Promise<string> {
  const res = await fetch(`${API_URL}/csrf-token`, { credentials: "include" });
  if (!res.ok) throw new Error(await parseErro(res));
  const data = await res.json();
  return data.csrfToken;
}

export async function cadastrar(dados: NovoUsuario): Promise<Usuario> {
  const res = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

// ---------- Leitura pública ----------

export async function listarLivros(): Promise<Livro[]> {
  const res = await fetch(`${API_URL}/livros`);
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function obterLivro(slug: string): Promise<LivroDetalhe> {
  const res = await fetch(`${API_URL}/livros/${slug}`);
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function obterCapitulo(slug: string, capSlug: string): Promise<CapituloDetalhe> {
  const res = await fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}`);
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function listarComentarios(slug: string, capSlug: string): Promise<Comentario[]> {
  const res = await fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}/comentarios`);
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

// ---------- Leitor logado ----------

export async function estaFavoritado(slug: string): Promise<boolean> {
  let res = await fetch(`${API_URL}/livros/${slug}/favorito`, { credentials: "include" });
  if (res.status === 401 && (await tentarRefresh())) {
    res = await fetch(`${API_URL}/livros/${slug}/favorito`, { credentials: "include" });
  }
  if (!res.ok) throw new Error(await parseErro(res));
  const data = await res.json();
  return data.favoritado;
}

export async function favoritar(slug: string): Promise<void> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/livros/${slug}/favorito`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": csrfToken },
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
}

export async function desfavoritar(slug: string): Promise<void> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/livros/${slug}/favorito`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRF-Token": csrfToken },
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
}

export async function capituloLido(slug: string, capSlug: string): Promise<boolean> {
  let res = await fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}/progresso`, { credentials: "include" });
  if (res.status === 401 && (await tentarRefresh())) {
    res = await fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}/progresso`, { credentials: "include" });
  }
  if (!res.ok) throw new Error(await parseErro(res));
  const data = await res.json();
  return data.lido;
}

export async function marcarLido(slug: string, capSlug: string): Promise<void> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}/progresso`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": csrfToken },
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
}

export async function desmarcarLido(slug: string, capSlug: string): Promise<void> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}/progresso`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRF-Token": csrfToken },
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
}

export async function criarComentario(slug: string, capSlug: string, texto: string): Promise<Comentario> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/livros/${slug}/capitulos/${capSlug}/comentarios`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify({ texto }),
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function excluirComentario(id: number): Promise<void> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/comentarios/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRF-Token": csrfToken },
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
}

// ---------- Admin ----------

export async function criarLivro(dados: NovoLivro): Promise<Livro> {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/admin/livros`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify(dados),
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function criarCapitulo(slugLivro: string, dados: NovoCapitulo) {
  const res = await comCsrfERefresh((csrfToken) =>
    fetch(`${API_URL}/admin/livros/${slugLivro}/capitulos`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify(dados),
    })
  );
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}
