import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Download, Refresh } from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AgentExecutionHistory = () => {
  const { agentId } = useParams();
  const [history, setHistory] = useState([]);
  const [agent, setAgent] = useState(null);
  const [timeRange, setTimeRange] = useState(24);

  useEffect(() => {
    if (agentId) {
      loadAgent();
      loadHistory();
    }
  }, [agentId, timeRange]);

  const loadAgent = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/agents/${agentId}`);
      setAgent(response.data);
    } catch (error) {
      console.error('Error loading agent:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/agents/${agentId}/history?hours=${timeRange}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/agents/${agentId}/report?format=csv&hours=${timeRange}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kpi-report-${agentId}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Execution History</Typography>
          {agent && (
            <Typography variant="body2" color="text.secondary">
              Agent: {agent.name}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value={1}>Last 1 hour</MenuItem>
              <MenuItem value={6}>Last 6 hours</MenuItem>
              <MenuItem value={24}>Last 24 hours</MenuItem>
              <MenuItem value={168}>Last 7 days</MenuItem>
            </Select>
          </FormControl>
          <Button startIcon={<Refresh />} onClick={loadHistory}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadReport}>
            Download Report
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>KPI ID</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration (ms)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">No execution history available</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((exec, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{new Date(exec.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{exec.kpiId}</TableCell>
                      <TableCell>{exec.value}</TableCell>
                      <TableCell>
                        <Chip label={exec.status} color={getStatusColor(exec.status)} size="small" />
                      </TableCell>
                      <TableCell>{exec.duration}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AgentExecutionHistory;
