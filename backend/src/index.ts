import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { prisma } from "./db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";
import { requireAdmin } from "./authAdmin";
import rateLimit from "express-rate-limit";
import { aplicarPepper } from "./pepper";
import { generateCsrfToken, doubleCsrfProtection } from "./csrf";
import { gerarTokenOpaco, hashToken } from "./tokens";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

const cookieOptions = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10, // brute-force de senha: janela mais generosa
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Tente novamente em 1 hora." },
});

const cadastroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5, // criar conta em massa tem menos motivo legítimo pra repetir tanto
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Tente novamente em 1 hora." },
});

const ACCESS_TOKEN_MAXAGE = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_MAXAGE = 30 * 24 * 60 * 60 * 1000; // 30 dias

const refreshLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30, // bem mais generoso que authLimiter: renovação automática a cada 15min de uso ativo
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Tente novamente em 1 hora." },
});

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "Backend rodando" });
});

app.get("/livros", async (req: Request, res: Response) => {
  const livros = await prisma.livro.findMany();
  res.json(livros);
});

app.post("/cadastro", cadastroLimiter, async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  if (senha.length < 8) {
    return res.status(400).json({ erro: "A senha deve ter pelo menos 8 caracteres" });
  }

  const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExiste) {
    return res.status(409).json({ erro: "Email já cadastrado" });
  }

const senhaComPepper = aplicarPepper(senha);
const senhaHash = await argon2.hash(senhaComPepper, {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
});

  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash },
  });

  res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
});

app.post("/login", loginLimiter, async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

 const senhaComPepper = aplicarPepper(senha);
 const senhaCorreta = await argon2.verify(usuario.senhaHash, senhaComPepper);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const accessToken = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  const { token: refreshTokenBruto, expiraEm } = gerarTokenOpaco(REFRESH_TOKEN_MAXAGE);
  await prisma.refreshToken.create({
    data: { usuarioId: usuario.id, tokenHash: hashToken(refreshTokenBruto), expiraEm },
  });

  res.cookie("access_token", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAXAGE });
  res.cookie("refresh_token", refreshTokenBruto, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAXAGE });
  res.json({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin },
  });
});

app.post("/refresh", refreshLimiter, async (req: Request, res: Response) => {
  const refreshTokenBruto = req.cookies?.refresh_token as string | undefined;
  if (!refreshTokenBruto) {
    return res.status(401).json({ erro: "Refresh token não enviado" });
  }

  const registro = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(refreshTokenBruto) } });
  if (!registro || registro.revogadoEm || registro.expiraEm < new Date()) {
    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);
    return res.status(401).json({ erro: "Sessão expirada, faça login novamente" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: registro.usuarioId } });
  if (!usuario) {
    return res.status(401).json({ erro: "Sessão expirada, faça login novamente" });
  }

  const { token: novoRefreshBruto, expiraEm } = gerarTokenOpaco(REFRESH_TOKEN_MAXAGE);
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: registro.id }, data: { revogadoEm: new Date() } }),
    prisma.refreshToken.create({ data: { usuarioId: usuario.id, tokenHash: hashToken(novoRefreshBruto), expiraEm } }),
  ]);

  const novoAccessToken = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  res.cookie("access_token", novoAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAXAGE });
  res.cookie("refresh_token", novoRefreshBruto, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAXAGE });
  res.json({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin },
  });
});

app.post("/logout", async (req: Request, res: Response) => {
  const refreshTokenBruto = req.cookies?.refresh_token as string | undefined;
  if (refreshTokenBruto) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshTokenBruto), revogadoEm: null },
      data: { revogadoEm: new Date() },
    });
  }
  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
  res.status(204).end();
});

app.get("/admin/me", requireAdmin, (req: Request, res: Response) => {
  const usuario = req.usuario!;
  res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin });
});

app.get("/csrf-token", (req: Request, res: Response) => {
  const csrfToken = generateCsrfToken(req, res);
  res.json({ csrfToken });
});

app.post("/admin/livros", doubleCsrfProtection, requireAdmin, async (req: Request, res: Response) => {
  const { slug, title, tagline, synopsis, gradient, progress, featured } = req.body;

  if (!slug || !title || !tagline || !synopsis || !gradient || progress === undefined) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const livroExiste = await prisma.livro.findUnique({ where: { slug } });
  if (livroExiste) {
    return res.status(409).json({ erro: "Já existe um livro com esse slug" });
  }

  const livro = await prisma.livro.create({
    data: { slug, title, tagline, synopsis, gradient, progress, featured: !!featured },
  });

  res.status(201).json(livro);
});

app.post("/admin/livros/:slug/capitulos", doubleCsrfProtection, requireAdmin, async (req: Request, res: Response) => {
  const slugLivro = req.params.slug as string;
  const { slug, title, excerpt } = req.body;

  if (!slug || !title || !excerpt) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const livro = await prisma.livro.findUnique({ where: { slug: slugLivro } });
  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  const capitulos = await prisma.capitulo.findMany({ where: { livroId: livro.id } });
  const capituloExiste = capitulos.some((c) => c.slug === slug);
  if (capituloExiste) {
    return res.status(409).json({ erro: "Já existe um capítulo com esse slug nesse livro" });
  }

  const capitulo = await prisma.capitulo.create({
    data: { slug, title, excerpt, order: capitulos.length + 1, livroId: livro.id },
  });

  res.status(201).json(capitulo);
});

app.use((err: Error & { statusCode?: number; status?: number }, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ erro: status === 500 ? "Erro interno do servidor" : err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
