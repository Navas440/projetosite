import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "Backend rodando" });
});

app.get("/livros", async (req: Request, res: Response) => {
  const livros = await prisma.livro.findMany();
  res.json(livros);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
