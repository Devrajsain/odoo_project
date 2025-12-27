import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import './MaintenanceTeam.css';

const MaintenanceTeam = () => {
  const { teams, addTeam } = useContext(DataContext);
  const [form, setForm] = useState({ name: '', members: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTeam({ ...form, id: Date.now(), members: form.members.split(',') });
    setForm({ name: '', members: '' });
  };

  return (
    <div className="team">
      <h2>Maintenance Teams</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Team Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Members (comma-separated)" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} />
        <button type="submit">Add Team</button>
      </form>
      <ul>
        {teams.map(team => (
          <li key={team.id}>{team.name} - Members: {team.members.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceTeam;