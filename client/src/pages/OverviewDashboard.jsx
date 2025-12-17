import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SystemContext } from '../context/SystemContext';
import { Box, Typography, Grid } from '@mui/material';
import KpiCard from '../components/KpiCard';

const OverviewDashboard = () => {
    const { systemId } = useParams();
    const { getSystemById } = useContext(SystemContext);
    const [system, setSystem] = useState(null);

    useEffect(() => {
        const currentSystem = getSystemById(systemId);
        setSystem(currentSystem);
    }, [systemId, getSystemById]);

    if (!system) {
        return <Typography>System not found.</Typography>;
    }

    const overviewKpis = [
        { title: 'CPU Load', value: `${system.kpis.cpuLoad}%` },
        { title: 'Active Users', value: system.kpis.activeUsers },
        { title: 'Failed Jobs (24h)', value: system.kpis.failedJobs },
        { title: 'Avg. Response Time', value: `${system.kpis.avgResponseTime}ms` },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Overview: <span style={{ color: '#0066cc' }}>{system.systemName}</span>
            </Typography>
            <Grid container spacing={3}>
                {overviewKpis.map(kpi => (
                    <Grid item xs={12} sm={6} md={3} key={kpi.title}>
                        <KpiCard title={kpi.title} value={kpi.value} trend="stable" />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default OverviewDashboard;
