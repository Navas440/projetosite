import "dotenv/config";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET não está definida no .env");
}

export const JWT_SECRET = secret;
