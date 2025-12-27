import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import './MaintenanceRequest.css';

const MaintenanceRequest = () => {
  const { equipment, teams, addRequest } = useContext(DataContext);
  const [form, setForm] = useState({ type: 'Corrective', subject: '', equipmentId: '', scheduledDate: '', duration: '' });

  const handleEquipmentChange = (id) => {
    const eq = equipment.find(e => e.id == id);
    setForm({ ...form, equipmentId: id, team: eq.team });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRequest({ ...form, id: Date.now(), stage: 'New', assignedTo: null, overdue: false });
    setForm({ type: 'Corrective', subject: '', equipmentId: '', scheduledDate: '', duration: '' });
  };

  return (
    <div className="request">
      <h2>Maintenance Requests</h2>
      <form onSubmit={handleSubmit}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>Corrective</option>
          <option>Preventive</option>
        </select>
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <select value={form.equipmentId} onChange={(e) => handleEquipmentChange(e.target.value)}>
          <option value="">Select Equipment</option>
          {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
        </select>
        <input type="date" placeholder="Scheduled Date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
        <input placeholder="Duration (hours)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <button type="submit">Create Request</button>
      </form>
    </div>
  );
};

export default MaintenanceRequest;