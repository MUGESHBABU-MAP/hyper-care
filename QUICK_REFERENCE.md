# Quick Reference Guide - Hypercare Monitoring Agent

## 🚀 Quick Start

```bash
# Start Backend
cd server && npm start

# Start Frontend (new terminal)
cd client && npm run dev

# Open Browser
http://localhost:3000
```

## 📋 Manager's 7 Questions - Quick Answers

| # | Question | Answer | Demo Location |
|---|----------|--------|---------------|
| 1 | KPIs at 5-10 min intervals? | ✅ Yes, 5 KPIs run at 5-15 min | Agent Creation → Frequency badges |
| 2 | KPIs once per day? | ✅ Yes, 2 KPIs run daily | Agent Creation → Select "Daily" |
| 3 | KPI insights? | ✅ Yes, intelligent analysis + recommendations | Systems → KPI Insights |
| 4 | Download 24h report? | ✅ Yes, CSV export with time ranges | Agent Card → Download icon |
| 5 | Category representation? | ✅ Yes, 6 categories properly organized | Agent Creation → Expandable sections |
| 6 | Scheduled agent display? | ✅ Yes, shows status, last/next run | Agent Management page |
| 7 | Agent creation UX? | ✅ Yes, 4-step intuitive wizard | Click "Create Agent" |

## 🎯 12 KPIs from Excel

| KPI | Category | Frequency | Location in UI |
|-----|----------|-----------|----------------|
| System Uptime % | System Stability | 5-15min | System Stability section |
| Failed Jobs Trend | System Stability | Daily | System Stability section |
| ABAP Dumps | System Stability | 15-30min | System Stability section |
| Dialog Response Time | Performance | Hourly | Performance section |
| RFC Errors Volume | Performance | 15min | Performance section |
| IDoc Failures | Integration Health | 5-15min | Integration Health section |
| RFC Destinations Health | Integration Health | 5min | Integration Health section |
| Login Failures | Security & Risk | 15-30min | Security & Risk section |
| MTTR & Ticket Volume | Service Operations | On-demand | Service Operations section |
| RFC Queue Backlog | Integration | 5-15min | Integration section |
| Critical User Login Spike | Security | Daily | Security section |
| Memory Swap Events | System | 5-15min | System section |

## 🔗 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Agent Management | `/agents` | Create, view, manage agents |
| Agent History | `/agents/:id/history` | View execution timeline |
| Systems Overview | `/systems` | View all SAP systems |
| KPI Insights | `/systems/:id/insights` | View intelligent analysis |
| System Dashboard | `/systems/:id/performance` | View system KPIs |

## 🛠️ API Endpoints

### Agent Management
```
POST   /api/agents                    Create agent
GET    /api/agents                    List all agents
GET    /api/agents/:id                Get agent details
PUT    /api/agents/:id                Update agent
DELETE /api/agents/:id                Delete agent
```

### KPI & Insights
```
GET    /api/kpi-definitions           List all KPIs
GET    /api/kpi-definitions/by-category   KPIs by category
POST   /api/kpi-insights              Get KPI insights
```

### Reports & History
```
GET    /api/agents/:id/history?hours=24   Execution history
GET    /api/agents/:id/report?format=csv  Download report
```

## 📊 Frequency Types

| Badge | Frequency | Interval | KPI Count |
|-------|-----------|----------|-----------|
| 🔴 Real-time | 5-15min | Every 5-15 minutes | 5 |
| 🟠 Frequent | 15-30min | Every 15-30 minutes | 2 |
| 🔵 Hourly | Hourly | Every hour | 1 |
| 🟢 Daily | Daily | Once per day | 2 |
| ⚪ On-Demand | Manual | User triggered | 1 |

## 🎨 UI Components

### Agent Card
```
┌─────────────────────────────┐
│ Agent Name          ● Active│
│ Description                 │
│                             │
│ System: S4HANA_PROD         │
│ Schedule: Every 15 minutes  │
│ KPIs: 5                     │
│ Last Run: 2024-01-15 10:00 │
│ Next Run: 2024-01-15 10:15 │
│                             │
│ [⏸] [✏] [🗑] [⬇]          │
└─────────────────────────────┘
```

