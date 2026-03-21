// JournalView.jsx
import React, { useState } from "react";
import EncounterList from "./EncounterList";
import ObservationList from "./ObservationList";
import ConditionList from "./ConditionList";

export default function JournalView({
  journal,
  currentUser,
  onCreateEncounter,
  onCreateObservation,
  onCreateCondition,
  onCreateNote
}) {
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState("GENERAL");

  if (!journal) {
    return <div className="card">Ingen journal laddad ännu.</div>;
  }

  function handleNoteSubmit(e) {
    e.preventDefault();
    onCreateNote({
      noteText,
      noteType,
      createdByUserId: currentUser.id
    });
    setNoteText("");
    setNoteType("GENERAL");
  }

  return (
    <div>
      <div className="card">
        <h2 className="title">
          Journal: {journal.patient.firstName} {journal.patient.lastName}
        </h2>
        <div>UserId: {journal.patient.userId}</div>
        <div>Adress: {journal.patient.address}</div>
        <div>Telefon: {journal.patient.phoneNumber}</div>
        <div>DoctorUserId: {journal.patient.assignedDoctorUserId}</div>
        <div>StaffUserId: {journal.patient.assignedStaffUserId}</div>
      </div>

      <EncounterList
        encounters={journal.encounters}
        currentUser={currentUser}
        onCreateEncounter={onCreateEncounter}
      />

      <ObservationList
        observations={journal.observations}
        encounters={journal.encounters}
        currentUser={currentUser}
        onCreateObservation={onCreateObservation}
      />

      <ConditionList
        conditions={journal.conditions}
        currentUser={currentUser}
        onCreateCondition={onCreateCondition}
      />

      <div className="card">
        <h3 className="title">Clinical Notes</h3>

        {(currentUser.role === "DOCTOR" || currentUser.role === "STAFF") && (
          <form onSubmit={handleNoteSubmit}>
            <select value={noteType} onChange={(e) => setNoteType(e.target.value)}>
              <option value="GENERAL">GENERAL</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="STAFF">STAFF</option>
              <option value="JOURNAL">JOURNAL</option>
            </select>
            <textarea
              style={{ width: "100%" }}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Skriv journalanteckning"
            />
            <button type="submit">Spara anteckning</button>
          </form>
        )}

        {journal.clinicalNotes.map((note) => (
          <div key={note.id} className="card">
            <strong>{note.noteType}</strong>
            <div>{note.noteText}</div>
            <div className="small">
              {note.createdAt} | skapad av user {note.createdByUserId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}