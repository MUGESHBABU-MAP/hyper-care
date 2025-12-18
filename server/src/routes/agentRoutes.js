const express = require('express');
const {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getExecutionHistory,
  getKPIDefinitions,
  getKPIsByCategory,
  executeAgent,
  getAgentResults
} = require('../services/agentService');
const { getKPIInsight } = require('../services/kpiInsights');
const { generateReport, formatReportAsCSV } = require('../services/reportService');

const router = express.Router();

// Get all KPI definitions
router.get('/kpi-definitions', (req, res) => {
  res.json(getKPIDefinitions());
});

// Get KPIs grouped by category
router.get('/kpi-definitions/by-category', (req, res) => {
  res.json(getKPIsByCategory());
});

// Get insight for a specific KPI value
router.post('/kpi-insights', (req, res) => {
  const { kpiId, value } = req.body;
  const insight = getKPIInsight(kpiId, value);
  res.json(insight);
});

// Create new agent
router.post('/agents', (req, res) => {
  const agent = createAgent(req.body);
  res.status(201).json(agent);
});

// Get all agents
router.get('/agents', (req, res) => {
  res.json(getAllAgents());
});

// Get agent by ID
router.get('/agents/:id', (req, res) => {
  const agent = getAgentById(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// Update agent
router.put('/agents/:id', (req, res) => {
  const updated = updateAgent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(updated);
});

// Delete agent
router.delete('/agents/:id', (req, res) => {
  deleteAgent(req.params.id);
  res.status(204).send();
});

// Get execution history
router.get('/agents/:id/history', (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  const systemId = req.query.systemId || null;
  const history = getExecutionHistory(req.params.id, hours, systemId);
  res.json(history);
});

// Execute agent manually
router.post('/agents/:id/execute', async (req, res) => {
  try {
    const results = await executeAgent(req.params.id);
    if (!results) {
      return res.status(404).json({ error: 'Agent not found or disabled' });
    }
    res.json({ message: 'Agent executed successfully', results });
  } catch (error) {
    console.error('Error executing agent:', error);
    res.status(500).json({ error: 'Failed to execute agent' });
  }
});

// Get agent results (multi-system analysis)
router.get('/agents/:id/results', (req, res) => {
  const results = getAgentResults(req.params.id);
  if (!results) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(results);
});

// Generate report
router.get('/agents/:id/report', (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  const format = req.query.format || 'json';
  
  const report = generateReport(req.params.id, hours);
  
  if (format === 'csv') {
    const csv = formatReportAsCSV(report);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=kpi-report-${req.params.id}-${Date.now()}.csv`);
    return res.send(csv);
  }
  
  res.json(report);
});

module.exports = router;
