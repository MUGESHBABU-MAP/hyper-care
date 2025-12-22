require('dotenv').config();
const express = require('express');
const cors = require('cors');
const kpiRoutes = require('./routes/kpiRoutes');
const agentRoutes = require('./routes/agentRoutes');
const { startAll } = require('./services/agentScheduler');
const { readJSON } = require('./utils/persistence');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/kpi', kpiRoutes);
app.use('/api', agentRoutes);

app.get('/', (req, res) => {
  res.send('Hypercare Monitoring Agent Backend is running.');
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Test SAP connection on startup
  if (process.env.MOCK_MODE !== 'true') {
    const { testConnection } = require('./sap/connectionTest');
    await testConnection();
  }
  // Load persisted agents and start schedules
  try {
    const persisted = readJSON('agents.json', []);
    if (persisted && persisted.length) startAll(persisted);
    console.log(`[index] Started ${persisted.length} persisted agents`);
  } catch (err) {
    console.error('Error starting persisted agents', err);
  }
});
