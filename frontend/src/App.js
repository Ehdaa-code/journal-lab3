import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import NotFoundPage from "./pages/NotFoundPage";

import { loginUser, registerUser } from "./services/authService";
import {
  createPatient,
  getPatientById,
  getPatientByUserId,
  getPatientsByDoctor,
  getPatientsByStaff,
  getAllPatients,
  getPatientJournal,
  getJournalByUserId,
  updatePatient,
  createEncounter,
  createObservation,
  createCondition,
  createClinicalNote
} from "./services/patientService";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [currentView, setCurrentView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientJournal, setSelectedPatientJournal] = useState(null);
  const [patientOwnJournal, setPatientOwnJournal] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("journal_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setScreen("app");
    }
  }, []);

  useEffect(() => {
    if (user) {
      initializeUserData(user);
    }
  }, [user]);

  async function initializeUserData(currentUser) {
    try {
      setError("");

      if (currentUser.role === "PATIENT") {
        try {
          await getPatientByUserId(currentUser.id);
        } catch {
          await createPatient({
            userId: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            dateOfBirth: null,
            personalNumber: "",
            phoneNumber: "",
            address: "",
            assignedDoctorUserId: null,
            assignedStaffUserId: null
          });
        }

        const journal = await getJournalByUserId(currentUser.id);
        setPatientOwnJournal(journal);
      }

      if (currentUser.role === "DOCTOR") {
        const allPatients = await getAllPatients();
        setPatients(allPatients);

        const ownPatients = await getPatientsByDoctor(currentUser.id);
        if (ownPatients.length > 0) {
          await handleSelectPatient(ownPatients[0].id);
        }
      }

      if (currentUser.role === "STAFF") {
        const allPatients = await getAllPatients();
        setPatients(allPatients);

        const ownPatients = await getPatientsByStaff(currentUser.id);
        if (ownPatients.length > 0) {
          await handleSelectPatient(ownPatients[0].id);
        }
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function reloadPatientList() {
    if (!user) return;

    if (user.role === "DOCTOR" || user.role === "STAFF") {
      const allPatients = await getAllPatients();
      setPatients(allPatients);
    }
  }

  async function handleLogin(payload) {
    try {
      setError("");
      const response = await loginUser(payload);
      setUser(response.user);
      localStorage.setItem("journal_user", JSON.stringify(response.user));
      setScreen("app");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRegister(payload) {
    try {
      setError("");
      await registerUser(payload);
      setScreen("login");
    } catch (e) {
      setError(e.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("journal_user");
    setUser(null);
    setScreen("login");
    setCurrentView("dashboard");
    setPatients([]);
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setSelectedPatientJournal(null);
    setPatientOwnJournal(null);
    setError("");
  }

  async function handleSelectPatient(patientId) {
    try {
      setSelectedPatientId(patientId);

      const patient = await getPatientById(patientId);
      setSelectedPatient(patient);

      const journal = await getPatientJournal(patientId);
      setSelectedPatientJournal(journal);
      setCurrentView("dashboard");
    } catch (e) {
      setError(e.message);
    }
  }

  async function refreshSelectedPatientData(patientId) {
    if (!patientId) return;

    const patient = await getPatientById(patientId);
    setSelectedPatient(patient);

    const journal = await getPatientJournal(patientId);
    setSelectedPatientJournal(journal);
  }

  async function handleSaveAssignment(payload) {
    if (!selectedPatientId) return;

    await updatePatient(selectedPatientId, payload);
    await reloadPatientList();
    await refreshSelectedPatientData(selectedPatientId);
  }

  async function handleCreateEncounter(payload) {
    try {
      if (!selectedPatientId) return;
      await createEncounter(selectedPatientId, payload);
      await refreshSelectedPatientData(selectedPatientId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateObservation(encounterId, payload) {
    try {
      await createObservation(encounterId, payload);
      await refreshSelectedPatientData(selectedPatientId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateCondition(payload) {
    try {
      if (!selectedPatientId) return;
      await createCondition(selectedPatientId, payload);
      await refreshSelectedPatientData(selectedPatientId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateNote(payload) {
    try {
      if (user.role === "PATIENT") return;
      await createClinicalNote(selectedPatientId, payload);
      await refreshSelectedPatientData(selectedPatientId);
    } catch (e) {
      setError(e.message);
    }
  }

  function handleOpenPatientFromSearch(patientId) {
    handleSelectPatient(patientId);
  }

  if (screen === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoRegister={() => {
          setError("");
          setScreen("register");
        }}
        error={error}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onGoLogin={() => {
          setError("");
          setScreen("login");
        }}
        error={error}
      />
    );
  }

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <>
      <NavBar
        user={user}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />

      {error && (
        <div className="container">
          <div className="card">
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </div>
      )}

      {user.role === "PATIENT" && (
        <PatientDashboard
          currentUser={user}
          journal={patientOwnJournal}
          currentView={currentView}
          onCreateEncounter={() => {}}
          onCreateObservation={() => {}}
          onCreateCondition={() => {}}
          onCreateNote={() => {}}
        />
      )}

      {user.role === "DOCTOR" && (
        <DoctorDashboard
          currentUser={user}
          currentView={currentView}
          patients={patients}
          selectedPatient={selectedPatient}
          selectedPatientId={selectedPatientId}
          selectedPatientJournal={selectedPatientJournal}
          onSelectPatient={handleSelectPatient}
          onCreateEncounter={handleCreateEncounter}
          onCreateObservation={handleCreateObservation}
          onCreateCondition={handleCreateCondition}
          onCreateNote={handleCreateNote}
          onOpenPatientFromSearch={handleOpenPatientFromSearch}
          onSaveAssignment={handleSaveAssignment}
        />
      )}

      {user.role === "STAFF" && (
        <StaffDashboard
          currentUser={user}
          currentView={currentView}
          patients={patients}
          selectedPatient={selectedPatient}
          selectedPatientId={selectedPatientId}
          selectedPatientJournal={selectedPatientJournal}
          onSelectPatient={handleSelectPatient}
          onCreateEncounter={handleCreateEncounter}
          onCreateObservation={handleCreateObservation}
          onCreateCondition={handleCreateCondition}
          onCreateNote={handleCreateNote}
          onOpenPatientFromSearch={handleOpenPatientFromSearch}
          onSaveAssignment={handleSaveAssignment}
        />
      )}
    </>
  );
}