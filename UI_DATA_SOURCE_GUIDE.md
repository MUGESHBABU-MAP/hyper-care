# UI Data Source Visual Guide

## What Users Will See

### Page Header Badge
Every dashboard page now shows a data source indicator in the top-right corner:

```
┌────────────────────────────────────────────────────────────┐
│  System Connectivity & Availability    [Data Source: SAP]  │
└────────────────────────────────────────────────────────────┘
```

### KPI Card Badges
Each KPI card shows a small badge indicating its data source:

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│ SAP UPTIME %         [SAP] │  │ ACTIVE USERS        [MOCK] │
│                             │  │                             │
│ 99.9%                       │  │ 45                          │
│ ▁▂▃▄▅▆▇█                   │  │ ▁▂▃▄▅▆▇█                   │
└─────────────────────────────┘  └─────────────────────────────┘
```

## Badge Colors & Meanings

### 🟢 Green Badge - "SAP"
**Meaning:** Real-time data from SAP system  
**What it means for users:**
- Data is current and accurate
- Direct connection to SAP is working
- Trust this data for decision-making

**Example:**
```
[SAP]  ← Green background, white text
```

---

### 🟠 Orange Badge - "MOCK"
**Meaning:** Simulated/demo data  
**What it means for users:**
- SAP connection unavailable or in demo mode
- Data is for demonstration purposes
- Do not use for critical decisions

**Example:**
```
[MOCK]  ← Orange background, white text
```

---

### 🔵 Blue Badge - "MIXED"
**Meaning:** Combination of SAP and mock data  
**What it means for users:**
- Some data from SAP, some simulated
- Partial SAP connection issues
- Review carefully before making decisions

**Example:**
```
[MIXED]  ← Blue background, white text
```

---

### ⚪ Gray Badge - "UNKNOWN"
**Meaning:** Data source not yet determined  
**What it means for users:**
- System is loading
- Temporary state during initialization

**Example:**
```
[UNKNOWN]  ← Gray background, white text
```

## Dashboard Examples

### All SAP Data (Ideal State)
```
┌──────────────────────────────────────────────────────────────┐
│  System Connectivity & Availability    [Data Source: SAP]    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │ UPTIME %  [SAP] │  │ USERS     [SAP] │  │ JOBS  [SAP] ││
│  │ 99.9%           │  │ 45              │  │ 150         ││
│  └──────────────────┘  └──────────────────┘  └─────────────┘│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### All Mock Data (Demo Mode)
```
┌──────────────────────────────────────────────────────────────┐
│  System Connectivity & Availability    [Data Source: MOCK]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │ UPTIME % [MOCK] │  │ USERS    [MOCK] │  │ JOBS [MOCK] ││
│  │ 99.9%           │  │ 45              │  │ 150         ││
│  └──────────────────┘  └──────────────────┘  └─────────────┘│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Mixed Data (Partial Connection)
```
┌──────────────────────────────────────────────────────────────┐
│  System Connectivity & Availability    [Data Source: MIXED]  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │ UPTIME %  [SAP] │  │ USERS   [MOCK]  │  │ JOBS  [SAP] ││
│  │ 99.9%           │  │ 45              │  │ 150         ││
│  └──────────────────┘  └──────────────────┘  └─────────────┘│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## All Dashboard Pages

Every page shows data source indicators:

1. **System Connectivity & Availability** - `/system`
2. **Job Monitoring** - `/jobs`
3. **System Performance** - `/performance`
4. **Integration Interfaces** - `/integration`
5. **Master Data Quality** - `/masterdata`
6. **Security & Authorization** - `/security`
7. **Business Process KPIs** - `/business`
8. **Incidents & Tickets** - `/incidents`

## User Actions Based on Badge

### When You See [SAP] (Green)
✅ **Safe to use for:**
- Production decisions
- Real-time monitoring
- Critical analysis
- Reporting to management

### When You See [MOCK] (Orange)
⚠️ **Use with caution:**
- Demo/training purposes only
- Understanding UI layout
- Testing workflows
- NOT for production decisions

### When You See [MIXED] (Blue)
⚠️ **Investigate before using:**
- Check which KPIs are SAP vs MOCK
- Contact administrator
- Verify critical KPIs are from SAP
- Use with caution for decisions

## FAQ

**Q: Why do I see MOCK data?**
A: Either the system is in demo mode, or the SAP connection is unavailable. Contact your administrator.

**Q: Can I trust MIXED data?**
A: Check individual KPI badges. SAP-badged KPIs are trustworthy, MOCK-badged ones are simulated.

**Q: How often does the badge update?**
A: Every time the page refreshes or data is reloaded (typically every 5-15 minutes).

**Q: What if I need all SAP data?**
A: Contact your administrator to check SAP connection and authorizations.

**Q: Is MOCK data realistic?**
A: Yes, MOCK data uses realistic values for demonstration, but it's not real-time from your SAP system.

## For Administrators

### Ensuring SAP Data
1. Check `server/.env` has correct SAP credentials
2. Verify SAP user has required authorizations
3. Test RFC connection: `npm start` and check logs
4. Look for `[SAP DATA] ... - SUCCESS` in logs

### Troubleshooting MOCK Fallback
1. Check server logs for `[SAP DATA] ... - FAILED`
2. Review specific error messages
3. Grant missing authorizations in SAP
4. Verify tables exist in your SAP version

### Monitoring
- Green badges = Healthy
- Orange badges = Connection issues
- Blue badges = Partial issues
- Check logs for root cause

## Technical Details

### Badge Styling
- **Size:** 10px font, compact padding
- **Position:** Top-right corner of each card
- **Font:** Bold, uppercase, high contrast
- **Colors:** Material Design palette

### Accessibility
- High contrast text (white on colored background)
- Clear, readable labels
- Consistent positioning
- Color + text (not color alone)

### Performance
- No additional API calls
- Data source included in existing response
- Minimal UI overhead
- Cached with KPI data

## Summary

✅ **Clear visual indicators** on every page and card  
✅ **Color-coded badges** for quick recognition  
✅ **Transparent data sourcing** for user confidence  
✅ **Easy troubleshooting** for administrators  
✅ **Professional UI** with minimal clutter
