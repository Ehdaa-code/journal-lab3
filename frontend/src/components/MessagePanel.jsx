import React, { useEffect, useState } from "react";
import {
  createThread,
  replyToThread,
  getPatientThreads,
  getStaffThreads,
  getThread
} from "../services/messageService";

export default function MessagePanel({ currentUser, selectedPatientUserId }) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThreadForm, setNewThreadForm] = useState({
    patientUserId: selectedPatientUserId || "",
    staffUserId: "",
    subject: "",
    content: ""
  });
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadThreads();
  }, [currentUser, selectedPatientUserId]);

  async function loadThreads() {
    try {
      setError("");
      if (currentUser.role === "PATIENT") {
        const data = await getPatientThreads(currentUser.id);
        setThreads(data);
      } else {
        const data = await getStaffThreads(currentUser.id);
        setThreads(data);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function openThread(threadId) {
    try {
      const data = await getThread(threadId);
      setSelectedThread(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateThread(e) {
    e.preventDefault();
    try {
      const payload = {
        patientUserId: currentUser.role === "PATIENT" ? currentUser.id : Number(newThreadForm.patientUserId),
        staffUserId: currentUser.role === "PATIENT" ? Number(newThreadForm.staffUserId) : currentUser.id,
        subject: newThreadForm.subject,
        senderUserId: currentUser.id,
        senderRole: currentUser.role,
        content: newThreadForm.content
      };

      const created = await createThread(payload);
      setSelectedThread(created);
      setNewThreadForm({
        patientUserId: selectedPatientUserId || "",
        staffUserId: "",
        subject: "",
        content: ""
      });
      await loadThreads();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleReply(e) {
    e.preventDefault();
    try {
      await replyToThread(selectedThread.thread.id, {
        senderUserId: currentUser.id,
        senderRole: currentUser.role,
        content: replyText
      });
      setReplyText("");
      await openThread(selectedThread.thread.id);
      await loadThreads();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h3 className="title">Konversationer</h3>
          {threads.map((thread) => (
            <div key={thread.id} className="card">
              <div><strong>{thread.subject}</strong></div>
              <div className="small">PatientUserId: {thread.patientUserId}</div>
              <div className="small">StaffUserId: {thread.staffUserId}</div>
              <button onClick={() => openThread(thread.id)}>Öppna</button>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="title">Ny konversation</h3>
          <form onSubmit={handleCreateThread}>
            {currentUser.role !== "PATIENT" && (
              <input
                placeholder="Patient userId"
                value={newThreadForm.patientUserId}
                onChange={(e) => setNewThreadForm({ ...newThreadForm, patientUserId: e.target.value })}
              />
            )}

            {currentUser.role === "PATIENT" && (
              <input
                placeholder="Doctor/Staff userId"
                value={newThreadForm.staffUserId}
                onChange={(e) => setNewThreadForm({ ...newThreadForm, staffUserId: e.target.value })}
              />
            )}

            <input
              placeholder="Subject"
              value={newThreadForm.subject}
              onChange={(e) => setNewThreadForm({ ...newThreadForm, subject: e.target.value })}
            />
            <textarea
              placeholder="Meddelande"
              value={newThreadForm.content}
              onChange={(e) => setNewThreadForm({ ...newThreadForm, content: e.target.value })}
            />
            <button type="submit">Skapa tråd</button>
          </form>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <h3 className="title">Vald konversation</h3>
          {selectedThread ? (
            <>
              <div><strong>{selectedThread.thread.subject}</strong></div>
              {selectedThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.senderRole === "PATIENT" ? "patient-msg" : "staff-msg"}`}
                >
                  <div><strong>{msg.senderRole}</strong> (user {msg.senderUserId})</div>
                  <div>{msg.content}</div>
                  <div className="small">{msg.sentAt}</div>
                </div>
              ))}
              <form onSubmit={handleReply}>
                <textarea
                  style={{ width: "100%" }}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Skriv svar"
                />
                <button type="submit">Skicka svar</button>
              </form>
            </>
          ) : (
            <div>Välj en konversation</div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}