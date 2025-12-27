import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import './CalendarView.css';

const CalendarView = () => {
  const { requests, addRequest } = useContext(DataContext);

  const preventiveRequests = requests.filter(r => r.type === 'Preventive');

  const handleDateClick = (date) => {
    addRequest({
      id: Date.now(),
      type: 'Preventive',
      subject: 'New Preventive',
      equipmentId: 1, // Default to first equipment; can be made dynamic
      scheduledDate: date,
      duration: null,
      stage: 'New',
      assignedTo: null,
      overdue: false
    });
  };

  return (
    <div className="calendar">
      <h2>Calendar View</h2>
      <div className="calendar-grid">
        {Array.from({ length: 30 }, (_, i) => {
          const date = `2023-10-${String(i + 1).padStart(2, '0')}`;
          const dayRequests = preventiveRequests.filter(r => r.scheduledDate === date);
          return (
            <div key={date} className="calendar-day" onClick={() => handleDateClick(date)}>
              <h4>{date}</h4>
              {dayRequests.map(req => <p key={req.id}>{req.subject}</p>)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;