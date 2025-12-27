import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';
export type RequestType = 'Corrective' | 'Preventive';
export type UserRole = 'manager' | 'technician' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[];
  color: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  assignedTo?: string;
  location: string;
  purchaseDate: string;
  warrantyEnd?: string;
  maintenanceTeamId: string;
  defaultTechnicianId?: string;
  category: string;
  isScrapped: boolean;
  imageUrl?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  equipmentId: string;
  teamId: string;
  technicianId?: string;
  scheduledDate?: string;
  createdAt: string;
  duration?: number; // in minutes
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  isOverdue: boolean;
}

interface AppState {
  // Current user
  currentUser: User;
  
  // Data
  users: User[];
  teams: Team[];
  equipment: Equipment[];
  requests: MaintenanceRequest[];
  
  // Actions
  addEquipment: (equipment: Omit<Equipment, 'id' | 'isScrapped'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'isOverdue'>) => void;
  updateRequest: (id: string, request: Partial<MaintenanceRequest>) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  deleteRequest: (id: string) => void;
  
  getEquipmentRequests: (equipmentId: string) => MaintenanceRequest[];
  getTeamRequests: (teamId: string) => MaintenanceRequest[];
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial demo data
const initialUsers: User[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex@gearguard.com', role: 'manager', avatar: '' },
  { id: '2', name: 'Jordan Chen', email: 'jordan@gearguard.com', role: 'technician', teamId: '1', avatar: '' },
  { id: '3', name: 'Sam Wilson', email: 'sam@gearguard.com', role: 'technician', teamId: '2', avatar: '' },
  { id: '4', name: 'Taylor Brown', email: 'taylor@gearguard.com', role: 'technician', teamId: '1', avatar: '' },
  { id: '5', name: 'Casey Davis', email: 'casey@gearguard.com', role: 'user', avatar: '' },
];

const initialTeams: Team[] = [
  { id: '1', name: 'Mechanics', description: 'Heavy machinery and vehicle repairs', members: ['2', '4'], color: '#3B82F6' },
  { id: '2', name: 'Electricians', description: 'Electrical systems and wiring', members: ['3'], color: '#F59E0B' },
  { id: '3', name: 'IT Support', description: 'Computers and network equipment', members: [], color: '#10B981' },
];

const initialEquipment: Equipment[] = [
  { id: '1', name: 'CNC Machine Pro X200', serialNumber: 'CNC-2024-001', department: 'Production', location: 'Building A, Floor 2', purchaseDate: '2023-06-15', warrantyEnd: '2026-06-15', maintenanceTeamId: '1', defaultTechnicianId: '2', category: 'Manufacturing', isScrapped: false },
  { id: '2', name: 'Industrial Laser Cutter', serialNumber: 'ILC-2023-042', department: 'Production', location: 'Building A, Floor 1', purchaseDate: '2023-03-20', warrantyEnd: '2025-03-20', maintenanceTeamId: '1', defaultTechnicianId: '4', category: 'Manufacturing', isScrapped: false },
  { id: '3', name: 'Forklift Model FLT-500', serialNumber: 'FLT-2022-015', department: 'Warehouse', location: 'Warehouse B', purchaseDate: '2022-09-10', maintenanceTeamId: '1', defaultTechnicianId: '2', category: 'Vehicle', isScrapped: false },
  { id: '4', name: 'Server Rack Unit 42U', serialNumber: 'SRV-2024-003', department: 'IT', location: 'Data Center', purchaseDate: '2024-01-05', warrantyEnd: '2027-01-05', maintenanceTeamId: '3', category: 'IT Equipment', isScrapped: false },
  { id: '5', name: 'HVAC Central Unit', serialNumber: 'HVAC-2021-001', department: 'Facilities', location: 'Building A, Roof', purchaseDate: '2021-11-30', maintenanceTeamId: '2', defaultTechnicianId: '3', category: 'HVAC', isScrapped: false },
  { id: '6', name: 'Assembly Robot Arm R7', serialNumber: 'ARM-2024-007', department: 'Production', location: 'Building A, Floor 2', purchaseDate: '2024-02-28', warrantyEnd: '2027-02-28', maintenanceTeamId: '1', defaultTechnicianId: '2', category: 'Manufacturing', isScrapped: false },
];

const initialRequests: MaintenanceRequest[] = [
  { id: '1', subject: 'Oil Leak Detected', description: 'Minor oil leak from hydraulic system', type: 'Corrective', equipmentId: '1', teamId: '1', technicianId: '2', createdAt: '2024-12-20', status: 'New', priority: 'high', isOverdue: true },
  { id: '2', subject: 'Monthly Calibration', description: 'Routine monthly calibration check', type: 'Preventive', equipmentId: '2', teamId: '1', technicianId: '4', scheduledDate: '2024-12-28', createdAt: '2024-12-15', status: 'New', priority: 'medium', isOverdue: false },
  { id: '3', subject: 'Battery Replacement', description: 'Replace forklift main battery', type: 'Corrective', equipmentId: '3', teamId: '1', technicianId: '2', createdAt: '2024-12-22', status: 'In Progress', priority: 'high', isOverdue: false },
  { id: '4', subject: 'Network Switch Upgrade', type: 'Preventive', equipmentId: '4', teamId: '3', scheduledDate: '2024-12-30', createdAt: '2024-12-18', status: 'New', priority: 'low', isOverdue: false },
  { id: '5', subject: 'Filter Replacement', description: 'Replace air filters as scheduled', type: 'Preventive', equipmentId: '5', teamId: '2', technicianId: '3', scheduledDate: '2024-12-29', createdAt: '2024-12-10', status: 'In Progress', priority: 'medium', isOverdue: false },
  { id: '6', subject: 'Arm Joint Calibration', type: 'Preventive', equipmentId: '6', teamId: '1', scheduledDate: '2025-01-02', createdAt: '2024-12-25', status: 'New', priority: 'medium', isOverdue: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: initialUsers[0],
      users: initialUsers,
      teams: initialTeams,
      equipment: initialEquipment,
      requests: initialRequests,

      addEquipment: (equipmentData) => {
        const newEquipment: Equipment = {
          ...equipmentData,
          id: generateId(),
          isScrapped: false,
        };
        set((state) => ({ equipment: [...state.equipment, newEquipment] }));
      },

      updateEquipment: (id, updates) => {
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      deleteEquipment: (id) => {
        set((state) => ({
          equipment: state.equipment.filter((e) => e.id !== id),
        }));
      },

      addTeam: (teamData) => {
        const newTeam: Team = {
          ...teamData,
          id: generateId(),
        };
        set((state) => ({ teams: [...state.teams, newTeam] }));
      },

      updateTeam: (id, updates) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
        }));
      },

      addRequest: (requestData) => {
        const newRequest: MaintenanceRequest = {
          ...requestData,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
          isOverdue: false,
        };
        set((state) => ({ requests: [...state.requests, newRequest] }));
      },

      updateRequest: (id, updates) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      updateRequestStatus: (id, status) => {
        set((state) => {
          const newRequests = state.requests.map((r) => {
            if (r.id !== id) return r;
            
            // If moving to Scrap, mark equipment as scrapped
            if (status === 'Scrap') {
              const request = state.requests.find((req) => req.id === id);
              if (request) {
                const equipment = state.equipment.find((e) => e.id === request.equipmentId);
                if (equipment) {
                  get().updateEquipment(equipment.id, { isScrapped: true });
                }
              }
            }
            
            return { ...r, status };
          });
          return { requests: newRequests };
        });
      },

      deleteRequest: (id) => {
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }));
      },

      getEquipmentRequests: (equipmentId) => {
        return get().requests.filter((r) => r.equipmentId === equipmentId);
      },

      getTeamRequests: (teamId) => {
        return get().requests.filter((r) => r.teamId === teamId);
      },
    }),
    {
      name: 'gearguard-storage',
    }
  )
);
