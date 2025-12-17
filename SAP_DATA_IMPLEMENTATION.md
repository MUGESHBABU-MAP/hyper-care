# SAP Data Implementation Guide

## Overview
All KPI services now use actual SAP data extraction based on the ideation phase specifications.

## Implementation Summary

### 1. System Availability (systemAvailability.js)
**Data Sources:**
- `MMONSTAT` - System monitoring statistics for uptime calculation
- `TH_USER_LIST` - Active user count (RFC function)
- `USR02` - Total users for license utilization

**KPIs Implemented:**
- ✅ System Uptime % - Calculated from MMONSTAT active/down records
- ✅ Active user count - From TH_USER_LIST
- ✅ License utilization % - Active users / Total users

**Fallback:** Uses default values if tables are empty

---

### 2. Job Monitoring (jobMonitoring.js)
**Data Sources:**
- `BAPI_XBP_JOB_STATUS_GETLIST` - Job status from last 24 hours
- `TBTCO` - Background job table for long-running jobs

**KPIs Implemented:**
- ✅ Failed job count - Status 'F' or 'A' from BAPI
- ✅ Delayed job count - DELAYED = 'X' flag
- ✅ Long-running job count - Running jobs from TBTCO
- ✅ Job success rate - Calculated from total vs failed

**Fallback:** Uses default values if BAPI returns no data

---

### 3. System Performance (systemPerformance.js)
**Data Sources:**
- `SWNC_GET_WORKLOAD_STATISTIC` - ST03N workload data
- `SNAP` - ABAP dump table (ST22)
- `BALDAT` - System log errors (SM21)
- `M_EXPENSIVE_STATEMENTS` - HANA expensive SQL

**KPIs Implemented:**
- ✅ Dialog response time - From SWNC workload DIALOG tasktype
- ✅ Update task response time - From SWNC workload UPDATE tasktype
- ✅ ABAP dump frequency - Count from SNAP table (last 7 days)
- ✅ System log errors - Count from BALDAT with MSGTY = 'E'
- ✅ Expensive SQL statements - Count from M_EXPENSIVE_STATEMENTS

**Fallback:** Uses default values if RFC calls fail

---

### 4. Integration Interfaces (integrationInterfaces.js)
**Data Sources:**
- `EDIDS` - IDoc status records (status 51 = error)
- `EDIDC` - IDoc control records (all processed)
- `RFCDES` - RFC destination configuration
- `RFC_PING` - RFC destination health check

**KPIs Implemented:**
- ✅ Total IDocs processed - Count from EDIDC (last 24h)
- ✅ IDocs in error - Count from EDIDS with STATUS = '51'
- ✅ Reprocessing success rate - Calculated from total vs errors
- ✅ IDoc backlog volume - Estimated from error count

**Fallback:** Uses default values if tables are empty

---

### 5. Master Data Quality (dataMaster.js)
**Data Sources:**
- `MARA` - Material master (check missing mandatory fields)
- `KNA1` - Customer master (check duplicates)
- `BSIK` - Vendor open items (GR/IR mismatch)
- `VBUK` - Sales document status (stuck documents)

**KPIs Implemented:**
- ✅ Missing mandatory fields - Materials with empty MEINS or MATKL
- ✅ GR/IR mismatch - Open items from BSIK
- ✅ Stuck sales documents - From VBUK with specific status

**Fallback:** Uses default values if tables are empty

---

### 6. Security & Authorization (securityAuthorization.js)
**Data Sources:**
- `BALDAT` - System logs for auth failures and failed logins
- `USR02` - User master for locked/inactive users

**KPIs Implemented:**
- ✅ Authorization failures - From BALDAT (last 7 days)
- ✅ Failed login attempts - From BALDAT (last 24h)
- ✅ Locked users - USR02 with UFLAG = '64' or '128'
- ✅ Inactive users - USR02 with TRDAT < 90 days ago

**Fallback:** Uses default values if tables are empty

