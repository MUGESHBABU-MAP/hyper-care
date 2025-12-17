// Conditionally require node-rfc and handle failure
let Client;
try {
  Client = require('node-rfc').Client;
} catch (error) {
  console.warn("Could not load 'node-rfc' module. The application will run in MOCK_MODE.");
  console.warn("Reason:", error.message);
  Client = null;
}

const { generateMockData } = require('../utils/mockData');

let client = null;

const getClient = async () => {
  // If node-rfc module is not available, we must be in mock mode.
  if (!Client || process.env.MOCK_MODE === 'true') {
    return null;
  }

  if (client && client.alive) {
    return client;
  }

  const connectionParams = {
    ashost: process.env.SAP_ASHOST,
    sysnr: process.env.SAP_SYSNR,
    client: process.env.SAP_CLIENT,
    user: process.env.SAP_USER,
    passwd: process.env.SAP_PASS,
    lang: process.env.SAP_LANG,
  };

  client = new Client(connectionParams);

  try {
    await client.open();
    console.log('SAP RFC connection established.');
    return client;
  } catch (err) {
    console.error('Error opening SAP RFC connection:', err);
    client = null;
    throw err;
  }
};

let dataSourceTracker = {};

const callRFC = async (functionName, params = {}) => {
  // Use mock data if MOCK_MODE is true OR if the node-rfc client could not be loaded
  if (process.env.MOCK_MODE === 'true' || !Client) {
    if (process.env.MOCK_MODE !== 'true') {
        console.log("Forcing MOCK_MODE because 'node-rfc' module is unavailable.");
    }
    console.log(`[MOCK DATA] ${functionName}`);
    dataSourceTracker[functionName] = 'MOCK';
    return generateMockData(functionName, params);
  }

  try {
    const rfcClient = await getClient();
    if (!rfcClient) {
      throw new Error('SAP connection not available.');
    }
    // Ensure params is always an object
    const rfcParams = params || {};
    const result = await rfcClient.call(functionName, rfcParams);
    console.log(`[SAP DATA] ${functionName} - SUCCESS`);
    dataSourceTracker[functionName] = 'SAP';
    return result;
  } catch (err) {
    console.error(`[SAP DATA] ${functionName} - FAILED:`, err.message);
    console.log(`[MOCK DATA] ${functionName} - Fallback`);
    dataSourceTracker[functionName] = 'MOCK';
    return generateMockData(functionName, params);
  }
};

const getDataSource = () => {
  const sapCalls = Object.values(dataSourceTracker).filter(s => s === 'SAP').length;
  const mockCalls = Object.values(dataSourceTracker).filter(s => s === 'MOCK').length;
  const total = sapCalls + mockCalls;
  
  if (total === 0) return 'UNKNOWN';
  if (mockCalls === 0) return 'SAP';
  if (sapCalls === 0) return 'MOCK';
  return 'MIXED';
};

const resetDataSourceTracker = () => {
  dataSourceTracker = {};
};

module.exports = { callRFC, getDataSource, resetDataSourceTracker };

