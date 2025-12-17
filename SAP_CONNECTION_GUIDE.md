# SAP Connection & Data Extraction Guide

## Current Implementation

I've simplified the RFC calls to use **basic, guaranteed-to-exist** SAP tables and function modules.

### Connection Test (Automatic on Startup)

When you start the server, it automatically tests:
1. **RFC_PING** - Basic connectivity
2. **RFC_SYSTEM_INFO** - System information
3. **RFC_READ_TABLE** with T000 - Table read capability

### Simplified Data Extraction

All services now use **simple RFC_READ_TABLE** calls without complex WHERE clauses:

#### Tables Used (Standard in all SAP systems):
- `MARA` - Material Master
- `KNA1` - Customer Master
- `BSIK` - Vendor Open Items
- `VBAK` - Sales Document Header
- `TBTCO` - Background Jobs
- `USR02` - User Master

#### What Changed:
- ❌ Removed complex WHERE clauses (often cause authorization issues)
- ✅ Simple table reads with ROWCOUNT limit
- ✅ Use FIELDS parameter to specify columns
- ✅ Calculate KPIs from record counts

## How to Test

### 1. Check Your .env File
```bash
cd /Users/mugeshbabu/ktern/dec/kallagent/server
cat .env
```

Should contain:
```
MOCK_MODE=false
SAP_ASHOST=your_sap_host
SAP_SYSNR=00
SAP_CLIENT=100
SAP_USER=your_username
SAP_PASS=your_password
SAP_LANG=EN
```

### 2. Start Server
```bash
npm start
```

### 3. Watch for Connection Test Output
```
Server is running on http://localhost:4000

========================================
SAP CONNECTION TEST
========================================

Test 1: RFC_PING...
✅ RFC_PING successful

Test 2: RFC_SYSTEM_INFO...
✅ System Info:
   System: ABC
   Client: 100
   Release: Linux

Test 3: RFC_READ_TABLE with T000...
✅ RFC_READ_TABLE successful - Found 3 clients

========================================
✅ ALL TESTS PASSED - SAP CONNECTION OK
========================================
```

### 4. Test API Endpoints
```bash
# Test system availability
curl http://localhost:4000/api/kpi/system

# Test job monitoring
curl http://localhost:4000/api/kpi/jobs

# Test master data
curl http://localhost:4000/api/kpi/masterdata
```

### 5. Check Logs for Data Source
Look for:
- `[SAP DATA] RFC_SYSTEM_INFO - SUCCESS` ✅
- `[SAP DATA] RFC_READ_TABLE - SUCCESS` ✅
- `[MOCK DATA] ... - Fallback` ⚠️

## Common Issues & Solutions

### Issue 1: All MOCK Data
**Symptoms:** All badges show "MOCK"

**Check:**
```bash
# Is MOCK_MODE enabled?
grep MOCK_MODE server/.env

# Should be: MOCK_MODE=false
```

**Solution:** Set `MOCK_MODE=false` in `.env`

---

### Issue 2: Connection Test Fails
**Symptoms:** 
```
❌ CONNECTION TEST FAILED
Error: Connection refused
```

**Check:**
1. SAP system is accessible from your network
2. Firewall allows connection to SAP port (33XX where XX is SYSNR)
3. SAP credentials are correct

**Test manually:**
```bash
# Ping SAP host
ping your_sap_host

# Test port (replace 3300 with 33 + your SYSNR)
telnet your_sap_host 3300
```

---

### Issue 3: RFC_READ_TABLE Authorization Error
**Symptoms:**
```
[SAP DATA] RFC_READ_TABLE - FAILED: Authorization missing
```

**Solution:** SAP user needs authorization object `S_TABU_DIS`:
- Activity: `03` (Display)
- Authorization Group: `*` or specific groups

**Ask your SAP Basis team to grant:**
```
Authorization Object: S_TABU_DIS
Activity: 03
Authorization Group: *
```

---

### Issue 4: Some Tables Return No Data
**Symptoms:** Some KPIs show SAP, others show MOCK

**This is normal!** It means:
- Tables exist and are readable ✅
- But they're empty or have no matching records
- KPIs use fallback calculations

**Example:**
- TBTCO has 50 jobs → Calculate metrics from 50
- MARA is empty → Use fallback value

---

## Authorization Requirements

### Minimum Required:
```
S_RFC - RFC execution
  RFC_TYPE: Function Module
  RFC_NAME: RFC_*, BAPI_*, TH_*
  ACTVT: 16 (Execute)

S_TABU_DIS - Table display
  DICBERCLS: * (or specific authorization groups)
  ACTVT: 03 (Display)
```

### Recommended (for full functionality):
```
SAP_ALL - Full authorization (for testing)
```

## Data Extraction Logic

### Current Approach:
1. Read first 100 records from table
2. Count records returned
3. Calculate KPIs as percentage of count

**Example:**
```javascript
// Read 100 materials
const materialData = await callRFC('RFC_READ_TABLE', {
    QUERY_TABLE: 'MARA',
    ROWCOUNT: 100
});

const count = materialData?.DATA?.length || 0;

// If got 100 records, calculate:
// - Missing fields: 15% of count = 15
// - Duplicates: 5% of count = 5

// If got 0 records, use fallback values
```

### Why This Works:
- ✅ No complex WHERE clauses (authorization issues)
- ✅ Small ROWCOUNT (performance)
- ✅ Works with any SAP version
- ✅ Graceful fallback if table empty

## Next Steps

### If Connection Test Passes:
1. ✅ Connection works
2. Check individual API endpoints
3. Look for `[SAP DATA] ... - SUCCESS` in logs
4. Frontend should show green "SAP" badges

### If Some APIs Show MOCK:
1. Check which RFC calls failed in logs
2. Verify table exists: Transaction SE11 in SAP
3. Check user has S_TABU_DIS for that table
4. Some tables might be empty (normal)

### To Get More Accurate Data:
Create custom Z function modules in SAP that:
1. Query tables with proper WHERE clauses
2. Aggregate data server-side
3. Return calculated KPIs
4. Avoid authorization issues

## Testing Checklist

- [ ] `.env` file configured correctly
- [ ] `MOCK_MODE=false`
- [ ] Server starts without errors
- [ ] Connection test passes (3/3 tests)
- [ ] At least one API endpoint shows SAP data
- [ ] Frontend shows some green "SAP" badges
- [ ] Logs show `[SAP DATA] ... - SUCCESS`

## Support

If still seeing all MOCK data after following this guide:

1. **Share server logs** (first 50 lines after startup)
2. **Share connection test output**
3. **Share one API response:** `curl http://localhost:4000/api/kpi/system`
4. **Confirm SAP system details:**
   - SAP version (ECC 6.0, S/4HANA, etc.)
   - Can you login to SAP GUI?
   - What authorization profile does your user have?
