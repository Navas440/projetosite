import crypto from "crypto";
import { PASSWORD_PEPPER } from "./env";

export function aplicarPepper(senha: string): string {
  return crypto.createHmac("sha256", PASSWORD_PEPPER).update(senha).digest("hex");
}