import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { registrarELogar, obterCsrf } from "./helpers";

describe("autorização de comentários", () => {
  const emails: string[] = [];
  const slugLivro = `livro-teste-coment-${Date.now()}`;
  const slugCap = "cap-1";
  let livroId: number;

  beforeAll(async () => {
    const livro = await prisma.livro.create({
      data: { slug: slugLivro, title: "Livro Teste", tagline: "t", synopsis: "s", gradient: "g", progress: 0 },
    });
    livroId = livro.id;
    await prisma.capitulo.create({
      data: { slug: slugCap, title: "Cap 1", excerpt: "e", order: 1, livroId },
    });
  });

  it("dono consegue apagar o próprio comentário", async () => {
    const { email, cookies } = await registrarELogar("coment-dono");
    emails.push(email);
    const { cookies: c1, csrfToken: t1 } = await obterCsrf(cookies);

    const criarRes = await request(app)
      .post(`/livros/${slugLivro}/capitulos/${slugCap}/comentarios`)
      .set("Cookie", c1)
      .set("X-CSRF-Token", t1)
      .send({ texto: "comentário de teste" });
    expect(criarRes.status).toBe(201);

    const { cookies: c2, csrfToken: t2 } = await obterCsrf(c1);
    const delRes = await request(app)
      .delete(`/comentarios/${criarRes.body.id}`)
      .set("Cookie", c2)
      .set("X-CSRF-Token", t2);
    expect(delRes.status).toBe(204);
  });

  it("outro usuário não-admin não consegue apagar", async () => {
    const dono = await registrarELogar("coment-vitima");
    emails.push(dono.email);
    const outro = await registrarELogar("coment-atacante");
    emails.push(outro.email);

    const { cookies: c1, csrfToken: t1 } = await obterCsrf(dono.cookies);
    const criarRes = await request(app)
      .post(`/livros/${slugLivro}/capitulos/${slugCap}/comentarios`)
      .set("Cookie", c1)
      .set("X-CSRF-Token", t1)
      .send({ texto: "comentário da vítima" });

    const { cookies: c2, csrfToken: t2 } = await obterCsrf(outro.cookies);
    const delRes = await request(app)
      .delete(`/comentarios/${criarRes.body.id}`)
      .set("Cookie", c2)
      .set("X-CSRF-Token", t2);
    expect(delRes.status).toBe(403);
  });

  it("admin consegue apagar qualquer comentário", async () => {
    const dono = await registrarELogar("coment-dono2");
    emails.push(dono.email);
    const admin = await registrarELogar("coment-admin", true);
    emails.push(admin.email);

    const { cookies: c1, csrfToken: t1 } = await obterCsrf(dono.cookies);
    const criarRes = await request(app)
      .post(`/livros/${slugLivro}/capitulos/${slugCap}/comentarios`)
      .set("Cookie", c1)
      .set("X-CSRF-Token", t1)
      .send({ texto: "outro comentário" });

    const { cookies: c2, csrfToken: t2 } = await obterCsrf(admin.cookies);
    const delRes = await request(app)
      .delete(`/comentarios/${criarRes.body.id}`)
      .set("Cookie", c2)
      .set("X-CSRF-Token", t2);
    expect(delRes.status).toBe(204);
  });

  afterAll(async () => {
    await prisma.livro.delete({ where: { id: livroId } });
    await prisma.usuario.deleteMany({ where: { email: { in: emails } } });
  });
});
