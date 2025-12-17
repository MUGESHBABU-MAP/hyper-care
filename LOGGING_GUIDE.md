# Logging Guide

## Log Format

All API calls now include clear logging to distinguish between SAP data and mock data.

### Log Prefixes

- **`[SAP DATA]`** - Data successfully retrieved from SAP system
- **`[MOCK DATA]`** - Data generated from mock/fallback
- **`[SERVICE]`** - Service function execution tracking

### Example Logs

#### Successful SAP Connection
```
SAP RFC connection established.
[SERVICE] getSystemAvailability - START
[SAP DATA] RFC_SYSTEM_INFO - SUCCESS
[SAP DATA] TH_USER_LIST - SUCCESS
[SERVICE] getSystemAvailability - COMPLETE
```

#### Failed SAP Call with Fallback
```
SAP RFC connection established.
[SERVICE] getJobMonitoring - START
[SAP DATA] BAPI_XBP_JOB_SELECT - FAILED: Function module not found
[MOCK DATA] BAPI_XBP_JOB_SELECT - Fallback
[SERVICE] getJobMonitoring - COMPLETE
```

#### Mock Mode
```
[MOCK DATA] RFC_SYSTEM_INFO
[MOCK DATA] TH_USER_LIST
```

## Monitoring Your Application

### Check Data Source
Look for these patterns in your server logs:

1. **All SAP Data** (Best case)
   - All logs show `[SAP DATA] ... - SUCCESS`
   - No `[MOCK DATA]` fallback messages

2. **Mixed Data** (Partial SAP connection)
   - Some `[SAP DATA] ... - SUCCESS`
   - Some `[SAP DATA] ... - FAILED` followed by `[MOCK DATA] ... - Fallback`

3. **All Mock Data** (No SAP connection or MOCK_MODE=true)
   - All logs show `[MOCK DATA]`
   - No `[SAP DATA]` messages

### Quick Check Command
```bash
# See all data sources
tail -f server/logs/app.log | grep -E "\[SAP DATA\]|\[MOCK DATA\]"

# Count successful SAP calls
grep "[SAP DATA].*SUCCESS" server/logs/app.log | wc -l

# Count fallback to mock
grep "[MOCK DATA].*Fallback" server/logs/app.log | wc -l
```

## Service Functions

Each service logs its execution:

1. **systemAvailability** - System uptime and user metrics
2. **jobMonitoring** - Background job statistics
3. **integrationInterfaces** - IDoc and API metrics
4. **systemPerformance** - Performance and workload data
5. **dataMaster** - Master data quality metrics
6. **securityAuthorization** - Security and authorization data
7. **businessProcess** - Business process KPIs
8. **incidents** - ServiceNow ticket metrics

## Troubleshooting

### If you see mostly MOCK DATA:
1. Check SAP connection parameters in `.env`
2. Verify SAP user has RFC authorization
3. Check if BAPIs exist in your SAP system (transaction SE37)

### If you see FAILED messages:
- The BAPI might not exist in your SAP version
- User might lack authorization for that BAPI
- Parameters might be incorrect for your SAP system

### To force mock mode:
Set in `server/.env`:
```
MOCK_MODE=true
```
