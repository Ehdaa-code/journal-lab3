// searchService.js
import { SEARCH_SERVICE_URL } from "../api/urls";
import { authFetch } from "./httpService";

export async function searchPatientsByName(name) {
  const response = await authFetch(`${SEARCH_SERVICE_URL}/api/search/patients?name=${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error("Failed to search patients by name");
  return response.json();
}

export async function searchPatientsByCondition(condition) {
  const response = await authFetch(`${SEARCH_SERVICE_URL}/api/search/patients/by-condition?condition=${encodeURIComponent(condition)}`);
  if (!response.ok) throw new Error("Failed to search patients by condition");
  return response.json();
}

export async function advancedSearch(params) {
  const query = new URLSearchParams();
  if (params.name) query.append("name", params.name);
  if (params.status) query.append("status", params.status);
  if (params.doctorUserId) query.append("doctorUserId", params.doctorUserId);

  const response = await authFetch(`${SEARCH_SERVICE_URL}/api/search/patients/advanced?${query.toString()}`);
  if (!response.ok) throw new Error("Failed advanced search");
  return response.json();
}

export async function getDoctorOverviewByDay(doctorUserId, date) {
  const response = await authFetch(`${SEARCH_SERVICE_URL}/api/search/doctor/${doctorUserId}/overview-by-day?date=${encodeURIComponent(date)}`);
  if (!response.ok) throw new Error("Failed doctor overview search");
  return response.json();
}
