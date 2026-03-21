// RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage({ onRegister, onGoLogin, error }) {
  return (
    <div className="container">
      <RegisterForm onSubmit={onRegister} error={error} />
      <div className="card">
        <button onClick={onGoLogin}>Tillbaka till login</button>
      </div>
    </div>
  );
}