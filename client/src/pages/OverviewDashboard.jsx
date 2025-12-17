import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, CircularProgress, Alert, Card, CardContent, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';
import KpiCard from '../components/KpiCard';
import Breadcrumbs from '../components/Breadcrumbs';

const sections = [
    { title: 'System Connectivity', endpoint: 'system', path: '/dashboard/system', color: '#0066cc' },
    { title: 'Performance', endpoint: 'performance', path: '/dashboard/performance', color: '#00a3e0' },
    { title: 'Jobs & Batch', endpoint: 'jobs', path: '/dashboard/jobs', color: '#7c4dff' },
    { title: 'Integration', endpoint: 'integration', path: '/dashboard/integration', color: '#ff6f00' },
    { title: 'Security', endpoint: 'security', path: '/dashboard/security', color: '#d32f2f' },
    { title: 'Master Data', endpoint: 'masterdata', path: '/dashboard/masterdata', color: '#388e3c' },
    { title: 'Business Process', endpoint: 'business', path: '/dashboard/business', color: '#1976d2' },
    { title: 'Incidents', endpoint: 'incidents', path: '/dashboard/incidents', color: '#f57c00' },
    { title: 'SAP System Information', endpoint: 'systeminfo', path: '/dashboard/systeminfo', color: '#607d8b' },
];

const OverviewDashboard = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] =  useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const promises = sections.map(section =>
                    axios.get(`/api/kpi/${section.endpoint}`)
                        .then(res => ({ [section.endpoint]: res.data }))
                        .catch(error => {
                            console.error(`Error fetching data for ${section.endpoint}:`, error);
                            return { [section.endpoint]: null };
                        })
                );
                const results = await Promise.all(promises);
                const combinedData = Object.assign({}, ...results);
                setData(combinedData);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const systemInfoSection = data['systeminfo'];
    const sapSystemInfo = systemInfoSection && systemInfoSection['SAP System Information'];

    return (
        <div>
            <Breadcrumbs />
            <Typography variant="h4" gutterBottom sx={{ color: '#1a1a1a', fontWeight: 600, mb: 1 }}>
                SAP System Overview
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                Real-time monitoring of all critical SAP system components
            </Typography>


            {sapSystemInfo && (
                <Card
                    sx={{
                        mb: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 24,
                                        backgroundColor: '#607d8b', // Color for System Info
                                        borderRadius: 1
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                    SAP System Information
                                </Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            {Object.entries(sapSystemInfo).map(([key, value]) => (
                                <Grid item xs={12} sm={6} md={4} key={key}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#555' }}>
                                        {key}:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333' }}>
                                        {value || 'N/A'}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {sections.filter(section => section.endpoint !== 'systeminfo').map((section) => {
                const sectionData = data[section.endpoint];
                if (!sectionData) return null;

                const kpiEntries = Object.entries(sectionData).filter(([key]) => key !== '_dataSource').slice(0, 4);

                return (
                    <Card 
                        key={section.endpoint} 
                        sx={{ 
                            mb: 3, 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box 
                                        sx={{ 
                                            width: 4, 
                                            height: 24, 
                                            backgroundColor: section.color,
                                            borderRadius: 1
                                        }} 
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                        {section.title}
                                    </Typography>
                                </Box>
                                <Button
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate(section.path)}
                                    sx={{ textTransform: 'none', fontWeight: 500 }}
                                >
                                    View Details
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {kpiEntries.map(([kpiTitle, kpiData]) => (
                                    <Grid item xs={12} sm={6} md={3} key={kpiTitle}>
                                        <KpiCard
                                            title={kpiTitle}
                                            value={kpiData.value}
                                            status={kpiData.status}
                                            trendData={kpiData.trend}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                );
            })}

        </div>
    );
};

export default OverviewDashboard;
