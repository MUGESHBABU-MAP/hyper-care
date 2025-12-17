// KPI Definitions from Excel - Version 1 Release
const KPI_DEFINITIONS = [
  {
    id: 'system_uptime',
    name: 'System Uptime %',
    category: 'System Stability',
    subCategory: 'Availability',
    frequency: '5-15min',
    agentGroup: 'MA',
    dataSource: 'SAP ABAP',
    rfcTables: 'MMONSTAT, THSAPSTAT',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'failed_jobs_trend',
    name: 'Failed Background Jobs Trend',
    category: 'System Stability',
    subCategory: 'Job Monitoring',
    frequency: 'daily',
    agentGroup: 'MA',
    dataSource: 'SM37',
    rfcTables: 'BAPI_XBP_JOB_STATUS_GETLIST',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'abap_dumps',
    name: 'ABAP Dumps (ST22)',
    category: 'System Stability',
    subCategory: 'Dump Monitoring',
    frequency: '15-30min',
    agentGroup: 'MA',
    dataSource: 'SAP ABAP',
    rfcTables: 'SNAP, SNAP_INDEX',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'dialog_response_time',
    name: 'Dialog Response Time',
    category: 'Performance',
    subCategory: 'Performance',
    frequency: 'hourly',
    agentGroup: 'MA',
    dataSource: 'ST03N',
    rfcTables: 'SWNC_GET_WORKLOAD_STATISTIC',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'rfc_errors_volume',
    name: 'RFC Errors Volume',
    category: 'Performance',
    subCategory: 'Performance',
    frequency: '15min',
    agentGroup: 'MA',
    dataSource: 'SAP Logs',
    rfcTables: 'RFCLOG, RFC_SYSTEM_INFORMATION',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'idoc_failures',
    name: 'IDoc Failures',
    category: 'Integration Health',
    subCategory: 'Integration Monitoring',
    frequency: '5-15min',
    agentGroup: 'MA',
    dataSource: 'SAP ABAP',
    rfcTables: 'EDIDS, IDOC_READ_COMPLETELY',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'rfc_destinations_health',
    name: 'RFC Destinations Health',
    category: 'Integration Health',
    subCategory: 'Integration Monitoring',
    frequency: '5min',
    agentGroup: 'MA',
    dataSource: 'SM59',
    rfcTables: 'RFCDES, RFC_PING',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'login_failures',
    name: 'Login Failures',
    category: 'Security & Risk',
    subCategory: 'Security & Audit',
    frequency: '15-30min',
    agentGroup: 'MA',
    dataSource: 'SM21',
    rfcTables: 'BALDAT, SYSLOG',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'mttr_ticket_volume',
    name: 'MTTR & Ticket Volume',
    category: 'Service Operations',
    subCategory: 'Incident Mgmt',
    frequency: 'on-demand',
    agentGroup: 'MA',
    dataSource: 'ServiceNow',
    rfcTables: 'ServiceNow Incident API',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'rfc_queue_backlog',
    name: 'RFC Queue Backlog',
    category: 'Integration',
    subCategory: 'Interfaces',
    frequency: '5-15min',
    agentGroup: 'MA',
    dataSource: 'qRFC',
    rfcTables: 'TRFCQIN, TRFCQOUT',
    hasInsights: true,
    recurring: true,
    monetizable: true
  },
  {
    id: 'critical_user_login_spike',
    name: 'Critical User Login Spike',
    category: 'Security',
    subCategory: 'Security',
    frequency: 'daily',
    agentGroup: 'MA',
    dataSource: 'Security Logs',
    rfcTables: 'USR02, SM20',
    hasInsights: true,
    recurring: false,
    monetizable: false
  },
  {
    id: 'memory_swap_events',
    name: 'Memory Swap Events',
    category: 'System',
    subCategory: 'System Health',
    frequency: '5-15min',
    agentGroup: 'MA',
    dataSource: 'OS',
    rfcTables: 'SAPOSCOL',
    hasInsights: true,
    recurring: true,
    monetizable: true
  }
];

const FREQUENCY_INTERVALS = {
  '5min': 5 * 60 * 1000,
  '5-15min': 10 * 60 * 1000,
  '15min': 15 * 60 * 1000,
  '15-30min': 20 * 60 * 1000,
  '30min': 30 * 60 * 1000,
  'hourly': 60 * 60 * 1000,
  'daily': 24 * 60 * 60 * 1000,
  'on-demand': null
};

module.exports = { KPI_DEFINITIONS, FREQUENCY_INTERVALS };
