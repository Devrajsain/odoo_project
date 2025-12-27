export const mockData = {
  equipment: [
    {
      id: 1,
      name: 'CNC Machine',
      serial: 'CN123',
      department: 'Production',
      employee: 'John Doe',
      team: 'Mechanics',
      technician: 'Tech1',
      purchaseDate: '2020-01-01',
      warranty: '2025-01-01',
      location: 'Floor 1',
      usable: true
    },
    {
      id: 2,
      name: 'Laptop',
      serial: 'LP456',
      department: 'IT',
      employee: 'Jane Smith',
      team: 'IT Support',
      technician: 'Tech2',
      purchaseDate: '2021-05-01',
      warranty: '2024-05-01',
      location: 'Office 2',
      usable: true
    }
  ],
  teams: [
    { id: 1, name: 'Mechanics', members: ['Tech1'] },
    { id: 2, name: 'IT Support', members: ['Tech2'] }
  ],
  requests: [
    {
      id: 1,
      type: 'Corrective',
      subject: 'Leaking Oil',
      equipmentId: 1,
      scheduledDate: null,
      duration: null,
      stage: 'New',
      assignedTo: null,
      overdue: false
    },
    {
      id: 2,
      type: 'Preventive',
      subject: 'Routine Checkup',
      equipmentId: 2,
      scheduledDate: '2023-10-15',
      duration: null,
      stage: 'New',
      assignedTo: null,
      overdue: false
    }
  ]
};