import Keycloak from "keycloak-js";
import {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_URL
} from "../api/urls";

const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID
});

let initialized = false;

function persistToken(token) {
  if (token) {
    sessionStorage.setItem("journal_access_token", token);
  } else {
    sessionStorage.removeItem("journal_access_token");
  }
}

export async function initializeKeycloak() {
  if (initialized) {
    return Boolean(keycloak.authenticated);
  }

  const authenticated = await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false
  });

  initialized = true;
  persistToken(keycloak.token);
  return authenticated;
}

export async function loginWithKeycloak() {
  return keycloak.login({
    redirectUri: window.location.origin
  });
}

export async function logoutFromKeycloak() {
  persistToken(null);
  return keycloak.logout({
    redirectUri: window.location.origin
  });
}

export async function getAccessToken() {
  if (!initialized) {
    return sessionStorage.getItem("journal_access_token");
  }

  if (!keycloak.authenticated) {
    persistToken(null);
    return null;
  }

  await keycloak.updateToken(30);
  persistToken(keycloak.token);
  return keycloak.token;
}

export function getParsedToken() {
  return keycloak.tokenParsed || null;
}
