# Test Logging Output

## How to Test

1. **Start your server:**
   ```bash
   cd /Users/mugeshbabu/ktern/dec/kallagent/server
   npm start
   ```

2. **Make API calls from frontend or curl:**
   ```bash
   # Test System Availability
   curl http://localhost:4000/api/kpi/system
   
   # Test Job Monitoring
   curl http://localhost:4000/api/kpi/jobs
   
   # Test Integration
   curl http://localhost:4000/api/kpi/integration
   ```

## Expected Log Output

### When Connected to SAP (MOCK_MODE=false)

```
Server is running on http://localhost:4000
SAP RFC connection established.

[SERVICE] getSystemAvailability - START
[SAP DATA] RFC_SYSTEM_INFO - SUCCESS
[SAP DATA] TH_USER_LIST - SUCCESS
[SERVICE] getSystemAvailability - COMPLETE

[SERVICE] getJobMonitoring - START
[SAP DATA] BAPI_XBP_JOB_SELECT - SUCCESS
[SERVICE] getJobMonitoring - COMPLETE

[SERVICE] getIntegrationInterfaces - START
[SAP DATA] BAPI_IDOCTYPE_READ_RELEASE - SUCCESS
[SERVICE] getIntegrationInterfaces - COMPLETE
```

### When SAP Call Fails (Fallback to Mock)

```
Server is running on http://localhost:4000
SAP RFC connection established.

[SERVICE] getSystemAvailability - START
[SAP DATA] RFC_SYSTEM_INFO - FAILED: Function module not found
[MOCK DATA] RFC_SYSTEM_INFO - Fallback
[SAP DATA] TH_USER_LIST - SUCCESS
[SERVICE] getSystemAvailability - COMPLETE
```

### When in Mock Mode (MOCK_MODE=true)

```
Server is running on http://localhost:4000

[SERVICE] getSystemAvailability - START
[MOCK DATA] RFC_SYSTEM_INFO
[MOCK DATA] TH_USER_LIST
[SERVICE] getSystemAvailability - COMPLETE

[SERVICE] getJobMonitoring - START
[MOCK DATA] BAPI_XBP_JOB_SELECT
[SERVICE] getJobMonitoring - COMPLETE
```

## Understanding the Logs

### ✅ Success Indicators
- `[SAP DATA] ... - SUCCESS` = Real data from SAP
- `SAP RFC connection established.` = Connected to SAP

### ⚠️ Fallback Indicators
- `[SAP DATA] ... - FAILED:` = SAP call failed
- `[MOCK DATA] ... - Fallback` = Using mock data instead

### 📝 Mock Mode Indicators
- `[MOCK DATA] ...` (without "Fallback") = Running in mock mode
- No "SAP RFC connection established" message

## Quick Analysis

Count your data sources:
```bash
# In your terminal while server is running
# Count successful SAP calls
grep -c "SAP DATA.*SUCCESS" 

# Count failed SAP calls
grep -c "SAP DATA.*FAILED"

# Count mock data usage
grep -c "MOCK DATA"
```

## All API Endpoints

Test all endpoints to see complete logging:

```bash
curl http://localhost:4000/api/kpi/system        # System Availability
curl http://localhost:4000/api/kpi/performance   # System Performance
curl http://localhost:4000/api/kpi/jobs          # Job Monitoring
curl http://localhost:4000/api/kpi/integration   # Integration Interfaces
curl http://localhost:4000/api/kpi/security      # Security & Authorization
curl http://localhost:4000/api/kpi/masterdata    # Master Data Quality
curl http://localhost:4000/api/kpi/business      # Business Process KPIs
curl http://localhost:4000/api/kpi/incidents     # Incidents & Tickets
```

Each endpoint will show:
1. `[SERVICE] <serviceName> - START`
2. Multiple `[SAP DATA]` or `[MOCK DATA]` calls
3. `[SERVICE] <serviceName> - COMPLETE`
