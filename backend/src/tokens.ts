import crypto from "crypto";

export function gerarTokenOpaco(expiraEmMs: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + expiraEmMs);
  return { token, expiraEm };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
