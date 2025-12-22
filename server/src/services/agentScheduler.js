const { executeAgent } = require('./agentService');

const intervals = new Map();

const startAgent = async (agent) => {
  if (!agent || !agent.enabled) return null;
  const id = agent.id;
  // execute immediately
  try {
    await executeAgent(id);
  } catch (err) {
    console.error('agentScheduler executeAgent error', err);
  }

  // schedule interval if provided
  if (agent.schedule && agent.schedule.intervalSeconds) {
    const ms = agent.schedule.intervalSeconds * 1000;
    if (intervals.has(id)) clearInterval(intervals.get(id));
    const iv = setInterval(() => {
      executeAgent(id).catch(err => console.error('scheduled executeAgent error', err));
    }, ms);
    intervals.set(id, iv);
  }
  return true;
};

const stopAgent = (agentId) => {
  if (intervals.has(agentId)) {
    clearInterval(intervals.get(agentId));
    intervals.delete(agentId);
    return true;
  }
  return false;
};

const startAll = (agentsArray) => {
  agentsArray.forEach(a => {
    if (a.enabled) startAgent(a);
  });
};

const stopAll = () => {
  Array.from(intervals.keys()).forEach(k => stopAgent(k));
};

module.exports = { startAgent, stopAgent, startAll, stopAll };
// const { executeAgent } = require('./agentService');

// // Map of agentId -> intervalId
// const runningAgents = new Map();

// const startAgent = (agent) => {
//   if (!agent || !agent.enabled) return false;
//   if (runningAgents.has(agent.id)) return true; // already running

//   // Determine interval from agent.schedule
//   let ms = 24 * 60 * 60 * 1000; // default daily
//   switch (agent.schedule) {
//     case '5min': ms = 5 * 60 * 1000; break;
//     case '15min': ms = 15 * 60 * 1000; break;
//     case '30min': ms = 30 * 60 * 1000; break;
//     case 'hourly': ms = 60 * 60 * 1000; break;
//     case 'daily': ms = 24 * 60 * 60 * 1000; break;
//     default: ms = 24 * 60 * 60 * 1000;
//   }

//   // run immediately, then schedule
//   executeAgent(agent.id).catch(err => console.error('Scheduled execute error', err));

//   const id = setInterval(() => {
//     executeAgent(agent.id).catch(err => console.error('Scheduled execute error', err));
//   }, ms);

//   runningAgents.set(agent.id, id);
//   return true;
// };

// const stopAgent = (agentId) => {
//   const id = runningAgents.get(agentId);
//   if (!id) return false;
//   clearInterval(id);
//   runningAgents.delete(agentId);
//   return true;
// };

// const startAll = (agents) => {
//   agents.forEach(a => { if (a.enabled) startAgent(a); });
// };

// const stopAll = () => {
//   runningAgents.forEach((id, agentId) => { clearInterval(id); });
//   runningAgents.clear();
// };

// module.exports = { startAgent, stopAgent, startAll, stopAll };
