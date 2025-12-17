const { callRFC, resetDataSourceTracker, getDataSource } = require('../sap/sapConnection');
const { generateTrendData } = require('../utils/mockData');

const getStatus = (value, thresholds) => {
  if (value >= thresholds.green) return 'green';
  if (value >= thresholds.yellow) return 'yellow';
  return 'red';
};

const getStatusLowerIsBetter = (value, thresholds) => {
    if (value <= thresholds.green) return 'green';
    if (value <= thresholds.yellow) return 'yellow';
    return 'red';
};

const getSystemPerformance = async () => {
    console.log('[SERVICE] getSystemPerformance - START');
    resetDataSourceTracker();
    
    // Simple table reads
    const dumpData = await callRFC('RFC_READ_TABLE', {
        QUERY_TABLE: 'SNAP',
        DELIMITER: '|',
        ROWCOUNT: 100,
        FIELDS: [{ FIELDNAME: 'SEQNO' }]
    });
    
    const dumpCount = dumpData?.DATA?.length || 0;
    
    console.log('[SERVICE] getSystemPerformance - COMPLETE');

    const dataSource = getDataSource();

    return {
        _dataSource: dataSource,
        'Dialog response time': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Update task response time': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Background job throughput': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Work process utilization': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'CPU utilization %': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Memory utilization %': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'HANA memory consumption': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'DB response time': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Table growth rate': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Column vs row store usage': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Expensive SQL statements': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Unbalanced partition alerts': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'ABAP dump frequency (ST22)': {
            value: dumpCount,
            status: getStatusLowerIsBetter(dumpCount, { green: 5, yellow: 20 }),
            trend: generateTrendData(dumpCount),
        },
        'System log errors (SM21)': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Gateway errors': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Timeout errors': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Lock table overflows': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
    };
};

module.exports = { getSystemPerformance };
