// LoginPage.jsx
import React from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage({ onLogin, onGoRegister, error }) {
  return (
    <div className="container">
      <LoginForm onSubmit={onLogin} error={error} />
      <div className="card">
        <p>Har du inget konto?</p>
        <button onClick={onGoRegister}>Gå till registrering</button>
      </div>
    </div>
  );
}