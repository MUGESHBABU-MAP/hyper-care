import React, { createContext, useState, useMemo } from 'react';

// Mock data representing the summary fetched from the backend
// In a real app, this would come from an API call e.g., in a useEffect
const MOCK_SYSTEMS_SUMMARY = [
  {
    systemId: 'SAP-PRD-100',
    systemName: 'SAP Production (Client 100)',
    systemType: 'Production',
    status: 'Healthy',
    statusColor: '#4caf50', // Green
    kpis: {
      cpuLoad: 34,
      activeUsers: 250,
      failedJobs: 1,
      avgResponseTime: 120,
    },
  },
  {
    systemId: 'SAP-QA-200',
    systemName: 'SAP QA (Client 200)',
    systemType: 'QA',
    status: 'Warning',
    statusColor: '#ff9800', // Amber
    kpis: {
      cpuLoad: 78,
      activeUsers: 45,
      failedJobs: 12,
      avgResponseTime: 850,
    },
  },
  {
    systemId: 'SAP-DEV-300',
    systemName: 'SAP Development (Client 300)',
    systemType: 'Development',
    status: 'Error',
    statusColor: '#f44336', // Red
    kpis: {
      cpuLoad: 95,
      activeUsers: 5,
      failedJobs: 48,
      avgResponseTime: 2100,
    },
  },
    {
    systemId: 'SAP-PREPROD-100',
    systemName: 'SAP Pre-Production (Client 100)',
    systemType: 'Staging',
    status: 'Healthy',
    statusColor: '#4caf50', // Green
    kpis: {
      cpuLoad: 25,
      activeUsers: 150,
      failedJobs: 0,
      avgResponseTime: 150,
    },
  },
];


export const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [systems] = useState(MOCK_SYSTEMS_SUMMARY);

  const getSystemById = (systemId) => {
    return systems.find((sys) => sys.systemId === systemId);
  };

  const value = useMemo(() => ({
    systems,
    getSystemById,
  }), [systems]);

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};
