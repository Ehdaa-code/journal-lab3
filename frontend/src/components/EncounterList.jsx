// EncounterList.jsx
import React, { useState } from "react";

export default function EncounterList({ encounters, onCreateEncounter, currentUser }) {
  const [form, setForm] = useState({
    encounterDate: "",
    type: "VISIT",
    reason: "",
    summary: ""
  });

  function handleSubmit(e) {
    e.preventDefault();
    onCreateEncounter({
      ...form,
      createdByUserId: currentUser.id
    });
    setForm({
      encounterDate: "",
      type: "VISIT",
      reason: "",
      summary: ""
    });
  }

  return (
    <div className="card">
      <h3 className="title">Encounters</h3>

      {(currentUser.role === "DOCTOR" || currentUser.role === "STAFF") && (
        <form onSubmit={handleSubmit}>
          <input
            type="datetime-local"
            value={form.encounterDate}
            onChange={(e) => setForm({ ...form, encounterDate: e.target.value })}
          />
          <input
            placeholder="Typ"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <input
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <textarea
            placeholder="Summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <button type="submit">Skapa encounter</button>
        </form>
      )}

      {encounters.map((enc) => (
        <div key={enc.id} className="card">
          <strong>{enc.type}</strong>
          <div className="small">{enc.encounterDate}</div>
          <div>Reason: {enc.reason}</div>
          <div>Summary: {enc.summary}</div>
        </div>
      ))}
    </div>
  );
}