"use server";
import { cookies } from "next/headers";

export default async function useCookies(
  cookieKey: string
): Promise<string | null> {
  const cookieStore = cookies();

  const cookie = cookieStore.get(cookieKey);

  return cookie?.value ? cookie.value : null;
}
