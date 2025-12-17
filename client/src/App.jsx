import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import OverviewDashboard from './pages/OverviewDashboard';
import SystemDashboard from './pages/SystemDashboard';
import PerformanceDashboard from './pages/PerformanceDashboard';
import JobDashboard from './pages/JobDashboard';
import IntegrationDashboard from './pages/IntegrationDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import MasterDataDashboard from './pages/MasterDataDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import IncidentDashboard from './pages/IncidentDashboard';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard/overview" />} />
        <Route path="/dashboard/overview" element={<OverviewDashboard />} />
        <Route path="/dashboard/system" element={<SystemDashboard />} />
        <Route path="/dashboard/performance" element={<PerformanceDashboard />} />
        <Route path="/dashboard/jobs" element={<JobDashboard />} />
        <Route path="/dashboard/integration" element={<IntegrationDashboard />} />
        <Route path="/dashboard/security" element={<SecurityDashboard />} />
        <Route path="/dashboard/masterdata" element={<MasterDataDashboard />} />
        <Route path="/dashboard/business" element={<BusinessDashboard />} />
        <Route path="/dashboard/incidents" element={<IncidentDashboard />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
