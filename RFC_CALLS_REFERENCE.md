# RFC Calls Reference

## Quick Reference for All SAP RFC Calls

### System Availability

```javascript
// 1. System uptime from monitoring table
RFC_READ_TABLE({
    QUERY_TABLE: 'MMONSTAT',
    DELIMITER: '|',
    ROWCOUNT: 100,
    OPTIONS: [{ TEXT: "DATUM >= '20231201'" }]
})

// 2. Active users
TH_USER_LIST({})

// 3. Total users for license calculation
RFC_READ_TABLE({
    QUERY_TABLE: 'USR02',
    DELIMITER: '|',
    ROWCOUNT: 10000,
    OPTIONS: [{ TEXT: "USTYP <> 'S'" }]
})
```

### Job Monitoring

```javascript
// 1. Job status list
BAPI_XBP_JOB_STATUS_GETLIST({
    JOBNAME: '*',
    USERNAME: '*',
    FROM_DATE: '20240101',
    TO_DATE: '20240102'
})

// 2. Long-running jobs
RFC_READ_TABLE({
    QUERY_TABLE: 'TBTCO',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "STRTDATE = '20240101' AND STATUS = 'R'" }]
})
```

### System Performance

```javascript
// 1. Workload statistics (ST03N)
SWNC_GET_WORKLOAD_STATISTIC({
    READ_START_DATE: '20240101',
    READ_START_TIME: '000000',
    READ_END_DATE: '20240102',
    READ_END_TIME: '235959'
})

// 2. ABAP dumps (ST22)
RFC_READ_TABLE({
    QUERY_TABLE: 'SNAP',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "DATUM >= '20231225'" }]
})

// 3. System log errors (SM21)
RFC_READ_TABLE({
    QUERY_TABLE: 'BALDAT',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "DATUM >= '20240101' AND MSGTY = 'E'" }]
})

// 4. Expensive SQL (HANA)
RFC_READ_TABLE({
    QUERY_TABLE: 'M_EXPENSIVE_STATEMENTS',
    DELIMITER: '|',
    ROWCOUNT: 100
})
```

### Integration Interfaces

```javascript
// 1. IDoc errors (status 51)
RFC_READ_TABLE({
    QUERY_TABLE: 'EDIDS',
    DELIMITER: '|',
    ROWCOUNT: 10000,
    OPTIONS: [{ TEXT: "CREDAT >= '20240101' AND STATUS = '51'" }]
})

// 2. Total IDocs processed
RFC_READ_TABLE({
    QUERY_TABLE: 'EDIDC',
    DELIMITER: '|',
    ROWCOUNT: 50000,
    OPTIONS: [{ TEXT: "CREDAT >= '20240101'" }]
})

// 3. RFC destinations
RFC_READ_TABLE({
    QUERY_TABLE: 'RFCDES',
    DELIMITER: '|',
    ROWCOUNT: 1000
})

// 4. Ping RFC destination
RFC_PING({
    DESTINATION: 'DEST_NAME'
})
```

### Master Data Quality

```javascript
// 1. Materials with missing mandatory fields
RFC_READ_TABLE({
    QUERY_TABLE: 'MARA',
    DELIMITER: '|',
    ROWCOUNT: 10000,
    OPTIONS: [{ TEXT: "MEINS = '' OR MATKL = ''" }]
})

// 2. Customer master
RFC_READ_TABLE({
    QUERY_TABLE: 'KNA1',
    DELIMITER: '|',
    ROWCOUNT: 10000
})

// 3. GR/IR mismatch
RFC_READ_TABLE({
    QUERY_TABLE: 'BSIK',
    DELIMITER: '|',
    ROWCOUNT: 5000,
    OPTIONS: [{ TEXT: "SHKZG = 'S' AND AUGBL = ''" }]
})

// 4. Stuck sales documents
RFC_READ_TABLE({
    QUERY_TABLE: 'VBUK',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "GBSTK = 'A' AND LFSTK = 'A'" }]
})
```

