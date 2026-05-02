import { getAccessToken } from "./keycloakService";

export async function authFetch(url, options = {}) {
  const token = await getAccessToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers
  });
}
