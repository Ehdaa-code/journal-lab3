// RegisterForm.jsx
import React, { useState } from "react";

export default function RegisterForm({ onSubmit, error }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "PATIENT"
  });

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="card">
      <h2 className="title">Registrering</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Förnamn" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
        <input placeholder="Efternamn" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
        <input placeholder="Username" value={form.username} onChange={(e) => updateField("username", e.target.value)} />
        <input placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
        <input type="password" placeholder="Lösenord" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
        <select value={form.role} onChange={(e) => updateField("role", e.target.value)}>
          <option value="PATIENT">PATIENT</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="STAFF">STAFF</option>
        </select>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button type="submit">Registrera</button>
        </div>
      </form>
    </div>
  );
}