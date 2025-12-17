const { KPI_DEFINITIONS } = require('../config/kpiDefinitions');

// In-memory storage for agents and execution history
const agents = new Map();
const executionHistory = new Map();

const createAgent = (agentData) => {
  const agent = {
    id: `agent_${Date.now()}`,
    name: agentData.name,
    description: agentData.description,
    systemId: agentData.systemId,
    kpis: agentData.kpis || [],
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
  if (schedule === 'daily') {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next.toISOString();
  }
  return null;
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

const recordExecution = (agentId, kpiId, result) => {
  const history = executionHistory.get(agentId) || [];
  history.unshift({
    timestamp: new Date().toISOString(),
    kpiId,
    status: result.status || 'success',
    value: result.value,
    duration: result.duration || 0
  });
  
  if (history.length > 1000) history.pop();
  executionHistory.set(agentId, history);
};

const getExecutionHistory = (agentId, hours = 24) => {
  const history = executionHistory.get(agentId) || [];
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return history.filter(h => new Date(h.timestamp) > cutoff);
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

module.exports = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  recordExecution,
  getExecutionHistory,
  getKPIDefinitions,
  getKPIsByCategory
};
