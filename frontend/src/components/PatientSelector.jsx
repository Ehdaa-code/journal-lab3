// PatientSelector.jsx
import React from "react";

export default function PatientSelector({ patients, selectedPatientId, onSelect }) {
  return (
    <div className="card">
      <h3 className="title">Välj patient</h3>
      <select
        style={{ width: "100%" }}
        value={selectedPatientId || ""}
        onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">-- välj patient --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName} {p.lastName} (patientId: {p.id})
          </option>
        ))}
      </select>
    </div>
  );
}