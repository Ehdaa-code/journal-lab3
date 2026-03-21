import React from "react";

export default function NavBar({ user, onNavigate, onLogout }) {
  return (
    <div className="nav">
      <div className="container">
        <strong>Journal System Lab 2</strong>

        {user && (
          <div style={{ marginTop: 8 }}>
            <span style={{ marginRight: 12 }}>
              Inloggad: {user.firstName} {user.lastName} ({user.role})
            </span>

            <button onClick={() => onNavigate("dashboard")}>Dashboard</button>
            <button onClick={() => onNavigate("messages")}>Meddelanden</button>
            <button onClick={() => onNavigate("images")}>Bilder</button>

            {(user.role === "DOCTOR" || user.role === "STAFF") && (
              <button onClick={() => onNavigate("search")}>Sökning</button>
            )}

            <button onClick={onLogout}>Logga ut</button>
          </div>
        )}
      </div>
    </div>
  );
}