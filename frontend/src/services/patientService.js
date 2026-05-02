import { PATIENT_SERVICE_URL } from "../api/urls";
import { authFetch } from "./httpService";

export async function createPatient(payload) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create patient");
  return response.json();
}

export async function getAllPatients() {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients`);
  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
}

export async function getPatientById(patientId) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch patient");
  return response.json();
}

export async function getPatientByUserId(userId) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/by-user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch patient by user");
  return response.json();
}

export async function getPatientsByDoctor(doctorUserId) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/doctor/${doctorUserId}`);
  if (!response.ok) throw new Error("Failed to fetch doctor's patients");
  return response.json();
}

export async function getPatientsByStaff(staffUserId) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/staff/${staffUserId}`);
  if (!response.ok) throw new Error("Failed to fetch staff patients");
  return response.json();
}

export async function getPatientJournal(patientId) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/${patientId}/journal`);
  if (!response.ok) throw new Error("Failed to fetch patient journal");
  return response.json();
}

export async function getJournalByUserId(userId) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/journal/by-user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch journal by user");
  return response.json();
}

export async function updatePatient(patientId, payload) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/${patientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to update patient");
  return response.json();
}

export async function createEncounter(patientId, payload) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/${patientId}/encounters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create encounter");
  return response.json();
}

export async function createObservation(encounterId, payload) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/encounters/${encounterId}/observations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create observation");
  return response.json();
}

export async function createCondition(patientId, payload) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/conditions/patient/${patientId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create condition");
  return response.json();
}

export async function createClinicalNote(patientId, payload) {
  const response = await authFetch(`${PATIENT_SERVICE_URL}/api/patients/${patientId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create clinical note");
  return response.json();
}
