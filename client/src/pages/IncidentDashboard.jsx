import React from 'react';
import DashboardPage from './DashboardPage';

const IncidentDashboard = () => {
    return (
        <DashboardPage
            title="Incident & Support KPIs (ServiceNow)"
            endpoint="incidents"
        />
    );
};

export default IncidentDashboard;
