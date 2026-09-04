import { Request } from "express";
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

export type ResultadoAuth = { ok: true; usuario: Usuario } | { ok: false; motivo: "sem_token" | "token_invalido" };

export async function autenticar(req: Request): Promise<ResultadoAuth> {
  const token = req.cookies?.access_token as string | undefined;
  if (!token) {
    return { ok: false, motivo: "sem_token" };
  }

  let payload: { id: number };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { id: number };
  } catch {
    return { ok: false, motivo: "token_invalido" };
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.id } });
  if (!usuario) {
    return { ok: false, motivo: "token_invalido" };
  }
  return { ok: true, usuario };
}
