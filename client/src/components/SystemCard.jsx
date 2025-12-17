import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, Typography, Box, Chip } from '@mui/material';

const kpiStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5,
  borderBottom: '1px solid #eee',
  '&:last-child': {
    borderBottom: 'none',
  },
};

const SystemCard = ({ system }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/systems/${system.systemId}/performance`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `5px solid ${system.statusColor}`,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)'
        },
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" gutterBottom>
            {system.systemName}
          </Typography>
          <Chip label={system.systemType} size="small" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: system.statusColor, mr: 1 }} />
            <Typography variant="subtitle1" component="div" sx={{ color: system.statusColor }}>
                {system.status}
            </Typography>
        </Box>

        <Box>
          <Box sx={kpiStyles}>
            <Typography variant="body2">CPU Load</Typography>
            <Typography variant="body2" fontWeight="bold">{system.kpis.cpuLoad}%</Typography>
          </Box>
          <Box sx={kpiStyles}>
            <Typography variant="body2">Active Users</Typography>
            <Typography variant="body2" fontWeight="bold">{system.kpis.activeUsers}</Typography>
          </Box>
          <Box sx={kpiStyles}>
            <Typography variant="body2">Failed Jobs (24h)</Typography>
            <Typography variant="body2" fontWeight="bold">{system.kpis.failedJobs}</Typography>
          </Box>
          <Box sx={kpiStyles}>
            <Typography variant="body2">Avg. Response Time</Typography>
            <Typography variant="body2" fontWeight="bold">{system.kpis.avgResponseTime}ms</Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button variant="contained" size="small" onClick={handleNavigate}>View Details</Button>
      </CardActions>
    </Card>
  );
};

export default SystemCard;
