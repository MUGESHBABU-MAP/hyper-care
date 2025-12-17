import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
    green: '#4caf50',
    yellow: '#ffc107',
    red: '#f44336',
    neutral: '#9e9e9e',
};

const KpiCard = ({ title, value, status = 'neutral', trendData = [], dataSource }) => {
    const statusColor = STATUS_COLORS[status] || STATUS_COLORS.neutral;

    const getDataSourceColor = () => {
        if (dataSource === 'SAP') return '#4caf50';
        if (dataSource === 'MOCK') return '#ff9800';
        if (dataSource === 'MIXED') return '#2196f3';
        return '#9e9e9e';
    };

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                border: '1px solid #e0e0e0',
                borderRadius: 2
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 13, color: '#666', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {title}
                    </Typography>
                    {dataSource && (
                        <Box sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                            backgroundColor: getDataSourceColor(),
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }}>
                            {dataSource}
                        </Box>
                    )}
                </Box>
                <Typography variant="h4" component="div" sx={{ color: '#1a1a1a', fontWeight: 700, mt: 1 }}>
                    {value}
                </Typography>
            </CardContent>
            <Box sx={{ height: 60, ml: 2 }}>
                <ResponsiveContainer width="95%" height="100%">
                    <LineChart data={trendData}>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 4 }}
                            labelStyle={{ color: '#333' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={statusColor}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
             <Box sx={{
                height: '4px',
                backgroundColor: statusColor,
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px'
                }}
            />
        </Card>
    );
};

export default KpiCard;
