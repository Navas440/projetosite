import rateLimit from "express-rate-limit";
import { Request } from "express";

/**
 * Rate limit por IP não protege escrita autenticada: um usuário legítimo
 * numa rede compartilhada pode ser bloqueado por outros (falso-positivo), e
 * o mesmo usuário trocando de rede escapa do limite (falso-negativo). Toda
 * rota autenticada usa uma chave por usuario.id — precisa rodar depois de
 * requireAuth/requireAdmin na cadeia de middlewares, já que o keyGenerator
 * depende de req.usuario estar preenchido.
 */
export function limiterPorUsuario(windowMs: number, limit: number) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => String(req.usuario!.id),
    message: { erro: "Muitas tentativas. Tente novamente mais tarde." },
  });
}
