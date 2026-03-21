// PatientDashboard.jsx
import React from "react";
import JournalView from "../components/JournalView";
import MessagePanel from "../components/MessagePanel";
import ImagePanel from "../components/ImagePanel";

export default function PatientDashboard({
  currentUser,
  journal,
  currentView,
  onCreateEncounter,
  onCreateObservation,
  onCreateCondition,
  onCreateNote
}) {
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Patient Dashboard</h2>
      </div>

      {currentView === "dashboard" && (
        <JournalView
          journal={journal}
          currentUser={currentUser}
          onCreateEncounter={onCreateEncounter}
          onCreateObservation={onCreateObservation}
          onCreateCondition={onCreateCondition}
          onCreateNote={onCreateNote}
        />
      )}

      {currentView === "messages" && (
        <MessagePanel currentUser={currentUser} selectedPatientUserId={currentUser.id} />
      )}

      {currentView === "images" && journal?.patient?.id && (
        <ImagePanel currentUser={currentUser} patientId={journal.patient.id} />
      )}
    </div>
  );
}