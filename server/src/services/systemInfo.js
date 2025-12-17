const { callRFC, resetDataSourceTracker, getDataSource } = require('../sap/sapConnection');

const getSystemInfo = async () => {
    console.log('[SERVICE] getSystemInfo - START');
    resetDataSourceTracker();

    let systemInfoData = {};
    try {
        const result = await callRFC('RFC_SYSTEM_INFO', {});
        if (result && result.RFCSI_EXPORT) {
            const exportData = result.RFCSI_EXPORT;
            systemInfoData = {
                'System ID': exportData.RFCSYSID,
                'SAP Release': exportData.RFCOPSYS, // Often contains release info or OS
                'Host Name': exportData.RFCDEST,
                'SAP User': exportData.RFCUSER,
                'Codepage': exportData.RFCTEXTCP,
                'Kernel Release': exportData.RFCKERNRL,
                'Processor Arch': exportData.RFCTPCPLT,
                'OS Type': exportData.RFCTPCPU,
                'Database System': exportData.RFCDATABS,
                'Database Name': exportData.RFCDATANAM,
                'Start Date': exportData.RFCINISTDA,
                'Start Time': exportData.RFCINITTIM,
                'IP Address': exportData.RFCHOSTIP
            };
        }
        console.log('[SERVICE] getSystemInfo - COMPLETE');
    } catch (error) {
        console.error('[SERVICE] getSystemInfo - FAILED:', error.message);
        // If RFC call fails, it will fall back to mock data through callRFC,
        // but for system info, if no data is returned, we indicate it.
        systemInfoData = { 'Error': 'Failed to retrieve system information from SAP.' };
    }

    const dataSource = getDataSource();

    return {
        _dataSource: dataSource,
        'SAP System Information': systemInfoData
    };
};

module.exports = { getSystemInfo };
