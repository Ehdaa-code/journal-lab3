// messageService.js
import { MESSAGE_SERVICE_URL } from "../api/urls";
import { authFetch } from "./httpService";

export async function createThread(payload) {
  const response = await authFetch(`${MESSAGE_SERVICE_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create message thread");
  return response.json();
}

export async function replyToThread(threadId, payload) {
  const response = await authFetch(`${MESSAGE_SERVICE_URL}/api/messages/${threadId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to reply");
  return response.json();
}

export async function getPatientThreads(patientUserId) {
  const response = await authFetch(`${MESSAGE_SERVICE_URL}/api/messages/patient/${patientUserId}`);
  if (!response.ok) throw new Error("Failed to fetch patient threads");
  return response.json();
}

export async function getStaffThreads(staffUserId) {
  const response = await authFetch(`${MESSAGE_SERVICE_URL}/api/messages/staff/${staffUserId}`);
  if (!response.ok) throw new Error("Failed to fetch staff threads");
  return response.json();
}

export async function getThread(threadId) {
  const response = await authFetch(`${MESSAGE_SERVICE_URL}/api/messages/${threadId}`);
  if (!response.ok) throw new Error("Failed to fetch thread");
  return response.json();
}
