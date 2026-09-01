import { doubleCsrf } from "csrf-csrf";

const isProd = process.env.NODE_ENV === "production";

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET as string,
  getSessionIdentifier: (req) => req.cookies?.token ?? "",
  cookieName: isProd ? "__Host-vexon.csrf-token" : "vexon.csrf-token",
  cookieOptions: {
    sameSite: "strict",
    secure: isProd,
    path: "/",
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});
