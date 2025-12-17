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

const getSystemAvailability = async () => {
    console.log('[SERVICE] getSystemAvailability - START');
    resetDataSourceTracker();
    
    // 1. Get system info
    const sysInfo = await callRFC('RFC_SYSTEM_INFO', {});
    
    // 2. Get active users
    const activeUsersData = await callRFC('TH_USER_LIST', {});
    
    // 3. Get user count from USR02
    const userCountData = await callRFC('RFC_READ_TABLE', {
        QUERY_TABLE: 'USR02',
        DELIMITER: '|',
        ROWCOUNT: 100,
        FIELDS: [{ FIELDNAME: 'BNAME' }]
    });
    
    // Calculate metrics
    const appUptime = 0;
    const activeUsers = activeUsersData?.USRLIST?.length || 0;
    const totalUsers = userCountData?.DATA?.length || 0;
    const licenseUtil = totalUsers > 0 ? Math.min((activeUsers / totalUsers * 100), 100) : 0;
    
    console.log('[SERVICE] getSystemAvailability - COMPLETE');

    const dataSource = getDataSource();

    return {
        _dataSource: dataSource,
        'SAP application uptime %': {
            value: appUptime.toFixed(2),
            status: getStatus(appUptime, { green: 0, yellow: 0 }),
            trend: generateTrendData(appUptime),
        },
        'Database uptime %': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Application server uptime per instance': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Average system restart frequency': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Active user count': {
            value: activeUsers,
            status: 'neutral',
            trend: generateTrendData(activeUsers),
        },
        'Peak concurrent users': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'Unauthorized login attempts': {
            value: 'N/A',
            status: 'neutral',
            trend: [],
        },
        'License utilization %': {
            value: Math.round(licenseUtil),
            status: getStatus(licenseUtil, { green: 80, yellow: 90 }),
            trend: generateTrendData(licenseUtil),
        },
    };
};

module.exports = { getSystemAvailability };
