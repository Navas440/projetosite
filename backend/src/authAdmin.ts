import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "./db";
import { JWT_SECRET } from "./env";
import type { Usuario } from "./generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  let payload: { id: number };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { id: number };
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.id } });
  if (!usuario?.isAdmin) {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  req.usuario = usuario;
  next();
}