### KPI Insight Card
```
┌─────────────────────────────┐
│ ✓ System Uptime %           │
│ [System Stability] [99.95%] │
│                             │
│ ✅ Excellent system         │
│    availability. Meets      │
│    enterprise SLA standards.│
│                             │
│ Recommendations:            │
│ • Enable HA configuration   │
│ • Review restart patterns   │
│ • Check hardware issues     │
└─────────────────────────────┘
```

## 🎬 Demo Script (2 Minutes)

### Minute 1: Agent Creation
1. Open `/agents`
2. Click "Create Agent"
3. Name: "Production Monitor"
4. Schedule: "Every 15 minutes"
5. Select 3-5 KPIs from different categories
6. Click "Create"
7. Show agent card with status

### Minute 2: Insights & Reports
1. Navigate to `/systems/S4HANA_PROD/insights`
2. Show KPI analysis with severity
3. Point out recommendations
4. Go back to `/agents`
5. Click download icon
6. Show CSV file in Excel

## 💡 Key Features to Highlight

### 1. Intelligent Insights
- Not just raw data
- Severity-based analysis
- Actionable recommendations
- Context-aware messaging

### 2. Flexible Scheduling
- 5 frequency options
- Automatic next-run calculation
- Enable/disable on demand
- Execution history tracking

### 3. Category Organization
- Industry-standard grouping
- Expandable sections
- Visual KPI count badges
- Easy navigation

### 4. Comprehensive Reporting
- Multiple time ranges
- CSV export format
- Detailed execution data
- Summary statistics

## 🔧 Configuration Files

| File | Purpose | Edit When |
|------|---------|-----------|
| `/server/src/config/kpiDefinitions.js` | KPI metadata | Adding new KPIs |
| `/server/src/services/kpiInsights.js` | Insight rules | Changing thresholds |
| `/server/.env` | Environment config | SAP connection details |

## 📈 Success Metrics

- ✅ 7/7 manager requirements met
- ✅ 12/12 KPIs implemented
- ✅ 10 new API endpoints
- ✅ 5 new UI pages
- ✅ Complete agent lifecycle
- ✅ Intelligent insights
- ✅ Flexible reporting
- ✅ Intuitive UX

## 🐛 Troubleshooting

### Backend won't start
```bash
cd server
rm -rf node_modules
npm install
npm start
```

### Frontend won't start
```bash
cd client
rm -rf node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Backend (port 4000)
lsof -ti:4000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### CORS errors
- Check backend is running on port 4000
- Check frontend proxy in `vite.config.js`
- Restart both servers

## 📝 Common Tasks

### Add a new KPI
1. Edit `/server/src/config/kpiDefinitions.js`
2. Add KPI object to array
3. Edit `/server/src/services/kpiInsights.js`
4. Add insight rule
5. Restart backend

### Change KPI frequency
1. Edit `/server/src/config/kpiDefinitions.js`
2. Update `frequency` field
3. Restart backend

### Customize insights
1. Edit `/server/src/services/kpiInsights.js`
2. Modify `getInsight` function for KPI
3. Update recommendations array
4. Restart backend

## 🎓 Learning Resources

### Code Structure
- Backend: `/server/src/`
- Frontend: `/client/src/`
- Config: `/server/src/config/`
- Services: `/server/src/services/`
- Components: `/client/src/components/`
- Pages: `/client/src/pages/`

### Key Concepts
- **Agent**: Monitoring configuration with KPI set
- **KPI**: Key Performance Indicator to track
- **Insight**: Intelligent analysis of KPI value
- **Execution**: Single run of agent collecting KPI data
- **Report**: Historical data export

## 🚦 Status Indicators

| Icon | Meaning |
|------|---------|
| 🟢 ● Active | Agent is running |
| ⚪ ○ Paused | Agent is disabled |
| ✅ Success | KPI within normal range |
| ⚠️ Warning | KPI needs attention |
| ❌ Error | KPI critical issue |
| ℹ️ Info | KPI informational |

## 📞 Support

For questions or issues:
1. Check `/AGENT_FEATURES.md` for detailed documentation
2. Review `/MANAGER_DEMO_GUIDE.md` for demo guidance
3. See `/IMPLEMENTATION_SUMMARY.md` for technical details
4. Check `/AGENT_CREATION_FLOW.md` for visual flows
