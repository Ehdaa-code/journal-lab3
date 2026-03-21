
import React, { useEffect, useState } from "react";
import { getUsersByRole } from "../services/authService";

export default function AssignmentPanel({
  selectedPatient,
  onSaveAssignment
}) {
  const [doctors, setDoctors] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);

  const [assignedDoctorUserId, setAssignedDoctorUserId] = useState("");
  const [assignedStaffUserId, setAssignedStaffUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setAssignedDoctorUserId(selectedPatient.assignedDoctorUserId || "");
      setAssignedStaffUserId(selectedPatient.assignedStaffUserId || "");
      setMessage("");
      setError("");
    }
  }, [selectedPatient]);

  async function loadUsers() {
    try {
      const doctorList = await getUsersByRole("DOCTOR");
      const staffList = await getUsersByRole("STAFF");
      setDoctors(doctorList);
      setStaffUsers(staffList);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      setMessage("");
      setError("");

      await onSaveAssignment({
        assignedDoctorUserId: assignedDoctorUserId ? Number(assignedDoctorUserId) : null,
        assignedStaffUserId: assignedStaffUserId ? Number(assignedStaffUserId) : null
      });

      setMessage("Tilldelning sparad");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="card">
      <h3 className="title">Tilldela ansvarig doctor/staff</h3>

      {!selectedPatient ? (
        <div>Välj först en patient.</div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="small" style={{ marginBottom: 8 }}>
            Patient: {selectedPatient.firstName} {selectedPatient.lastName}
          </div>

          <div>
            <label>Doctor</label>
            <select
              style={{ width: "100%" }}
              value={assignedDoctorUserId}
              onChange={(e) => setAssignedDoctorUserId(e.target.value)}
            >
              <option value="">-- ingen doctor vald --</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName} (userId: {doctor.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Staff</label>
            <select
              style={{ width: "100%" }}
              value={assignedStaffUserId}
              onChange={(e) => setAssignedStaffUserId(e.target.value)}
            >
              <option value="">-- ingen staff vald --</option>
              {staffUsers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.firstName} {staff.lastName} (userId: {staff.id})
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Spara tilldelning</button>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}