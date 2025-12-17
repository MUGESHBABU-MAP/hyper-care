// Test SAP connection with simple, guaranteed-to-exist function modules
const { callRFC } = require('./sapConnection');

const testConnection = async () => {
    console.log('\n========================================');
    console.log('SAP CONNECTION TEST');
    console.log('========================================\n');

    try {
        // Test 1: RFC_PING - Most basic test
        console.log('Test 1: RFC_PING...');
        const pingResult = await callRFC('RFC_PING', {});
        console.log('✅ RFC_PING successful\n');

        // Test 2: RFC_SYSTEM_INFO - Get system information
        console.log('Test 2: RFC_SYSTEM_INFO...');
        const sysInfo = await callRFC('RFC_SYSTEM_INFO', {});
        if (sysInfo?.RFCSI_EXPORT) {
            console.log('✅ System Info:');
            console.log(`   System: ${sysInfo.RFCSI_EXPORT.RFCSYSID}`);
            console.log(`   Client: ${sysInfo.RFCSI_EXPORT.RFCMANDT}`);
            console.log(`   Release: ${sysInfo.RFCSI_EXPORT.RFCOPSYS}\n`);
        }

        // Test 3: RFC_READ_TABLE with T000 (clients table - always exists)
        console.log('Test 3: RFC_READ_TABLE with T000...');
        const tableTest = await callRFC('RFC_READ_TABLE', {
            QUERY_TABLE: 'T000',
            DELIMITER: '|',
            ROWCOUNT: 5
        });
        if (tableTest?.DATA?.length > 0) {
            console.log(`✅ RFC_READ_TABLE successful - Found ${tableTest.DATA.length} clients\n`);
        }

        console.log('========================================');
        console.log('✅ ALL TESTS PASSED - SAP CONNECTION OK');
        console.log('========================================\n');
        return true;

    } catch (error) {
        console.log('========================================');
        console.log('❌ CONNECTION TEST FAILED');
        console.log('Error:', error.message);
        console.log('========================================\n');
        return false;
    }
};

module.exports = { testConnection };
