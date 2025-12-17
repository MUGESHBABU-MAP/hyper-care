import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip,
  Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import axios from 'axios';
import KPIFrequencyBadge from './KPIFrequencyBadge';

const AgentCreationDialog = ({ open, onClose, onSave, agent }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemId: 'S4HANA_PROD',
    schedule: 'daily',
    kpis: []
  });
  const [kpisByCategory, setKpisByCategory] = useState({});

  useEffect(() => {
    if (open) {
      loadKPIDefinitions();
      if (agent) {
        setFormData({
          name: agent.name,
          description: agent.description,
          systemId: agent.systemId,
          schedule: agent.schedule,
          kpis: agent.kpis
        });
      } else {
        setFormData({
          name: '',
          description: '',
          systemId: 'S4HANA_PROD',
          schedule: 'daily',
          kpis: []
        });
      }
    }
  }, [open, agent]);

  const loadKPIDefinitions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/kpi-definitions/by-category');
      setKpisByCategory(response.data);
    } catch (error) {
      console.error('Error loading KPI definitions:', error);
    }
  };

  const handleKPIToggle = (kpiId) => {
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.includes(kpiId)
        ? prev.kpis.filter(id => id !== kpiId)
        : [...prev.kpis, kpiId]
    }));
  };

  const handleSave = async () => {
    try {
      if (agent) {
        await axios.put(`http://localhost:4000/api/agents/${agent.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/agents', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{agent ? 'Edit Agent' : 'Create New Agent'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Agent Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>System</InputLabel>
            <Select
              value={formData.systemId}
              onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
              label="System"
            >
              <MenuItem value="S4HANA_PROD">S4HANA Production</MenuItem>
              <MenuItem value="S4HANA_QA">S4HANA QA</MenuItem>
              <MenuItem value="S4HANA_DEV">S4HANA Development</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Schedule</InputLabel>
            <Select
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              label="Schedule"
            >
              <MenuItem value="5min">Every 5 minutes</MenuItem>
              <MenuItem value="15min">Every 15 minutes</MenuItem>
              <MenuItem value="30min">Every 30 minutes</MenuItem>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mb: 2 }}>Select KPIs to Monitor</Typography>
          {Object.entries(kpisByCategory).map(([category, kpis]) => (
            <Accordion key={category}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>{category}</Typography>
                  <Chip 
                    label={kpis.filter(k => formData.kpis.includes(k.id)).length} 
                    size="small" 
                    color="primary"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {kpis.map((kpi) => (
                  <Box key={kpi.id} sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.kpis.includes(kpi.id)}
                          onChange={() => handleKPIToggle(kpi.id)}
                        />
                      }
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2">{kpi.name}</Typography>
                            <KPIFrequencyBadge frequency={kpi.frequency} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Source: {kpi.dataSource} | {kpi.rfcTables}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!formData.name || formData.kpis.length === 0}>
          {agent ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentCreationDialog;
