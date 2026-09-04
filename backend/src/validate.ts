import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ erro: resultado.error.issues[0]?.message ?? "Dados inválidos" });
    }
    req.body = resultado.data;
    next();
  };
}
