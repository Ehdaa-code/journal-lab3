// ConditionList.jsx
import React, { useState } from "react";

export default function ConditionList({ conditions, onCreateCondition, currentUser }) {
  const [form, setForm] = useState({
    diagnosisName: "",
    icdCode: "",
    description: "",
    status: "ACTIVE",
    diagnosedDate: ""
  });

  function handleSubmit(e) {
    e.preventDefault();
    onCreateCondition({
      ...form,
      diagnosedDate: form.diagnosedDate || null,
      createdByUserId: currentUser.id
    });
    setForm({
      diagnosisName: "",
      icdCode: "",
      description: "",
      status: "ACTIVE",
      diagnosedDate: ""
    });
  }

  return (
    <div className="card">
      <h3 className="title">Conditions / Diagnoser</h3>

      {(currentUser.role === "DOCTOR" || currentUser.role === "STAFF") && (
        <form onSubmit={handleSubmit}>
          <input placeholder="Diagnosis name" value={form.diagnosisName} onChange={(e) => setForm({ ...form, diagnosisName: e.target.value })} />
          <input placeholder="ICD code" value={form.icdCode} onChange={(e) => setForm({ ...form, icdCode: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="SUSPECTED">SUSPECTED</option>
          </select>
          <input type="date" value={form.diagnosedDate} onChange={(e) => setForm({ ...form, diagnosedDate: e.target.value })} />
          <button type="submit">Lägg till condition</button>
        </form>
      )}

      {conditions.map((c) => (
        <div key={c.id} className="card">
          <strong>{c.diagnosisName}</strong>
          <div>Status: {c.status}</div>
          <div>ICD: {c.icdCode}</div>
          <div>{c.description}</div>
        </div>
      ))}
    </div>
  );
}