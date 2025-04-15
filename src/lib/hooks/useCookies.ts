import { cookies } from "next/headers";

export default function useCookies(cookieKey: string) {
  const cookieStore = cookies();

  const cookie = cookieStore.get(cookieKey);
  return cookie?.value ? cookie.value : null;
}
