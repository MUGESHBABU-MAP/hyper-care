import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, CircularProgress, Alert } from '@mui/material';
import KpiCard from '../components/KpiCard';
import Breadcrumbs from '../components/Breadcrumbs';

const DashboardPage = ({ title, endpoint }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/kpi/${endpoint}`);
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(`Failed to fetch data from ${endpoint}. ${err.message}`);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return (
        <div>
            <Breadcrumbs />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                    {title}
                </Typography>
                {data?._dataSource && (
                    <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        padding: '6px 16px',
                        borderRadius: 4,
                        backgroundColor: data._dataSource === 'SAP' ? '#4caf50' : data._dataSource === 'MOCK' ? '#ff9800' : '#2196f3',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: 1
                    }}>
                        Data Source: {data._dataSource}
                    </div>
                )}
            </div>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {data && (
                <Grid container spacing={3}>
                    {Object.entries(data)
                        .filter(([key]) => key !== '_dataSource')
                        .map(([kpiTitle, kpiData]) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={kpiTitle}>
                            <KpiCard
                                title={kpiTitle}
                                value={kpiData.value}
                                status={kpiData.status}
                                trendData={kpiData.trend}
                                dataSource={data._dataSource}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default DashboardPage;
