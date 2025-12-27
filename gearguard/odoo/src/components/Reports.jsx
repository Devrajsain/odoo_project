import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import './Reports.css';

const Reports = () => {
  const { requests, teams, equipment } = useContext(DataContext);

  // Calculate requests per team
  const requestsPerTeam = teams.map(team => ({
    name: team.name,
    count: requests.filter(req => {
      const eq = equipment.find(e => e.id === req.equipmentId);
      return eq && eq.team === team.name;
    }).length
  }));

  // Calculate requests per equipment category (using department as category)
  const requestsPerCategory = {};
  equipment.forEach(eq => {
    const category = eq.department;
    requestsPerCategory[category] = (requestsPerCategory[category] || 0) + requests.filter(req => req.equipmentId === eq.id).length;
  });
  const categoryData = Object.entries(requestsPerCategory).map(([category, count]) => ({ name: category, count }));

  return (
    <div className="reports">
      <h2>Reports</h2>
      
      <div className="report-section">
        <h3>Requests per Team</h3>
        <div className="chart">
          {requestsPerTeam.map(item => (
            <div key={item.name} className="bar-container">
              <span className="bar-label">{item.name}: {item.count}</span>
              <div className="bar" style={{ width: `${item.count * 20}px` }}></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="report-section">
        <h3>Requests per Equipment Category (Department)</h3>
        <div className="chart">
          {categoryData.map(item => (
            <div key={item.name} className="bar-container">
              <span className="bar-label">{item.name}: {item.count}</span>
              <div className="bar" style={{ width: `${item.count * 20}px` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;