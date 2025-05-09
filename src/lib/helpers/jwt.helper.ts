import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "segredo_default"
);

export async function decodeJWT(token: string) {
  const decoded = await jwtVerify(token, JWT_SECRET);
  return decoded.payload;
}
