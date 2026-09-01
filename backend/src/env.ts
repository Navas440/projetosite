import "dotenv/config";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET não está definida no .env");
}

export const JWT_SECRET = secret;

const pepper = process.env.PASSWORD_PEPPER;
if (!pepper || pepper.length < 64) {
  throw new Error("PASSWORD_PEPPER não está definida ou é curta demais (mínimo 64 caracteres) no .env");
}
export const PASSWORD_PEPPER = pepper;

const csrfSecret = process.env.CSRF_SECRET;
if (!csrfSecret) {
  throw new Error("CSRF_SECRET não está definida no .env");
}
export const CSRF_SECRET = csrfSecret;