import React from "react";

export default function RegisterPage({ onGoLogin }) {
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Användare hanteras i Keycloak</h2>
        <p>För den här labben skapas eller importeras användare i Keycloak, inte i frontendens gamla registreringsformulär.</p>
        <p>Lokala demoanvändare finns i realm-importen: `patient1`, `doctor1`, `staff1`, `admin1`.</p>
        <button onClick={onGoLogin}>Tillbaka till login</button>
      </div>
    </div>
  );
}