---

### 7. Business Process KPIs (businessProcess.js)
**Data Sources:**
- `VBUK` - Sales document status (OTC)
- `EKKO` - Purchase order header (P2P)
- `BKPF` - Accounting document header (Finance)
- `AFKO` - Production order header (Manufacturing)

**KPIs Implemented:**
- ✅ Failed sales orders - VBUK with GBSTK = 'C'
- ✅ PO creation errors - EKKO with BSTYP = 'F'
- ✅ Posting errors - BKPF with reversal documents
- ✅ Stuck production orders - AFKO overdue orders

**Fallback:** Uses default values if tables are empty

---

### 8. Incidents (incidents.js)
**Data Sources:**
- External ServiceNow API (not SAP)

**Status:** Uses calculated/mock values as ServiceNow is external

---

## RFC Functions Used

### Standard BAPIs:
1. `RFC_READ_TABLE` - Generic table read (most common)
2. `BAPI_XBP_JOB_STATUS_GETLIST` - Job monitoring
3. `SWNC_GET_WORKLOAD_STATISTIC` - Performance statistics
4. `TH_USER_LIST` - Active users
5. `RFC_PING` - RFC destination health

### SAP Tables Accessed:
- **System:** MMONSTAT, THSAPSTAT, BALDAT
- **Jobs:** TBTCO, TBTCP
- **Performance:** SNAP, M_EXPENSIVE_STATEMENTS
- **Integration:** EDIDS, EDIDC, RFCDES
- **Master Data:** MARA, KNA1, BSIK, VBUK
- **Security:** USR02, USOBT_C
- **Business:** VBUK, EKKO, BKPF, AFKO

## Authorization Requirements

User needs `SAP_ALL` or specific authorizations:
- `S_TABU_DIS` - Table display authorization
- `S_RFC` - RFC execution authorization
- `S_BTCH_JOB` - Job monitoring authorization
- `S_ADMI_FCD` - System administration

## Logging

All services log:
```
[SERVICE] <serviceName> - START
[SAP DATA] <RFC/Table> - SUCCESS/FAILED
[MOCK DATA] <RFC/Table> - Fallback (if needed)
[SERVICE] <serviceName> - COMPLETE
```

## Testing

1. **Start server:**
   ```bash
   cd server && npm start
   ```

2. **Check logs for data source:**
   - `[SAP DATA] ... - SUCCESS` = Real SAP data
   - `[MOCK DATA] ... - Fallback` = Fallback to mock

3. **Test endpoints:**
   ```bash
   curl http://localhost:4000/api/kpi/system
   curl http://localhost:4000/api/kpi/jobs
   curl http://localhost:4000/api/kpi/performance
   curl http://localhost:4000/api/kpi/integration
   curl http://localhost:4000/api/kpi/masterdata
   curl http://localhost:4000/api/kpi/security
   curl http://localhost:4000/api/kpi/business
   ```

## Next Steps

### Phase 1 (Current): Basic Implementation ✅
- RFC_READ_TABLE for all tables
- Standard BAPIs where available
- Graceful fallback to mock data

### Phase 2 (Future): Optimization
- Create custom Z function modules for complex queries
- Implement caching layer
- Add data aggregation in SAP

### Phase 3 (Future): Advanced Features
- Real-time monitoring with webhooks
- Predictive analytics using historical data
- Custom alerts and thresholds

## Troubleshooting

### If seeing MOCK DATA fallback:
1. Check SAP user has table read authorization
2. Verify table names exist in your SAP version
3. Check RFC connection is stable
4. Review specific error messages in logs

### If RFC_READ_TABLE fails:
- Table might not exist in your SAP version
- User lacks S_TABU_DIS authorization
- Table is buffered and needs different access method

### Performance Issues:
- Reduce ROWCOUNT in RFC_READ_TABLE calls
- Implement caching in Node.js
- Create database views in SAP for complex queries
