export const clientCookie = () => {
  const get = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const set = (name: string, value: string, days = 1): void => {
    if (typeof document === "undefined") return;

    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const remove = (name: string): void => {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  return { get, set, remove };
};
