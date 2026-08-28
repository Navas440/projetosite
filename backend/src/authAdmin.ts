import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "./db";
import { JWT_SECRET } from "./env";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const usuario = await prisma.usuario.findUnique({ where: { id: payload.id } });
    if (!usuario?.isAdmin) {
      return res.status(403).json({ erro: "Acesso restrito a administradores" });
    }
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido" });
  }
}
