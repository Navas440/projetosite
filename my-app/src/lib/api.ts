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
  const res = await fetch(`${API_URL}/admin/me`, { credentials: "include" });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
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

export async function listarLivros(): Promise<Livro[]> {
  const res = await fetch(`${API_URL}/livros`);
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function criarLivro(dados: NovoLivro): Promise<Livro> {
  const res = await fetch(`${API_URL}/admin/livros`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function criarCapitulo(slugLivro: string, dados: NovoCapitulo) {
  const res = await fetch(`${API_URL}/admin/livros/${slugLivro}/capitulos`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}
