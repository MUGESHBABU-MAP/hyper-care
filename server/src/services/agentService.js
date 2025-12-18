const { KPI_DEFINITIONS } = require('../config/kpiDefinitions');

// In-memory storage for agents and execution history
const agents = new Map();
const executionHistory = new Map();

const createAgent = (agentData) => {
  const agent = {
    id: `agent_${Date.now()}`,
    name: agentData.name,
    description: agentData.description,
    systems: agentData.systems || [], // Array of system configurations
    schedule: agentData.schedule || 'daily',
    enabled: true,
    createdAt: new Date().toISOString(),
    lastRun: null,
    nextRun: calculateNextRun(agentData.schedule)
  };
  
  agents.set(agent.id, agent);
  executionHistory.set(agent.id, []);
  return agent;
};

const calculateNextRun = (schedule) => {
  const now = new Date();
  switch(schedule) {
    case '5min':
      return new Date(now.getTime() + 5 * 60 * 1000).toISOString();
    case '15min':
      return new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    case '30min':
      return new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    case 'hourly':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    case 'daily':
      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      return next.toISOString();
    default:
      return null;
  }
};

const getAllAgents = () => Array.from(agents.values());

const getAgentById = (id) => agents.get(id);

const updateAgent = (id, updates) => {
  const agent = agents.get(id);
  if (!agent) return null;
  
  const updated = { ...agent, ...updates, updatedAt: new Date().toISOString() };
  agents.set(id, updated);
  return updated;
};

const deleteAgent = (id) => {
  agents.delete(id);
  executionHistory.delete(id);
};

const recordExecution = (agentId, systemId, kpiId, result) => {
  const history = executionHistory.get(agentId) || [];
  history.unshift({
    timestamp: new Date().toISOString(),
    systemId,
    kpiId,
    status: result.status || 'success',
    value: result.value,
    duration: result.duration || 0
  });
  
  if (history.length > 1000) history.pop();
  executionHistory.set(agentId, history);
};

const getExecutionHistory = (agentId, hours = 24, systemId = null) => {
  const history = executionHistory.get(agentId) || [];
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  let filtered = history.filter(h => new Date(h.timestamp) > cutoff);
  
  if (systemId) {
    filtered = filtered.filter(h => h.systemId === systemId);
  }
  
  return filtered;
};

const getKPIDefinitions = () => KPI_DEFINITIONS;

const getKPIsByCategory = () => {
  const grouped = {};
  KPI_DEFINITIONS.forEach(kpi => {
    if (!grouped[kpi.category]) {
      grouped[kpi.category] = [];
    }
    grouped[kpi.category].push(kpi);
  });
  return grouped;
};

const executeAgent = async (agentId) => {
  const agent = agents.get(agentId);
  if (!agent || !agent.enabled) return null;

  const results = [];
  
  // Execute for each system
  for (const systemConfig of agent.systems) {
    const { systemId, kpis } = systemConfig;
    
    // Execute each KPI
    for (const kpiConfig of kpis) {
      const { kpiId, interval } = kpiConfig;
      
      // Mock execution - in real implementation, fetch from SAP
      const mockValue = generateMockValue(kpiId);
      const result = {
        status: 'success',
        value: mockValue,
        duration: Math.floor(Math.random() * 1000) + 100
      };
      
      recordExecution(agentId, systemId, kpiId, result);
      results.push({ systemId, kpiId, ...result });
    }
  }
  
  // Update agent last run and next run
  agent.lastRun = new Date().toISOString();
  agent.nextRun = calculateNextRun(agent.schedule);
  agents.set(agentId, agent);
  
  return results;
};

const generateMockValue = (kpiId) => {
  switch(kpiId) {
    case 'system_uptime': return (99 + Math.random()).toFixed(2);
    case 'failed_jobs_trend': return Math.floor(Math.random() * 20);
    case 'abap_dumps': return Math.floor(Math.random() * 15);
    case 'dialog_response_time': return Math.floor(Math.random() * 2000) + 200;
    case 'rfc_errors_volume': return Math.floor(Math.random() * 100);
    case 'idoc_failures': return Math.floor(Math.random() * 50);
    case 'rfc_destinations_health': return ['Healthy', 'Degraded', 'Critical'][Math.floor(Math.random() * 3)];
    case 'login_failures': return Math.floor(Math.random() * 100);
    case 'mttr_ticket_volume': return (Math.random() * 48).toFixed(1);
    case 'rfc_queue_backlog': return Math.floor(Math.random() * 2000);
    case 'critical_user_login_spike': return ['Normal', 'Elevated', 'Critical'][Math.floor(Math.random() * 3)];
    case 'memory_swap_events': return Math.floor(Math.random() * 30);
    default: return 'N/A';
  }
};

const getAgentResults = (agentId) => {
  const agent = agents.get(agentId);
  if (!agent) return null;
  
  const results = {
    agent,
    systemResults: []
  };
  
  // Get results for each system
  agent.systems.forEach(systemConfig => {
    const systemHistory = getExecutionHistory(agentId, 24, systemConfig.systemId);
    const kpiResults = [];
    
    // Group by KPI
    const kpiGroups = {};
    systemHistory.forEach(exec => {
      if (!kpiGroups[exec.kpiId]) {
        kpiGroups[exec.kpiId] = [];
      }
      kpiGroups[exec.kpiId].push(exec);
    });
    
    // Build KPI results
    Object.keys(kpiGroups).forEach(kpiId => {
      const executions = kpiGroups[kpiId];
      const kpiDef = KPI_DEFINITIONS.find(k => k.id === kpiId);
      
      kpiResults.push({
        kpiId,
        name: kpiDef?.name || kpiId,
        category: kpiDef?.category || 'Unknown',
        latestValue: executions[0]?.value,
        latestStatus: executions[0]?.status,
        executionCount: executions.length,
        avgValue: calculateAverage(executions.map(e => e.value))
      });
    });
    
    results.systemResults.push({
      systemId: systemConfig.systemId,
      kpiResults
    });
  });
  
  return results;
};

const calculateAverage = (values) => {
  const numericValues = values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
  if (numericValues.length === 0) return null;
  return (numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length).toFixed(2);
};

module.exports = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  recordExecution,
  getExecutionHistory,
  getKPIDefinitions,
  getKPIsByCategory,
  executeAgent,
  getAgentResults
};
