"use server";
import { cookies } from "next/headers";

export async function getServerCookie(key: string): Promise<string | null> {
  const cookie = cookies().get(key);
  return cookie?.value ?? null;
}