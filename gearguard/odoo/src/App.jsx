import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Equipment from './components/Equipment';
import MaintenanceTeam from './components/MaintenanceTeam';
import MaintenanceRequest from './components/MaintenanceRequest';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import Reports from './components/Reports';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  return (
    <Router>
      <DataProvider>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/teams" element={<MaintenanceTeam />} />
            <Route path="/requests" element={<MaintenanceRequest />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;