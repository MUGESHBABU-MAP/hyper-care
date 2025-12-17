# Data Source Tag Implementation

## Overview
Added visual indicators throughout the UI to show users whether data is from actual SAP system or mock data.

## Backend Changes

### 1. sapConnection.js
Added data source tracking:
- `dataSourceTracker` - Tracks each RFC call result (SAP or MOCK)
- `getDataSource()` - Returns overall data source status:
  - `'SAP'` - All calls successful from SAP
  - `'MOCK'` - All calls using mock data
  - `'MIXED'` - Some SAP, some mock
  - `'UNKNOWN'` - No calls made yet
- `resetDataSourceTracker()` - Resets tracker for each service call

### 2. All Service Files
Each service now:
1. Resets tracker at start
2. Makes RFC calls (tracked automatically)
3. Returns `_dataSource` field in response

**Services Updated:**
- ✅ systemAvailability.js
- ✅ jobMonitoring.js
- ✅ systemPerformance.js
- ✅ integrationInterfaces.js
- ✅ dataMaster.js
- ✅ securityAuthorization.js
- ✅ businessProcess.js
- ✅ incidents.js

## Frontend Changes

### 1. KpiCard.jsx
Added data source badge:
- Small colored badge in top-right corner of each KPI card
- Colors:
  - 🟢 Green = SAP data
  - 🟠 Orange = Mock data
  - 🔵 Blue = Mixed data
  - ⚪ Gray = Unknown

### 2. DashboardPage.jsx
Added two indicators:
1. **Page-level badge** - Shows overall data source for entire page
2. **Card-level badge** - Shows data source on each KPI card

## Visual Examples

### SAP Data (Green)
```
┌─────────────────────────────┐
│ KPI TITLE            [SAP] │
│                             │
│ 99.9%                       │
│ ▁▂▃▄▅▆▇█                   │
└─────────────────────────────┘
```

### Mock Data (Orange)
```
┌─────────────────────────────┐
│ KPI TITLE           [MOCK] │
│                             │
│ 99.9%                       │
│ ▁▂▃▄▅▆▇█                   │
└─────────────────────────────┘
```

### Mixed Data (Blue)
```
┌─────────────────────────────┐
│ KPI TITLE          [MIXED] │
│                             │
│ 99.9%                       │
│ ▁▂▃▄▅▆▇█                   │
└─────────────────────────────┘
```

## API Response Format

### Before
```json
{
  "SAP application uptime %": {
    "value": "99.9",
    "status": "green",
    "trend": [...]
  }
}
```

### After
```json
{
  "_dataSource": "SAP",
  "SAP application uptime %": {
    "value": "99.9",
    "status": "green",
    "trend": [...]
  }
}
```

## How It Works

### Backend Flow
1. Service function starts → `resetDataSourceTracker()`
2. Each `callRFC()` → Tracks result as 'SAP' or 'MOCK'
3. Service function ends → `getDataSource()` calculates overall status
4. Response includes `_dataSource` field

### Frontend Flow
1. Fetch data from API
2. Extract `_dataSource` from response
3. Display page-level badge in header
4. Pass `_dataSource` to each KPI card
5. Display card-level badge on each card

## Testing

### 1. Start Server
```bash
cd server && npm start
```

### 2. Start Frontend
```bash
cd client && npm run dev
```

### 3. Check UI
Open `http://localhost:3000` and verify:
- ✅ Page header shows "Data Source: SAP/MOCK/MIXED"
- ✅ Each KPI card shows small badge in top-right
- ✅ Colors match data source (green=SAP, orange=MOCK, blue=MIXED)

### 4. Test Scenarios

**Scenario 1: All SAP Data**
- Set `MOCK_MODE=false` in `.env`
- Ensure SAP connection works
- Expected: Green "SAP" badges everywhere

**Scenario 2: All Mock Data**
- Set `MOCK_MODE=true` in `.env`
- Expected: Orange "MOCK" badges everywhere

**Scenario 3: Mixed Data**
- Set `MOCK_MODE=false`
- Some RFC calls fail (e.g., missing authorization)
- Expected: Blue "MIXED" badges

## Color Coding

| Data Source | Color | Hex Code | Meaning |
|-------------|-------|----------|---------|
| SAP | Green | #4caf50 | Real SAP data |
| MOCK | Orange | #ff9800 | Mock/fallback data |
| MIXED | Blue | #2196f3 | Some SAP, some mock |
| UNKNOWN | Gray | #9e9e9e | No data yet |

## Benefits

1. **Transparency** - Users know exactly where data comes from
2. **Trust** - Clear indication of real vs simulated data
3. **Debugging** - Easy to spot when SAP connection fails
4. **Monitoring** - Quick visual check of system health

## User Experience

### For End Users
- Clear visual indicator on every page
- No confusion about data authenticity
- Confidence in real-time SAP data

### For Administrators
- Quick diagnosis of connection issues
- Easy to spot partial failures
- Monitor SAP integration health

## Future Enhancements

1. **Tooltip** - Hover over badge to see details
2. **Timestamp** - Show when data was last updated
3. **History** - Track data source changes over time
4. **Alerts** - Notify when switching from SAP to MOCK
5. **Dashboard** - Overall system health view

## Troubleshooting

### Badge shows MOCK but should be SAP
1. Check server logs for `[SAP DATA] ... - FAILED`
2. Verify SAP connection in `.env`
3. Check user authorizations in SAP
4. Review specific RFC error messages

### Badge shows MIXED
- Some RFC calls succeeded, others failed
- Check logs to identify which calls failed
- Grant missing authorizations in SAP
- Some tables might not exist in your SAP version

### No badge showing
- Check browser console for errors
- Verify API response includes `_dataSource`
- Ensure frontend is latest version
- Clear browser cache

## Implementation Complete ✅

**Backend:** All 8 services return `_dataSource`  
**Frontend:** All pages display data source badges  
**Testing:** Ready for user acceptance testing  
**Documentation:** Complete
