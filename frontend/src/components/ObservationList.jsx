// ObservationList.jsx
import React, { useState } from "react";

export default function ObservationList({ observations, encounters, onCreateObservation, currentUser }) {
  const [form, setForm] = useState({
    encounterId: "",
    category: "VITAL",
    name: "",
    value: "",
    unit: "",
    observedAt: ""
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.encounterId) return;

    onCreateObservation(Number(form.encounterId), {
      category: form.category,
      name: form.name,
      value: form.value,
      unit: form.unit,
      observedAt: form.observedAt || null,
      createdByUserId: currentUser.id
    });

    setForm({
      encounterId: "",
      category: "VITAL",
      name: "",
      value: "",
      unit: "",
      observedAt: ""
    });
  }

  return (
    <div className="card">
      <h3 className="title">Observations</h3>

      {(currentUser.role === "DOCTOR" || currentUser.role === "STAFF") && (
        <form onSubmit={handleSubmit}>
          <select
            value={form.encounterId}
            onChange={(e) => setForm({ ...form, encounterId: e.target.value })}
          >
            <option value="">Välj encounter</option>
            {encounters.map((enc) => (
              <option key={enc.id} value={enc.id}>
                {enc.type} - {enc.encounterDate}
              </option>
            ))}
          </select>
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <input placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          <input type="datetime-local" value={form.observedAt} onChange={(e) => setForm({ ...form, observedAt: e.target.value })} />
          <button type="submit">Lägg till observation</button>
        </form>
      )}

      {observations.map((obs) => (
        <div key={obs.id} className="card">
          <strong>{obs.name}</strong>
          <div>{obs.value} {obs.unit}</div>
          <div className="small">{obs.category} | {obs.observedAt}</div>
        </div>
      ))}
    </div>
  );
}