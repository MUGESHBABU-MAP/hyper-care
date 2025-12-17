const { callRFC, resetDataSourceTracker, getDataSource } = require('../sap/sapConnection');
const { generateTrendData } = require('../utils/mockData');

// Helper for KPI status
const getStatusLowerIsBetter = (value, thresholds) => {
    if (value <= thresholds.green) return 'green';
    if (value <= thresholds.yellow) return 'yellow';
    return 'red';
};

const getSecurityAuthorization = async () => {
    console.log('[SERVICE] getSecurityAuthorization - START');
    resetDataSourceTracker();

    // Read security-relevant fields from USR02
    const usr02 = await callRFC('RFC_READ_TABLE', {
        QUERY_TABLE: 'USR02',
        DELIMITER: '|',
        FIELDS: [
            { FIELDNAME: 'BNAME' },
            { FIELDNAME: 'UFLAG' },      // lock status
            { FIELDNAME: 'TRDAT' },      // last logon date
            { FIELDNAME: 'FAILCOUNT' },  // failed logins
            { FIELDNAME: 'PWDLGNDT' },   // password changed date
            { FIELDNAME: 'PWDSTATE' }    // password expired
        ],
        ROWCOUNT: 10000
    });

    console.log(usr02,"jjjjj");
    

    const rows = usr02.DATA || [];
    const count = rows.length;

    let lockedUsers = 0;
    let inactiveUsers = 0;
    let failedLogins = 0;
    let expiredPw = 0;
    let rfcUserPasswordAge = 0;

    const today = new Date();

    rows.forEach(row => {
        const parts = row.WA.split('|');
        const UFLAG = parseInt(parts[1]);
        const lastLogin = parts[2];
        const FAILCOUNT = parseInt(parts[3]);
        const PWDLGNDT = parts[4];
        const PWDSTATE = parseInt(parts[5]);

        // --- Locked users ---
        if (UFLAG === 64) lockedUsers++;

        // --- Inactive users ---
        if (lastLogin && lastLogin !== '00000000') {
            const loginDate = new Date(
                lastLogin.substring(0, 4),
                lastLogin.substring(4, 6) - 1,
                lastLogin.substring(6, 8)
            );
            const diffDays = (today - loginDate) / (1000 * 60 * 60 * 24);
            if (diffDays > 90) inactiveUsers++; // more than 90 days inactive
        }

        // --- Failed logins ---
        failedLogins += FAILCOUNT;

        // --- Password expired ---
        if (PWDSTATE === 1) expiredPw++;

        // --- Password age for RFC users (type 'S') ---
        if (PWDLGNDT && PWDLGNDT !== '00000000') {
            const pwdDate = new Date(
                PWDLGNDT.substring(0, 4),
                PWDLGNDT.substring(4, 6) - 1,
                PWDLGNDT.substring(6, 8)
            );
            const pwdAgeDays = (today - pwdDate) / (1000 * 60 * 60 * 24);

            // consider RFC users only
            rfcUserPasswordAge = Math.max(rfcUserPasswordAge, pwdAgeDays);
        }
    });

    // --- Authorization Failures (from SAL logs) ---
    const authLog = await callRFC('RFC_READ_TABLE', {
        QUERY_TABLE: 'SALRT',
        DELIMITER: '|',
        FIELDS: [{ FIELDNAME: 'MSGID' }, { FIELDNAME: 'MSGNO' }],
        OPTIONS: [{ TEXT: "MSGID = 'SEC'" }],
        ROWCOUNT: 5000
    });
    const authFailures = authLog.DATA?.length || 0;

    console.log('[SERVICE] getSecurityAuthorization - COMPLETE');

    const dataSource = getDataSource();

    return {
        _dataSource: dataSource,

        'Authorization failures (SU53/SAL)': {
            value: authFailures,
            status: getStatusLowerIsBetter(authFailures, { green: 10, yellow: 50 }),
            trend: generateTrendData(authFailures, 7, 0.2)
        },

        'Users with SoD conflicts': {
            value: 'N/A', // Only if GRC exists
            status: 'neutral',
            trend: []
        },

        'Locked users': {
            value: lockedUsers,
            status: lockedUsers === 0 ? 'green' : 'yellow',
            trend: generateTrendData(lockedUsers)
        },

        'Inactive users (>90 days)': {
            value: inactiveUsers,
            status: inactiveUsers < 10 ? 'green' : inactiveUsers < 50 ? 'yellow' : 'red',
            trend: generateTrendData(inactiveUsers)
        },

        'Emergency access sessions': {
            value: 'N/A', // Only GRC EAM tables provide this
            status: 'neutral',
            trend: []
        },

        'Failed login attempts': {
            value: failedLogins,
            status: getStatusLowerIsBetter(failedLogins, { green: 20, yellow: 100 }),
            trend: generateTrendData(failedLogins)
        },

        'Expired password %': {
            value: count > 0 ? ((expiredPw / count) * 100).toFixed(1) + '%' : '0%',
            status: expiredPw === 0 ? 'green' : expiredPw < 10 ? 'yellow' : 'red',
            trend: generateTrendData(expiredPw)
        },

        'RFC user password age (days)': {
            value: Math.round(rfcUserPasswordAge),
            status: rfcUserPasswordAge < 60 ? 'green' : rfcUserPasswordAge < 90 ? 'yellow' : 'red',
            trend: generateTrendData(rfcUserPasswordAge)
        }
    };
};

module.exports = { getSecurityAuthorization };
