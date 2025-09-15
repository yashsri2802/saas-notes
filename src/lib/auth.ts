import jwt from "jsonwebtoken";

export type JwtClaims = {
  sub: string;
  tenantId: string;
  tenantSlug: string;
  role: "ADMIN" | "MEMBER";
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload: JwtClaims): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtClaims {
  return jwt.verify(token, JWT_SECRET) as JwtClaims;
}

export function getAuthFromHeader(
  authHeader?: string | null
): JwtClaims | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
