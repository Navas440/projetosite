import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";

export function extrairCookie(cookies: string[], nome: string): string {
  const linha = cookies.find((c) => c.startsWith(`${nome}=`));
  if (!linha) throw new Error(`Cookie ${nome} não encontrado`);
  return linha.split(";")[0];
}

function mesclarCookies(atuais: string[], novoSetCookie: string[]): string[] {
  const mapa = new Map<string, string>();
  for (const c of [...atuais, ...novoSetCookie]) {
    const nome = c.split("=")[0];
    mapa.set(nome, c.split(";")[0]);
  }
  return [...mapa.values()];
}

export async function registrarELogar(prefixo: string, isAdmin = false) {
  const email = `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@teste.local`;
  const senha = "senhaTeste123";
  await request(app).post("/cadastro").send({ nome: "Teste", email, senha });
  const loginRes = await request(app).post("/login").send({ email, senha });
  const cookies = ((loginRes.headers["set-cookie"] as unknown as string[]) ?? []).map((c) => c.split(";")[0]);

  if (isAdmin) {
    await prisma.usuario.update({ where: { email }, data: { isAdmin: true } });
  }

  return { email, cookies };
}

export async function obterCsrf(cookies: string[]): Promise<{ cookies: string[]; csrfToken: string }> {
  const res = await request(app).get("/csrf-token").set("Cookie", cookies);
  const novasCookies = mesclarCookies(cookies, (res.headers["set-cookie"] as unknown as string[]) ?? []);
  return { cookies: novasCookies, csrfToken: res.body.csrfToken };
}
