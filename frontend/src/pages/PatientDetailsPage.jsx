// PatientDetailsPage.jsx
import React from "react";
import JournalView from "../components/JournalView";
import ImagePanel from "../components/ImagePanel";
import MessagePanel from "../components/MessagePanel";

export default function PatientDetailsPage({
  currentUser,
  journal,
  onCreateEncounter,
  onCreateObservation,
  onCreateCondition,
  onCreateNote
}) {
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Patientdetaljer</h2>
      </div>

      <JournalView
        journal={journal}
        currentUser={currentUser}
        onCreateEncounter={onCreateEncounter}
        onCreateObservation={onCreateObservation}
        onCreateCondition={onCreateCondition}
        onCreateNote={onCreateNote}
      />

      {journal?.patient?.id && (
        <ImagePanel currentUser={currentUser} patientId={journal.patient.id} />
      )}

      <MessagePanel
        currentUser={currentUser}
        selectedPatientUserId={journal?.patient?.userId}
      />
    </div>
  );
}