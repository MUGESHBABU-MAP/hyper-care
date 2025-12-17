import React, { useContext } from 'react';
import { SystemContext } from '../context/SystemContext';
import SystemCard from '../components/SystemCard';
import { Grid, Container, Typography, Box } from '@mui/material';

const MultiSystemOverview = () => {
  const { systems } = useContext(SystemContext);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Systems Overview
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          At-a-glance health summary of all connected SAP systems.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {systems.map((system) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={system.systemId}>
            <SystemCard system={system} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MultiSystemOverview;
