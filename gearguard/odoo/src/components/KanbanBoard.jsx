import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const { requests, updateRequest, equipment } = useContext(DataContext);

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];

  const moveRequest = (id, newStage) => {
    const req = requests.find(r => r.id === id);
    if (newStage === 'Scrap') {
      const eq = equipment.find(e => e.id === req.equipmentId);
      eq.usable = false; // Scrap logic
    }
    updateRequest(id, { stage: newStage, overdue: new Date() > new Date(req.scheduledDate) });
  };

  return (
    <div className="kanban">
      <h2>Kanban Board</h2>
      <div className="kanban-board">
        {stages.map(stage => (
          <div key={stage} className="kanban-column">
            <h3>{stage}</h3>
            {requests.filter(r => r.stage === stage).map(req => (
              <div key={req.id} className={`kanban-card ${req.overdue ? 'overdue' : ''}`}>
                <p>{req.subject}</p>
                <p>Assigned: {req.assignedTo || 'None'}</p>
                <button onClick={() => moveRequest(req.id, stages[(stages.indexOf(stage) + 1) % stages.length])}>Move Next</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;