import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definida no .env");
}

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "Backend rodando" });
});

app.get("/livros", async (req: Request, res: Response) => {
  const livros = await prisma.livro.findMany();
  res.json(livros);
});

app.post("/cadastro", async (req: Request, res: Response) => {
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

  const senhaHash = await argon2.hash(senha, {
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

app.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const senhaCorreta = await argon2.verify(usuario.senhaHash, senha);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
