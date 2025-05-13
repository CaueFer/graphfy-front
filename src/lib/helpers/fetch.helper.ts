import { clientCookie } from "../hooks/getClientCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http:localhost:5000/api";

const token = clientCookie().get("token");

export function post(
  endpoint: string,
  body: Record<string, unknown> | undefined
) {
  return fetch(API_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export function get(endpoint: string) {
  return fetch(API_URL + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
