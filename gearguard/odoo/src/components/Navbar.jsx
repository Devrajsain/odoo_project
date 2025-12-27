import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>GearGuard</h1>
      <ul>
        <li><Link to="/">Kanban Board</Link></li>
        <li><Link to="/equipment">Equipment</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/requests">Requests</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;