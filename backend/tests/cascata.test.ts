import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { registrarELogar, obterCsrf } from "./helpers";

describe("exclusão em cascata", () => {
  const emails: string[] = [];

  it("excluir um livro remove capítulos, favoritos, progresso e comentários relacionados", async () => {
    const admin = await registrarELogar("cascata-admin", true);
    emails.push(admin.email);
    const leitor = await registrarELogar("cascata-leitor");
    emails.push(leitor.email);

    const slugLivro = `livro-cascata-${Date.now()}`;
    let { cookies: ac, csrfToken: at } = await obterCsrf(admin.cookies);

    const criarLivroRes = await request(app)
      .post("/admin/livros")
      .set("Cookie", ac)
      .set("X-CSRF-Token", at)
      .send({ slug: slugLivro, title: "t", tagline: "t", synopsis: "s", gradient: "g", progress: 0, featured: false });
    expect(criarLivroRes.status).toBe(201);

    ({ cookies: ac, csrfToken: at } = await obterCsrf(ac));
    const criarCapRes = await request(app)
      .post(`/admin/livros/${slugLivro}/capitulos`)
      .set("Cookie", ac)
      .set("X-CSRF-Token", at)
      .send({ slug: "c1", title: "Cap", excerpt: "e" });
    expect(criarCapRes.status).toBe(201);
    const capituloId = criarCapRes.body.id;

    let { cookies: lc, csrfToken: lt } = await obterCsrf(leitor.cookies);
    const favRes = await request(app)
      .post(`/livros/${slugLivro}/favorito`)
      .set("Cookie", lc)
      .set("X-CSRF-Token", lt);
    expect(favRes.status).toBe(200);

    ({ cookies: lc, csrfToken: lt } = await obterCsrf(lc));
    const progRes = await request(app)
      .post(`/livros/${slugLivro}/capitulos/c1/progresso`)
      .set("Cookie", lc)
      .set("X-CSRF-Token", lt);
    expect(progRes.status).toBe(200);

    ({ cookies: lc, csrfToken: lt } = await obterCsrf(lc));
    const comentRes = await request(app)
      .post(`/livros/${slugLivro}/capitulos/c1/comentarios`)
      .set("Cookie", lc)
      .set("X-CSRF-Token", lt)
      .send({ texto: "x" });
    expect(comentRes.status).toBe(201);

    const livro = await prisma.livro.findUnique({ where: { slug: slugLivro } });
    expect(await prisma.favorito.count({ where: { livroId: livro!.id } })).toBe(1);
    expect(await prisma.leituraCapitulo.count({ where: { capituloId } })).toBe(1);
    expect(await prisma.comentario.count({ where: { capituloId } })).toBe(1);

    ({ cookies: ac, csrfToken: at } = await obterCsrf(ac));
    const delRes = await request(app)
      .delete(`/admin/livros/${slugLivro}`)
      .set("Cookie", ac)
      .set("X-CSRF-Token", at);
    expect(delRes.status).toBe(204);

    expect(await prisma.livro.findUnique({ where: { slug: slugLivro } })).toBeNull();
    expect(await prisma.capitulo.findUnique({ where: { id: capituloId } })).toBeNull();
    expect(await prisma.favorito.count({ where: { livroId: livro!.id } })).toBe(0);
    expect(await prisma.leituraCapitulo.count({ where: { capituloId } })).toBe(0);
    expect(await prisma.comentario.count({ where: { capituloId } })).toBe(0);
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { email: { in: emails } } });
  });
});
