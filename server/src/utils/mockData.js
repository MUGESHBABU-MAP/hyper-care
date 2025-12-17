const MOCK_DATA_GENERATORS = {
  // System Availability
  'BAPI_SYSTEM_INFO': () => ({
    'SYSTEM_INFO': {
      'SYSTEM_ID': 'S4H',
      'UPTIME_SECONDS': 345600, // 4 days
    }
  }),
  'DB_UPTIME': () => ({ 'UPTIME_PERCENT': 0.98 }),
  'INSTANCE_UPTIME': () => ({
    'INSTANCE_LIST': [
      { 'INSTANCE_NAME': 's4h_instance_01', 'UPTIME_PERCENT': 0.99 },
      { 'INSTANCE_NAME': 's4h_instance_02', 'UPTIME_PERCENT': 0.95 },
    ]
  }),
  'SYSTEM_RESTART_FREQ': () => ({ 'RESTART_COUNT': 1 }),
  'ACTIVE_USERS': () => ({ 'USER_COUNT': 250 }),
  'PEAK_USERS': () => ({ 'USER_COUNT': 480 }),
  'UNAUTHORIZED_LOGINS': () => ({ 'ATTEMPT_COUNT': 12 }),
  'LICENSE_UTILIZATION': () => ({ 'UTILIZATION_PERCENT': 75 }),

  // System Performance - Workload (ST03N)
  'ST03N_GET_WORKLOAD': () => ({
    'WORKLOAD_DATA': {
      'DIALOG_RESPONSE_TIME_AVG': 350, // ms
      'UPDATE_RESPONSE_TIME_AVG': 150, // ms
      'BACKGROUND_JOB_THROUGHPUT': 1200, // jobs/hour
    }
  }),
  'SYSTEM_UTILIZATION': () => ({
    'CPU_UTILIZATION_PERCENT': 65,
    'MEMORY_UTILIZATION_PERCENT': 80,
  }),
  'HANA_MEMORY': () => ({ 'MEMORY_CONSUMPTION_GB': 512 }),

  // System Performance - DB Health
  'DB_RESPONSE_TIME': () => ({ 'RESPONSE_TIME_MS': 25 }),
  'TABLE_GROWTH': () => ({
    'TOP_TABLES': [
      { 'TABLE_NAME': 'ACDOCA', 'GROWTH_MB': 5000 },
      { 'TABLE_NAME': 'MATDOC', 'GROWTH_MB': 4500 },
    ]
  }),
  'COLUMN_ROW_STORE': () => ({ 'COLUMN_STORE_PERCENT': 95 }),
  'EXPENSIVE_SQL': () => ({ 'STATEMENT_COUNT': 5 }),
  'UNBALANCED_PARTITIONS': () => ({ 'ALERT_COUNT': 0 }),

  // System Performance - Technical Errors
  'ST22_DUMPS': () => ({ 'DUMP_COUNT': 3 }),
  'SM21_LOGS': () => ({ 'ERROR_COUNT': 50 }),
  'GATEWAY_ERRORS': () => ({ 'ERROR_COUNT': 4 }),
  'TIMEOUT_ERRORS': () => ({ 'ERROR_COUNT': 10 }),
  'SM12_LOCK_OVERFLOWS': () => ({ 'OVERFLOW_COUNT': 0 }),

  // Job & Batch Monitoring (SM37)
  'SM37_GET_JOBS': () => ({
    'FAILED_JOB_COUNT': 5,
    'DELAYED_JOB_COUNT': 2,
    'LONG_RUNNING_JOB_COUNT': 1,
    'SUCCESS_RATE_PERCENT': 98.5,
    'RESTART_SUCCESS_RATE_PERCENT': 80,
  }),
  'BATCH_WINDOW_UTIL': () => ({ 'UTILIZATION_PERCENT': 85 }),
  'JOB_PREDICTION': () => ({ 'ACCURACY_PERCENT': 92 }),

  // Integration & Interfaces - IDoc
  'IDOC_STATS': () => ({
    'TOTAL_PROCESSED': 15000,
    'IN_ERROR': 75,
    'REPROCESSING_RATE': 95,
    'BACKLOG_VOLUME': 200,
  }),
  // Integration & Interfaces - API/WebService
  'API_STATS': () => ({
    'FAILED_CALLS': 22,
    'AVG_RESPONSE_TIME_MS': 120,
    'RETRY_COUNT': 45,
    'QUEUE_LOCK_FAILURES': 2,
  }),

  // Security & Authorization
  'SU53_AUTH_FAILURES': () => ({ 'FAILURE_COUNT': 110 }),
  'SOD_CONFLICTS': () => ({ 'CONFLICT_USER_COUNT': 8 }),
  'LOCKED_USERS': () => ({ 'LOCKED_USER_COUNT': 15 }),
  'INACTIVE_USERS': () => ({ 'INACTIVE_USER_COUNT': 50 }),
  'EMERGENCY_SESSIONS': () => ({ 'SESSION_COUNT': 2 }),
  'FAILED_LOGINS': () => ({ 'ATTEMPT_COUNT': 35 }),
  'EXPIRED_PASSWORDS': () => ({ 'EXPIRED_PERCENT': 5 }),
  'RFC_PASSWORD_AGE': () => ({ 'MAX_AGE_DAYS': 85 }),

  // Data Consistency & Master Data
  'MASTER_DATA_QUALITY': () => ({
    'MISSING_MANDATORY_FIELDS': 150,
    'DUPLICATE_ENTRIES': 45,
    'CVI_BP_INCONSISTENCIES': 20,
  }),
  'DATA_MIGRATION_ERRORS': () => ({ 'RECONCILIATION_ERRORS': 5 }),
  'TRANSACTION_DATA_STUCK': () => ({
    'STUCK_SALES_DOCS': 12,
    'STUCK_DELIVERY_DOCS': 8,
  }),
  'GR_IR_MISMATCH': () => ({ 'MISMATCH_VALUE_EUR': 50000 }),
  'REPLICATION_DELAYS': () => ({ 'MAX_DELAY_MINUTES': 30 }),

  // Business Process KPIs - OTC
  'OTC_KPI': () => ({
    'FAILED_SALES_ORDERS': 15,
    'UNPOSTED_BILLING_DOCS': 7,
    'DELIVERY_BLOCK_RATE': 2.5,
    'ATP_CHECK_FAILURES': 30,
  }),
  // Business Process KPIs - P2P
  'P2P_KPI': () => ({
    'PO_CREATION_ERRORS': 10,
    'GR_POSTING_FAILURES': 5,
    'INVOICE_MATCH_FAILURES': 8,
    'PAYMENT_RUN_ERRORS': 2,
  }),
  // Business Process KPIs - Manufacturing
  'MFG_KPI': () => ({
    'STUCK_PRODUCTION_ORDERS': 6,
    'MRP_ERRORS': 3,
    'BACKFLUSH_FAILURES': 9,
  }),
  // Business Process KPIs - Finance
  'FIN_KPI': () => ({
    'POSTING_ERRORS': 25,
    'PERIOD_END_CLOSING_ERRORS': 4,
    'ASSET_INCONSISTENCIES': 11,
    'RECONCILIATION_IMBALANCE': 1,
  }),
    // Business Process KPIs - FSM
  'FSM_KPI': () => ({
    'SERVICE_CALLS': 50,
    'TECHS_DISPATCHED': 45,
    'PARTS_CONSUMED': 120,
  }),
  // Business Process KPIs - RTR
  'RTR_KPI': () => ({
    'AP_INVOICES': 1500,
    'AR_INVOICES': 1200,
    'GL_POSTED': 2700,
  }),
  // Business Process KPIs - TAX
  'TAX_KPI': () => ({
    'TAX_REPORTS': 50,
    'VAT_CORRECTIONS': 15,
    'AUDIT_FILES': 5,
  }),
  // Business Process KPIs - EAM
  'EAM_KPI': () => ({
    'WORK_ORDERS': 75,
    'NOTIFICATIONS': 110,
    'EQUIP_INSTALLED': 25,
  }),
  // Business Process KPIs - PTP
  'PTP_KPI': () => ({
    'POS_CREATED': 200,
    'MATERIALS_CREATED': 50,
    'GOODS_RECEIPTS': 180,
  }),

  // Incident & Support KPIs (ServiceNow)
  'SERVICENOW_KPI': () => ({
    'TOTAL_TICKET_VOLUME': 250,
    'TICKETS_PER_WORKSTREAM': [
      { workstream: 'Finance', count: 80 },
      { workstream: 'Logistics', count: 120 },
      { workstream: 'HR', count: 50 },
    ],
    'TICKET_SEVERITY_DISTRIBUTION': [
        { severity: '1-Critical', count: 5 },
        { severity: '2-High', count: 25 },
        { severity: '3-Medium', count: 120 },
        { severity: '4-Low', count: 100 },
    ],
    'TICKET_AGING_DAYS': 8,
    'REOPEN_RATE_PERCENT': 15,
    'FIRST_RESPONSE_SLA_COMPLIANCE_PERCENT': 95,
    'RESOLUTION_SLA_COMPLIANCE_PERCENT': 88,
    'MEAN_TIME_TO_ACKNOWLEDGE_HOURS': 1.5,
    'MEAN_TIME_TO_RESOLVE_HOURS': 24,
    'TICKETS_AUTO_CLASSIFICATION_PERCENT': 75,
  }),

};

const generateMockData = (functionName, params) => {
  if (MOCK_DATA_GENERATORS[functionName]) {
    return MOCK_DATA_GENERATORS[functionName](params);
  }
  console.warn(`No mock data generator found for RFC: ${functionName}. Returning empty object.`);
  return {};
};

const generateTrendData = (baseValue, points = 7, volatility = 0.1) => {
    const trend = [];
    let value = baseValue;
    for (let i = 0; i < points; i++) {
        trend.push({
            name: `T-${points - i}`,
            value: Math.round(value * (1 + (Math.random() - 0.5) * volatility)),
        });
        value = trend[i].value; // base next point on the previous one
    }
    return trend.reverse();
};


module.exports = { generateMockData, generateTrendData };
