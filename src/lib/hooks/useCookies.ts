"use server";
import { cookies } from "next/headers";

export default async function useCookies(
  cookieKey: string
): Promise<string | null> {
  const cookieStore = cookies();

  const cookie = cookieStore.get(cookieKey);

  console.log(cookie?.value);
  return cookie?.value ? cookie.value : null;
}
