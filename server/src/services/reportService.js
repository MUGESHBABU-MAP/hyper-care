const { getExecutionHistory } = require('./agentService');
const { KPI_DEFINITIONS } = require('../config/kpiDefinitions');

const generateReport = (agentId, hours = 24) => {
  const history = getExecutionHistory(agentId, hours);
  
  const report = {
    generatedAt: new Date().toISOString(),
    period: `Last ${hours} hours`,
    agentId,
    summary: {
      totalExecutions: history.length,
      successCount: history.filter(h => h.status === 'success').length,
      failureCount: history.filter(h => h.status === 'error').length,
      avgDuration: history.reduce((sum, h) => sum + h.duration, 0) / history.length || 0
    },
    systemData: {}
  };
  
  // Group by System and KPI
  const systemGroups = {};
  history.forEach(exec => {
    if (!systemGroups[exec.systemId]) {
      systemGroups[exec.systemId] = {};
    }
    if (!systemGroups[exec.systemId][exec.kpiId]) {
      systemGroups[exec.systemId][exec.kpiId] = [];
    }
    systemGroups[exec.systemId][exec.kpiId].push(exec);
  });
  
  // Build system sections
  Object.keys(systemGroups).forEach(systemId => {
    const kpiGroups = systemGroups[systemId];
    const systemKpiData = {};
    
    Object.keys(kpiGroups).forEach(kpiId => {
      const kpiDef = KPI_DEFINITIONS.find(k => k.id === kpiId);
      const executions = kpiGroups[kpiId];
      
      systemKpiData[kpiId] = {
        name: kpiDef?.name || kpiId,
        category: kpiDef?.category || 'Unknown',
        frequency: kpiDef?.frequency || 'Unknown',
        executions: executions.length,
        values: executions.map(e => ({
          timestamp: e.timestamp,
          value: e.value,
          status: e.status
        })),
        latestValue: executions[0]?.value,
        avgValue: calculateAverage(executions.map(e => e.value))
      };
    });
    
    report.systemData[systemId] = systemKpiData;
  });
  
  return report;
};

const calculateAverage = (values) => {
  const numericValues = values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
  if (numericValues.length === 0) return 'N/A';
  return (numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length).toFixed(2);
};

const formatReportAsCSV = (report) => {
  let csv = 'KPI Report\n';
  csv += `Generated At,${report.generatedAt}\n`;
  csv += `Period,${report.period}\n`;
  csv += `Agent ID,${report.agentId}\n\n`;
  
  csv += 'Summary\n';
  csv += `Total Executions,${report.summary.totalExecutions}\n`;
  csv += `Success Count,${report.summary.successCount}\n`;
  csv += `Failure Count,${report.summary.failureCount}\n`;
  csv += `Avg Duration (ms),${report.summary.avgDuration.toFixed(2)}\n\n`;
  
  // Process each system
  Object.keys(report.systemData).forEach(systemId => {
    csv += `\n--- System: ${systemId} ---\n`;
    csv += 'KPI Name,Category,Frequency,Executions,Latest Value,Average Value\n';
    
    const systemKpis = report.systemData[systemId];
    Object.values(systemKpis).forEach(kpi => {
      csv += `${kpi.name},${kpi.category},${kpi.frequency},${kpi.executions},${kpi.latestValue},${kpi.avgValue}\n`;
    });
    
    csv += '\nDetailed Execution History\n';
    csv += 'KPI Name,Timestamp,Value,Status\n';
    
    Object.values(systemKpis).forEach(kpi => {
      kpi.values.forEach(v => {
        csv += `${kpi.name},${v.timestamp},${v.value},${v.status}\n`;
      });
    });
  });
  
  return csv;
};

module.exports = { generateReport, formatReportAsCSV };
