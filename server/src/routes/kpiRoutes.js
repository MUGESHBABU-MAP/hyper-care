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
const { KPI_DEFINITIONS } = require('../config/kpiDefinitions');
const { generateMockData, generateTrendData } = require('../utils/mockData');

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

// Return trimmed list of KPIs (selected set) with sample/mock values
router.get('/kpis', asyncHandler(async (req, res) => {
    const kpis = KPI_DEFINITIONS.map(k => {
        let sample = { value: 'N/A', status: 'neutral', trend: [] };

        switch (k.id) {
            case 'system_uptime': {
                const d = generateMockData('DB_UPTIME') || { UPTIME_PERCENT: 0 };
                const val = (d.UPTIME_PERCENT || 0) * 100; // if DB_UPTIME returns fraction
                sample.value = typeof d.UPTIME_PERCENT === 'number' && d.UPTIME_PERCENT <= 1 ? Math.round(d.UPTIME_PERCENT * 100) + '%' : (d.UPTIME_PERCENT || 'N/A');
                sample.trend = generateTrendData(typeof d.UPTIME_PERCENT === 'number' ? Math.round((d.UPTIME_PERCENT || 0) * 100) : 95);
                break;
            }
            case 'failed_jobs_trend': {
                const d = generateMockData('SM37_GET_JOBS');
                const v = d?.FAILED_JOB_COUNT || 0;
                sample.value = v;
                sample.trend = generateTrendData(v, 7, 0.6);
                sample.status = v > 20 ? 'red' : v > 5 ? 'yellow' : 'green';
                break;
            }
            case 'abap_dumps': {
                const d = generateMockData('ST22_DUMPS');
                const v = d?.DUMP_COUNT || 0;
                sample.value = v;
                sample.trend = generateTrendData(v);
                sample.status = v > 20 ? 'red' : v > 5 ? 'yellow' : 'green';
                break;
            }
            case 'dialog_response_time': {
                const d = generateMockData('ST03N_GET_WORKLOAD');
                const v = d?.WORKLOAD_DATA?.DIALOG_RESPONSE_TIME_AVG || 0;
                sample.value = v ? `${v} ms` : 'N/A';
                sample.trend = generateTrendData(v || 300);
                sample.status = v > 1000 ? 'red' : v > 500 ? 'yellow' : 'green';
                break;
            }
            case 'rfc_errors_volume': {
                const d = generateMockData('SM21_LOGS');
                const v = d?.ERROR_COUNT || 0;
                sample.value = v;
                sample.trend = generateTrendData(v);
                sample.status = v > 100 ? 'red' : v > 20 ? 'yellow' : 'green';
                break;
            }
            case 'idoc_failures': {
                const d = generateMockData('IDOC_STATS');
                const v = d?.IN_ERROR || 0;
                sample.value = v;
                sample.trend = generateTrendData(v, 7, 0.4);
                sample.status = v > 200 ? 'red' : v > 50 ? 'yellow' : 'green';
                break;
            }
            case 'rfc_destinations_health': {
                const d = generateMockData('API_STATS');
                const v = d?.FAILED_CALLS || 0;
                sample.value = v;
                sample.trend = generateTrendData(v);
                sample.status = v > 50 ? 'red' : v > 10 ? 'yellow' : 'green';
                break;
            }
            case 'login_failures': {
                const d = generateMockData('FAILED_LOGINS');
                const v = d?.ATTEMPT_COUNT || 0;
                sample.value = v;
                sample.trend = generateTrendData(v, 7, 0.3);
                sample.status = v > 100 ? 'red' : v > 20 ? 'yellow' : 'green';
                break;
            }
            case 'mttr_ticket_volume': {
                const d = generateMockData('SERVICENOW_KPI');
                const v = d?.MEAN_TIME_TO_RESOLVE_HOURS || d?.TOTAL_TICKET_VOLUME || 0;
                sample.value = d?.MEAN_TIME_TO_RESOLVE_HOURS ? `${d.MEAN_TIME_TO_RESOLVE_HOURS} hrs` : v;
                sample.trend = generateTrendData(typeof v === 'number' ? v : 24);
                sample.status = typeof v === 'number' && v > 48 ? 'red' : 'green';
                break;
            }
            case 'rfc_queue_backlog': {
                const d = generateMockData('IDOC_STATS');
                const v = d?.BACKLOG_VOLUME || 0;
                sample.value = v;
                sample.trend = generateTrendData(v);
                sample.status = v > 500 ? 'red' : v > 200 ? 'yellow' : 'green';
                break;
            }
            case 'critical_user_login_spike': {
                const d = generateMockData('FAILED_LOGINS');
                const v = d?.ATTEMPT_COUNT || 0;
                sample.value = v;
                sample.trend = generateTrendData(v, 7, 0.7);
                sample.status = v > 200 ? 'red' : v > 50 ? 'yellow' : 'green';
                break;
            }
            case 'memory_swap_events': {
                const d = generateMockData('SYSTEM_UTILIZATION');
                const v = d?.MEMORY_UTILIZATION_PERCENT || 0;
                sample.value = typeof v === 'number' ? `${v}%` : v;
                sample.trend = generateTrendData(typeof v === 'number' ? v : 60);
                sample.status = v > 85 ? 'red' : v > 70 ? 'yellow' : 'green';
                break;
            }
            default:
                sample.value = 'N/A';
        }

        return {
            id: k.id,
            name: k.name,
            category: k.category,
            subCategory: k.subCategory,
            frequency: k.frequency,
            dataSource: k.dataSource,
            sample,
            // mark active so frontend can hide/disable cards without code deletion
            active: true
        };
    });

    res.json({ kpis });
}));

// Global error handler for the router
router.use((err, req, res, next) => {
    console.error(`Error processing request for ${req.originalUrl}:`, err);
    res.status(500).json({ error: 'An internal server error occurred', details: err.message });
});


module.exports = router;

