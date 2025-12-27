import React, { createContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [equipment, setEquipment] = useState(mockData.equipment);
  const [teams, setTeams] = useState(mockData.teams);
  const [requests, setRequests] = useState(mockData.requests);

  const addEquipment = (item) => setEquipment([...equipment, item]);
  const addTeam = (item) => setTeams([...teams, item]);
  const addRequest = (item) => setRequests([...requests, item]);
  const updateRequest = (id, updates) => {
    setRequests(requests.map(req => req.id === id ? { ...req, ...updates } : req));
  };

  return (
    <DataContext.Provider value={{
      equipment, teams, requests, addEquipment, addTeam, addRequest, updateRequest
    }}>
      {children}
    </DataContext.Provider>
  );
};