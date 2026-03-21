// imageService.js
import { IMAGE_SERVICE_URL } from "../api/urls";

export async function uploadImage(formData) {
  const response = await fetch(`${IMAGE_SERVICE_URL}/api/images/upload`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) throw new Error("Failed to upload image");
  return response.json();
}

export async function listImagesForPatient(patientId) {
  const response = await fetch(`${IMAGE_SERVICE_URL}/api/images/patient/${patientId}`);
  if (!response.ok) throw new Error("Failed to list images");
  return response.json();
}

export async function getImageAnnotations(imageId) {
  const response = await fetch(`${IMAGE_SERVICE_URL}/api/images/${imageId}/annotations`);
  if (!response.ok) throw new Error("Failed to fetch annotations");
  return response.json();
}

export async function saveImageAnnotations(imageId, actions) {
  const response = await fetch(`${IMAGE_SERVICE_URL}/api/images/${imageId}/annotate`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actions })
  });
  if (!response.ok) throw new Error("Failed to save annotations");
  return response.json();
}

export function getImageUrl(storedFilename) {
  return `${IMAGE_SERVICE_URL}/files/${storedFilename}`;
}