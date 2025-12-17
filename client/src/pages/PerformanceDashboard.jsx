import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SystemContext } from '../context/SystemContext';
import { Box, Typography, Grid, Paper } from '@mui/material';
import Breadcrumbs from '../components/Breadcrumbs';
import KpiCard from '../components/KpiCard';

const PerformanceDashboard = () => {
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

    // Mock data for this specific dashboard
    const performanceKpis = [
        { title: 'Dialog Response Time', value: `${system.kpis.avgResponseTime}ms`, trend: 'up' },
        { title: 'CPU Utilization', value: `${system.kpis.cpuLoad}%`, trend: system.kpis.cpuLoad > 80 ? 'up' : 'stable' },
        { title: 'Active Users', value: system.kpis.activeUsers, trend: 'stable' },
        { title: 'Database Lock Time', value: '25ms', trend: 'down' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Performance: <span style={{ color: '#0066cc' }}>{system.systemName}</span>
            </Typography>
            <Grid container spacing={3}>
                {performanceKpis.map(kpi => (
                    <Grid item xs={12} sm={6} md={3} key={kpi.title}>
                        <KpiCard title={kpi.title} value={kpi.value} trend={kpi.trend} />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">Detailed performance charts would be displayed here.</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PerformanceDashboard;
