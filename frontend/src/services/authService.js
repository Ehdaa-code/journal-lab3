import { USER_SERVICE_URL } from "../api/urls";

export async function loginUser(payload) {
  const response = await fetch(`${USER_SERVICE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "Login failed";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  return response.json();
}

export async function registerUser(payload) {
  const response = await fetch(`${USER_SERVICE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "Registration failed";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  return response.json();
}

export async function getUsersByRole(role) {
  const response = await fetch(`${USER_SERVICE_URL}/api/users/role/${role}`);
  if (!response.ok) throw new Error("Failed to fetch users by role");
  return response.json();
}

export async function getAllUsers() {
  const response = await fetch(`${USER_SERVICE_URL}/api/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}