// SearchPanel.jsx
import React, { useState } from "react";
import {
  searchPatientsByName,
  searchPatientsByCondition,
  advancedSearch,
  getDoctorOverviewByDay
} from "../services/searchService";

export default function SearchPanel({ currentUser, onOpenPatient }) {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("2026-03-16");
  const [results, setResults] = useState([]);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  async function handleNameSearch() {
    try {
      setOverview(null);
      const data = await searchPatientsByName(name);
      setResults(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleConditionSearch() {
    try {
      setOverview(null);
      const data = await searchPatientsByCondition(condition);
      setResults(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAdvancedSearch() {
    try {
      setOverview(null);
      const data = await advancedSearch({
        name,
        status,
        doctorUserId: currentUser.role === "DOCTOR" ? currentUser.id : undefined
      });
      setResults(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDoctorOverview() {
    try {
      const data = await getDoctorOverviewByDay(currentUser.id, date);
      setOverview(data);
      setResults(data.patients || []);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="card">
      <h3 className="title">Sökning</h3>

      <div className="row">
        <div className="col">
          <input
            style={{ width: "100%" }}
            placeholder="Sök via namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleNameSearch}>Sök namn</button>
        </div>

        <div className="col">
          <input
            style={{ width: "100%" }}
            placeholder="Sök via condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
          <button onClick={handleConditionSearch}>Sök condition</button>
        </div>

        <div className="col">
          <input
            style={{ width: "100%" }}
            placeholder="Status, t.ex. ACTIVE"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <button onClick={handleAdvancedSearch}>Avancerad sökning</button>
        </div>
      </div>

      {currentUser.role === "DOCTOR" && (
        <div className="card">
          <h4>Doctor overview by day</h4>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={handleDoctorOverview}>Hämta overview</button>
        </div>
      )}

      {overview && (
        <div className="card">
          <h4>Overview</h4>
          <div>DoctorUserId: {overview.doctorUserId}</div>
          <div>Date: {overview.date}</div>
          <div>Antal patienter: {overview.patients?.length || 0}</div>
          <div>Antal encounters: {overview.encounters?.length || 0}</div>
        </div>
      )}

      <div className="card">
        <h4>Resultat</h4>
        {results.map((patient) => (
          <div key={patient.patientId || patient.id} className="card">
            <strong>{patient.firstName} {patient.lastName}</strong>
            <div className="small">patientId: {patient.patientId || patient.id}</div>
            <div className="small">doctorUserId: {patient.assignedDoctorUserId}</div>
            <button onClick={() => onOpenPatient(patient.patientId || patient.id)}>Öppna patient</button>
          </div>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}