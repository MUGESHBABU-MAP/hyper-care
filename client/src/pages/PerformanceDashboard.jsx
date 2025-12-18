import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SystemContext } from '../context/SystemContext';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import KpiCard from '../components/KpiCard';

// Mock function to simulate fetching KPI definitions as described in the documentation
// In a real implementation, this would be an API call e.g., to GET /api/kpi-definitions
const getKpiDefinitions = async () => {
    // This mock data is based on QUICK_REFERENCE.md and AGENT_FEATURES.md
    return [
        { id: 'dialogResponseTime', title: 'Dialog Response Time', category: 'Performance', value: '120ms', trend: 'down' },
        { id: 'rfcErrorsVolume', title: 'RFC Errors Volume', category: 'Performance', value: '5', trend: 'up' },
        { id: 'cpuUtilization', title: 'CPU Utilization', category: 'Performance', value: '65%', trend: 'stable' },
        { id: 'activeUsers', title: 'Active Users', category: 'Performance', value: '450', trend: 'stable' },
    ];
};

const PerformanceDashboard = () => {
    const { systemId } = useParams();
    const { getSystemById } = useContext(SystemContext);
    const [system, setSystem] = useState(null);
    const [performanceKpis, setPerformanceKpis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentSystem = getSystemById(systemId);
        setSystem(currentSystem);

        const fetchKpis = async () => {
            setLoading(true);
            // Fetching KPI definitions as planned in the architecture
            const kpis = await getKpiDefinitions();
            setPerformanceKpis(kpis);
            setLoading(false);
        };

        if (currentSystem) {
            fetchKpis();
        }
    }, [systemId, getSystemById]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!system) {
        return <Typography>System not found.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Performance: <span style={{ color: '#0066cc' }}>{system.systemName}</span>
            </Typography>
            <Grid container spacing={3}>
                {performanceKpis.map((kpi) => (
                    <Grid item xs={12} sm={6} md={3} key={kpi.id}>
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
