import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MultiSystemOverview from './pages/MultiSystemOverview';
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
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate replace to="/systems" />} />
        <Route path="/systems" element={<MultiSystemOverview />} />
        <Route path="/systems/:systemId">
          <Route index element={<Navigate to="performance" />} />
          <Route path="overview" element={<OverviewDashboard />} />
          <Route path="system" element={<SystemDashboard />} />
          <Route path="performance" element={<PerformanceDashboard />} />
          <Route path="jobs" element={<JobDashboard />} />
          <Route path="integration" element={<IntegrationDashboard />} />
          <Route path="security" element={<SecurityDashboard />} />
          <Route path="masterdata" element={<MasterDataDashboard />} />
          <Route path="business" element={<BusinessDashboard />} />
          <Route path="incidents" element={<IncidentDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