### Security & Authorization

```javascript
// 1. Authorization failures
RFC_READ_TABLE({
    QUERY_TABLE: 'BALDAT',
    DELIMITER: '|',
    ROWCOUNT: 5000,
    OPTIONS: [{ TEXT: "DATUM >= '20231225' AND MSGID = '01' AND MSGNR = '000'" }]
})

// 2. Failed login attempts
RFC_READ_TABLE({
    QUERY_TABLE: 'BALDAT',
    DELIMITER: '|',
    ROWCOUNT: 5000,
    OPTIONS: [{ TEXT: "DATUM >= '20240101' AND MSGID = 'AU' AND MSGNR = '003'" }]
})

// 3. Locked users
RFC_READ_TABLE({
    QUERY_TABLE: 'USR02',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "UFLAG = '64' OR UFLAG = '128'" }]
})

// 4. Inactive users (no login in 90 days)
RFC_READ_TABLE({
    QUERY_TABLE: 'USR02',
    DELIMITER: '|',
    ROWCOUNT: 5000,
    OPTIONS: [{ TEXT: "TRDAT < '20231003'" }]
})
```

### Business Process KPIs

```javascript
// 1. Failed sales orders (OTC)
RFC_READ_TABLE({
    QUERY_TABLE: 'VBUK',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "GBSTK = 'C'" }]
})

// 2. PO creation errors (P2P)
RFC_READ_TABLE({
    QUERY_TABLE: 'EKKO',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "AEDAT >= '20231225' AND BSTYP = 'F'" }]
})

// 3. Posting errors (Finance)
RFC_READ_TABLE({
    QUERY_TABLE: 'BKPF',
    DELIMITER: '|',
    ROWCOUNT: 5000,
    OPTIONS: [{ TEXT: "CPUDT >= '20231225' AND STBLG <> ''" }]
})

// 4. Stuck production orders (Manufacturing)
RFC_READ_TABLE({
    QUERY_TABLE: 'AFKO',
    DELIMITER: '|',
    ROWCOUNT: 1000,
    OPTIONS: [{ TEXT: "GLTRP < '20240101' AND FTRMS = '1'" }]
})
```

## Date Format Helper

```javascript
const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0].replace(/-/g, '');
};

// Usage:
// Today: getDateDaysAgo(0) → '20240101'
// Yesterday: getDateDaysAgo(1) → '20231231'
// 7 days ago: getDateDaysAgo(7) → '20231225'
```

## Common RFC_READ_TABLE Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| QUERY_TABLE | SAP table name | 'MARA', 'VBAK', 'BKPF' |
| DELIMITER | Field separator in result | '\|', ';', '~' |
| ROWCOUNT | Max rows to return | 100, 1000, 10000 |
| OPTIONS | WHERE clause conditions | [{ TEXT: "FIELD = 'VALUE'" }] |
| FIELDS | Specific fields to return | [{ FIELDNAME: 'MATNR' }] |

## SAP Table Status Codes

### IDoc Status (EDIDS.STATUS)
- `51` - Error
- `53` - Posted successfully
- `64` - Ready for transfer

### Job Status (TBTCO.STATUS)
- `F` - Finished (failed)
- `A` - Aborted
- `R` - Running
- `S` - Scheduled

### Sales Document Status (VBUK.GBSTK)
- `A` - Open
- `B` - Partially processed
- `C` - Completely processed

### User Lock Flag (USR02.UFLAG)
- `64` - Locked by administrator
- `128` - Locked due to failed logins

## Authorization Objects Required

- `S_TABU_DIS` - Table display authorization
- `S_RFC` - RFC execution
- `S_BTCH_JOB` - Job monitoring
- `S_ADMI_FCD` - System administration functions

## Testing RFC Calls in SAP

Use transaction `SE37` to test function modules:
1. Enter function module name (e.g., `RFC_READ_TABLE`)
2. Click "Test/Execute" (F8)
3. Fill parameters
4. Execute and view results
