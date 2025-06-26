import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || "segredo_default"
);

export async function decodeJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Erro ao verificar o token JWT:", error);
    return null;
  }
}
