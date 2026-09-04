import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { registrarELogar, extrairCookie } from "./helpers";

describe("autenticação", () => {
  const emails: string[] = [];

  it("cadastro + login emite access_token e refresh_token, e /me funciona com eles", async () => {
    const { email, cookies } = await registrarELogar("auth-cookies");
    emails.push(email);
    expect(extrairCookie(cookies, "access_token")).toBeTruthy();
    expect(extrairCookie(cookies, "refresh_token")).toBeTruthy();

    const meRes = await request(app).get("/me").set("Cookie", cookies);
    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(email);
  });

  it("/refresh rotaciona o refresh token e invalida o antigo", async () => {
    const { email, cookies } = await registrarELogar("auth-refresh");
    emails.push(email);
    const refreshTokenAntigo = extrairCookie(cookies, "refresh_token");

    const refreshRes = await request(app).post("/refresh").set("Cookie", cookies);
    expect(refreshRes.status).toBe(200);

    const reuso = await request(app).post("/refresh").set("Cookie", [refreshTokenAntigo]);
    expect(reuso.status).toBe(401);
  });

  it("/logout revoga o refresh token", async () => {
    const { email, cookies } = await registrarELogar("auth-logout");
    emails.push(email);

    const logoutRes = await request(app).post("/logout").set("Cookie", cookies);
    expect(logoutRes.status).toBe(204);

    const reuso = await request(app).post("/refresh").set("Cookie", cookies);
    expect(reuso.status).toBe(401);
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { email: { in: emails } } });
  });
});
