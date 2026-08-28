const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ADMIN_TOKEN_KEY = "admin_token";
export const USER_TOKEN_KEY = "user_token";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

interface LoginResponse {
  token: string;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function cadastrar(dados: NovoUsuario): Promise<Usuario> {
  const res = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
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

export async function criarLivro(token: string, dados: NovoLivro): Promise<Livro> {
  const res = await fetch(`${API_URL}/admin/livros`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export async function criarCapitulo(
  token: string,
  slugLivro: string,
  dados: NovoCapitulo
) {
  const res = await fetch(`${API_URL}/admin/livros/${slugLivro}/capitulos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await parseErro(res));
  return res.json();
}

export function salvarToken(chave: string, token: string) {
  localStorage.setItem(chave, token);
}

export function obterToken(chave: string): string | null {
  return localStorage.getItem(chave);
}

export function limparToken(chave: string) {
  localStorage.removeItem(chave);
}
