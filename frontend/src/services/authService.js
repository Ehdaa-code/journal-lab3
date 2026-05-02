import { USER_SERVICE_URL } from "../api/urls";
import { authFetch } from "./httpService";
import {
  initializeKeycloak,
  loginWithKeycloak,
  logoutFromKeycloak
} from "./keycloakService";

export async function initializeSession() {
  return initializeKeycloak();
}

export async function loginUser() {
  return loginWithKeycloak();
}

export async function logoutUser() {
  return logoutFromKeycloak();
}

export async function syncCurrentUser() {
  const response = await authFetch(`${USER_SERVICE_URL}/api/users/me`);
  if (!response.ok) {
    throw new Error("Failed to sync current user");
  }
  return response.json();
}

export async function getUsersByRole(role) {
  const response = await authFetch(`${USER_SERVICE_URL}/api/users/role/${role}`);
  if (!response.ok) throw new Error("Failed to fetch users by role");
  return response.json();
}

export async function getAllUsers() {
  const response = await authFetch(`${USER_SERVICE_URL}/api/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}
