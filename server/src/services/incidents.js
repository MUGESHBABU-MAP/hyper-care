const { callRFC } = require('../sap/sapConnection');
const { generateTrendData } = require('../utils/mockData');

const getStatusLowerIsBetter = (value, thresholds) => {
    if (value <= thresholds.green) return 'green';
    if (value <= thresholds.yellow) return 'yellow';
    return 'red';
};

const getStatus = (value, thresholds) => {
    if (value >= thresholds.green) return 'green';
    if (value >= thresholds.yellow) return 'yellow';
    return 'red';
};

const { resetDataSourceTracker, getDataSource } = require('../sap/sapConnection');

const getIncidents = async () => {
    console.log('[SERVICE] getIncidents - START');
    resetDataSourceTracker();
    // ServiceNow integration would be external, not SAP RFC
    // Use calculated values for now
    const totalTickets = 234;
    const ticketAging = 9;
    const reopenRate = 12;
    console.log('[SERVICE] getIncidents - COMPLETE');

    const dataSource = 'MOCK'; // ServiceNow is external

    return {
        _dataSource: dataSource,
        'Total ticket volume': {
            value: totalTickets,
            status: 'neutral',
            trend: generateTrendData(totalTickets, 7, 0.1),
        },
        'Tickets per workstream': {
            value: 'Finance: 45, SD: 67, MM: 52, Others: 70',
            status: 'neutral',
            trend: [],
        },
        'Ticket severity distribution': {
            value: 'Critical: 12, High: 45, Medium: 98, Low: 79',
            status: 'neutral',
            trend: [],
        },
        'Ticket aging': {
            value: `${ticketAging} days`,
            status: getStatusLowerIsBetter(ticketAging, { green: 7, yellow: 14 }),
            trend: generateTrendData(ticketAging),
        },
        'Reopen rate': {
            value: `${reopenRate}%`,
            status: getStatusLowerIsBetter(reopenRate, { green: 10, yellow: 20 }),
            trend: generateTrendData(reopenRate),
        },
        'First response SLA compliance': {
            value: '96%',
            status: getStatus(96, { green: 95, yellow: 85 }),
            trend: generateTrendData(96),
        },
        'Resolution SLA compliance': {
            value: '92%',
            status: getStatus(92, { green: 90, yellow: 80 }),
            trend: generateTrendData(92),
        },
        'Mean time to acknowledge': {
            value: '1.8 hours',
            status: getStatusLowerIsBetter(1.8, { green: 2, yellow: 4 }),
            trend: generateTrendData(1.8),
        },
        'Mean time to resolve': {
            value: '22 hours',
            status: getStatusLowerIsBetter(22, { green: 24, yellow: 48 }),
            trend: generateTrendData(22),
        },
        'Tickets auto-classification': {
            value: '85%',
            status: getStatus(85, { green: 80, yellow: 60 }),
            trend: generateTrendData(85),
        },
    };
};

module.exports = { getIncidents };
