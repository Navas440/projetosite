import { Request, Response, NextFunction } from "express";
import { autenticar } from "./auth";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const resultado = await autenticar(req);
  if (!resultado.ok) {
    return res.status(401).json({ erro: resultado.motivo === "sem_token" ? "Token não enviado" : "Token inválido" });
  }
  req.usuario = resultado.usuario;
  next();
}
