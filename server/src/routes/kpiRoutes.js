const express = require('express');
const { getSystemAvailability } = require('../services/systemAvailability');
const { getSystemPerformance } = require('../services/systemPerformance');
const { getJobMonitoring } = require('../services/jobMonitoring');
const { getIntegrationInterfaces } = require('../services/integrationInterfaces');
const { getSecurityAuthorization } = require('../services/securityAuthorization');
const { getDataMaster } = require('../services/dataMaster');
const { getBusinessProcess } = require('../services/businessProcess');
const { getIncidents } = require('../services/incidents');
const { getSystemInfo } = require('../services/systemInfo');

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/system', asyncHandler(async (req, res) => {
    const data = await getSystemAvailability();
    res.json(data);
}));

router.get('/systeminfo', asyncHandler(async (req, res) => {
    const data = await getSystemInfo();
    res.json(data);
}));


router.get('/performance', asyncHandler(async (req, res) => {
    const data = await getSystemPerformance();
    res.json(data);
}));

router.get('/jobs', asyncHandler(async (req, res) => {
    const data = await getJobMonitoring();
    res.json(data);
}));

router.get('/integration', asyncHandler(async (req, res) => {
    const data = await getIntegrationInterfaces();
    res.json(data);
}));

router.get('/security', asyncHandler(async (req, res) => {
    const data = await getSecurityAuthorization();
    res.json(data);
}));

router.get('/masterdata', asyncHandler(async (req, res) => {
    const data = await getDataMaster();
    res.json(data);
}));

router.get('/business', asyncHandler(async (req, res) => {
    const data = await getBusinessProcess();
    res.json(data);
}));

router.get('/incidents', asyncHandler(async (req, res) => {
    const data = await getIncidents();
    res.json(data);
}));

// Global error handler for the router
router.use((err, req, res, next) => {
    console.error(`Error processing request for ${req.originalUrl}:`, err);
    res.status(500).json({ error: 'An internal server error occurred', details: err.message });
});


module.exports = router;
