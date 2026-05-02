// LoginForm.jsx
import React from "react";

export default function LoginForm({ onSubmit, error }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="card">
      <h2 className="title">Login with Keycloak</h2>
      <form onSubmit={handleSubmit}>
        <p>Autentisering sker nu via Keycloak. Efter inloggning synkas din Keycloak-identitet till exakt en lokal user-post.</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Logga in med Keycloak</button>
      </form>
    </div>
  );
}
