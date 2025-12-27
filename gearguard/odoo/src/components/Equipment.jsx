import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import './Equipment.css';

const Equipment = () => {
  const { equipment, addEquipment, requests } = useContext(DataContext);
  const [form, setForm] = useState({ name: '', serial: '', department: '', employee: '', team: '', technician: '', purchaseDate: '', warranty: '', location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addEquipment({ ...form, id: Date.now(), usable: true });
    setForm({ name: '', serial: '', department: '', employee: '', team: '', technician: '', purchaseDate: '', warranty: '', location: '' });
  };

  const getOpenRequests = (id) => requests.filter(r => r.equipmentId === id && r.stage !== 'Repaired').length;

  return (
    <div className="equipment">
      <h2>Equipment</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Serial" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} required />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <input placeholder="Employee" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} />
        <input placeholder="Team" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} />
        <input placeholder="Technician" value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} />
        <input type="date" placeholder="Purchase Date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
        <input type="date" placeholder="Warranty" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <button type="submit">Add Equipment</button>
      </form>
      <ul>
        {equipment.map(item => (
          <li key={item.id}>
            {item.name} - {item.serial} - {item.department}
            <button className="maintenance-btn" onClick={() => alert(`Open requests: ${getOpenRequests(item.id)}`)}>
              Maintenance ({getOpenRequests(item.id)})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Equipment;