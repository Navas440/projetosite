import { doubleCsrf } from "csrf-csrf";
import { CSRF_SECRET } from "./env";

const isProd = process.env.NODE_ENV === "production";

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  getSessionIdentifier: (req) => req.cookies?.token ?? "",
  cookieName: isProd ? "__Host-vexon.csrf-token" : "vexon.csrf-token",
  cookieOptions: {
    sameSite: "strict",
    secure: isProd,
    path: "/",
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});
