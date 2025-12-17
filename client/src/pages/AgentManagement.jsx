import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, Edit, Delete, PlayArrow, Pause, Download } from '@mui/icons-material';
import axios from 'axios';
import AgentCreationDialog from '../components/AgentCreationDialog';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setOpenDialog(true);
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setOpenDialog(true);
  };

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axios.delete(`http://localhost:4000/api/agents/${agentId}`);
        loadAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  const handleToggleAgent = async (agent) => {
    try {
      await axios.put(`http://localhost:4000/api/agents/${agent.id}`, {
        enabled: !agent.enabled
      });
      loadAgents();
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  };

  const handleDownloadReport = async (agentId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/agents/${agentId}/report?format=csv`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `agent-report-${agentId}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Monitoring Agents</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateAgent}>
          Create Agent
        </Button>
      </Box>

      <Grid container spacing={3}>
        {agents.map((agent) => (
          <Grid item xs={12} md={6} lg={4} key={agent.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6">{agent.name}</Typography>
                  <Chip 
                    label={agent.enabled ? 'Active' : 'Paused'} 
                    color={agent.enabled ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {agent.description}
                </Typography>
                <Typography variant="caption" display="block">
                  System: <strong>{agent.systemId}</strong>
                </Typography>
                <Typography variant="caption" display="block">
                  Schedule: <strong>{agent.schedule}</strong>
                </Typography>
                <Typography variant="caption" display="block">
                  KPIs: <strong>{agent.kpis.length}</strong>
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Last Run: {agent.lastRun ? new Date(agent.lastRun).toLocaleString() : 'Never'}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Next Run: {agent.nextRun ? new Date(agent.nextRun).toLocaleString() : 'N/A'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleToggleAgent(agent)}>
                  {agent.enabled ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton size="small" onClick={() => handleEditAgent(agent)}>
                  <Edit />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteAgent(agent.id)}>
                  <Delete />
                </IconButton>
                <IconButton size="small" onClick={() => handleDownloadReport(agent.id)}>
                  <Download />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {agents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No monitoring agents configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first agent to start monitoring KPIs
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateAgent}>
            Create Agent
          </Button>
        </Box>
      )}

      <AgentCreationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={loadAgents}
        agent={selectedAgent}
      />
    </Box>
  );
};

export default AgentManagement;
