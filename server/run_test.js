
require('dotenv').config({ path: './.env' });
const { testConnection } = require('./src/sap/connectionTest.js');

testConnection().finally(() => {
    console.log('Test script finished.');
});
