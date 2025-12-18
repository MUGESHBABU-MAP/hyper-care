import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import KpiCard from '../components/KpiCard';
import { SystemContext } from '../context/SystemContext';
import SystemCard from '../components/SystemCard';

const OverviewDashboard = () => {
    const { systemId } = useParams();
    const { getSystemById } = useContext(SystemContext);
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('overview');

    useEffect(() => {
        let cancelled = false;
        const fetchKpis = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/kpi/kpis');
                if (!res.ok) throw new Error(`API error ${res.status}`);
                const body = await res.json();
                if (!cancelled) setKpis(body.kpis || []);
            } catch (err) {
                if (!cancelled) setError((err && err.message) ? `${err.message}\n${err.stack || ''}` : 'Failed to fetch KPIs');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchKpis();
        return () => { cancelled = true; };
    }, []);

    if (loading) return <Typography>Loading KPIs…</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const system = systemId ? getSystemById(systemId) : null;

    const visibleKpis = kpis.filter(k => k.active !== false);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {system ? `System Overview: ${system.systemName}` : 'System Overview'}
            </Typography>

            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="system tabs" sx={{ mb: 3 }}>
                <Tab label="Overview" value="overview" />
                {visibleKpis.map(k => (
                    <Tab key={k.id} label={k.name} value={k.id} />
                ))}
            </Tabs>

            {selectedTab === 'overview' && system && (
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <SystemCard system={system} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            {/* Optionally show a subset of top KPIs in overview — show first 4 active KPIs */}
                            <Grid container spacing={2}>
                                {visibleKpis.slice(0, 4).map(k => (
                                    <Grid item xs={12} sm={6} key={k.id}>
                                        <KpiCard title={k.name} value={k.sample?.value ?? 'N/A'} status={k.sample?.status} trendData={k.sample?.trend || []} dataSource={k.dataSource} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {selectedTab !== 'overview' && (
                <Box>
                    {visibleKpis.filter(k => k.id === selectedTab).map(k => (
                        <Box key={k.id} sx={{ maxWidth: 760 }}>
                            <KpiCard title={k.name} value={k.sample?.value ?? 'N/A'} status={k.sample?.status} trendData={k.sample?.trend || []} dataSource={k.dataSource} />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default OverviewDashboard;
