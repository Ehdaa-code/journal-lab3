
import React from "react";
import PatientSelector from "../components/PatientSelector";
import JournalView from "../components/JournalView";
import MessagePanel from "../components/MessagePanel";
import ImagePanel from "../components/ImagePanel";
import SearchPanel from "../components/SearchPanel";
import AssignmentPanel from "../components/AssignmentPanel";

export default function DoctorDashboard({
  currentUser,
  currentView,
  patients,
  selectedPatient,
  selectedPatientId,
  selectedPatientJournal,
  onSelectPatient,
  onCreateEncounter,
  onCreateObservation,
  onCreateCondition,
  onCreateNote,
  onOpenPatientFromSearch,
  onSaveAssignment
}) {
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Doctor Dashboard</h2>
      </div>

      <PatientSelector
        patients={patients}
        selectedPatientId={selectedPatientId}
        onSelect={onSelectPatient}
      />

      <AssignmentPanel
        selectedPatient={selectedPatient}
        onSaveAssignment={onSaveAssignment}
      />

      {currentView === "dashboard" && (
        <JournalView
          journal={selectedPatientJournal}
          currentUser={currentUser}
          onCreateEncounter={onCreateEncounter}
          onCreateObservation={onCreateObservation}
          onCreateCondition={onCreateCondition}
          onCreateNote={onCreateNote}
        />
      )}

      {currentView === "messages" && (
        <MessagePanel
          currentUser={currentUser}
          selectedPatientUserId={selectedPatientJournal?.patient?.userId}
        />
      )}

      {currentView === "images" && selectedPatientJournal?.patient?.id && (
        <ImagePanel currentUser={currentUser} patientId={selectedPatientJournal.patient.id} />
      )}

      {currentView === "search" && (
        <SearchPanel currentUser={currentUser} onOpenPatient={onOpenPatientFromSearch} />
      )}
    </div>
  );
}