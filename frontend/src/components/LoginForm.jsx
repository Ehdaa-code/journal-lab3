// LoginForm.jsx
import React, { useState } from "react";

export default function LoginForm({ onSubmit, error }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ usernameOrEmail, password });
  }

  return (
    <div className="card">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username eller email</label>
          <input
            style={{ width: "100%" }}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Lösenord</label>
          <input
            type="password"
            style={{ width: "100%" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}