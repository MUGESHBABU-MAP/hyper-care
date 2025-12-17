# Hypercare Monitoring Agent - Version 1 Features

## Overview
This document describes the new features implemented based on manager requirements for the Version 1 release.

## Key Features Implemented

### 1. **Agent Management System**
- **Create Monitoring Agents**: Configure custom monitoring agents with specific KPI sets
- **Agent Scheduling**: Support for multiple execution frequencies (5min, 15min, 30min, hourly, daily)
- **Agent Lifecycle**: Enable/disable agents, view execution status, and manage configurations
- **Location**: Navigate to `/agents` to access the Agent Management page

### 2. **KPI Frequency Support**
Based on the Excel requirements, KPIs are categorized by execution frequency:
- **5-15 min intervals**: System Uptime, IDoc Failures, RFC Destinations Health, RFC Queue Backlog, Memory Swap Events
- **15-30 min intervals**: ABAP Dumps, Login Failures
- **Hourly**: Dialog Response Time
- **Daily**: Failed Background Jobs Trend, Critical User Login Spike
- **On-demand**: MTTR & Ticket Volume

### 3. **KPI Categories & Organization**
KPIs are organized into high-level categories as per Excel:
- **System Stability**: Availability, Job Monitoring, Dump Monitoring
- **Performance**: Response Time, RFC Errors
- **Integration Health**: IDoc Monitoring, RFC Destinations
- **Security & Risk**: Login Failures, Security Audit
- **Service Operations**: Incident Management
- **Integration**: RFC Queue Management
- **Security**: User Login Monitoring
- **System**: System Health Monitoring

### 4. **KPI Insights & Recommendations**
- **Intelligent Analysis**: Each KPI value is analyzed with severity assessment (Success, Info, Warning, Error)
- **Actionable Recommendations**: Context-specific recommendations for each KPI
- **Location**: Navigate to `/systems/:systemId/insights` to view KPI insights
- **API Endpoint**: `POST /api/kpi-insights` with `{kpiId, value}`

### 5. **Report Download Feature**
- **24-Hour Reports**: Download last 24 hours of KPI data
- **CSV Format**: Export data in CSV format for analysis
- **Customizable Time Range**: Select 1 hour, 6 hours, 24 hours, or 7 days
- **Download Options**:
  - From Agent Management page: Click download icon on any agent card
  - From Execution History page: Click "Download Report" button
- **API Endpoint**: `GET /api/agents/:id/report?format=csv&hours=24`

### 6. **Agent Creation Workflow**
The agent creation process is designed to be intuitive:

**Step 1: Navigate to Agent Management**
- Click "Agents" in the top navigation bar
- Click "Create Agent" button

**Step 2: Configure Agent Details**
- Enter agent name (e.g., "Production Monitoring Agent")
- Add description (e.g., "Monitors critical KPIs for production system")
- Select target system (S4HANA_PROD, S4HANA_QA, S4HANA_DEV)
- Choose execution schedule (5min, 15min, 30min, hourly, daily)

**Step 3: Select KPIs**
- KPIs are organized by category in expandable sections
- Each category shows the count of selected KPIs
- Each KPI displays:
  - KPI name
  - Execution frequency
  - Data source
- Select relevant KPIs based on monitoring needs

**Step 4: Save and Activate**
- Agent is created and immediately available
- View agent status, next run time, and last execution
- Enable/disable agent as needed

### 7. **Scheduled Agent Representation**
Agents display comprehensive scheduling information:
- **Current Status**: Active/Paused indicator
- **Last Run**: Timestamp of last execution
- **Next Run**: Scheduled next execution time
- **Execution History**: View detailed history of all executions
- **Performance Metrics**: Success rate, average duration, failure count

### 8. **Version 1 KPI Set**
The following 12 KPIs are included in Version 1 (as per Excel):

| KPI Name | Category | Frequency | Recurring | Monetizable |
|----------|----------|-----------|-----------|-------------|
| System Uptime % | System Stability | 5-15min | Yes | Yes |
| Failed Background Jobs Trend | System Stability | Daily | Yes | Yes |
| ABAP Dumps (ST22) | System Stability | 15-30min | Yes | Yes |
| Dialog Response Time | Performance | Hourly | Yes | Yes |
| RFC Errors Volume | Performance | 15min | Yes | Yes |
| IDoc Failures | Integration Health | 5-15min | Yes | Yes |
| RFC Destinations Health | Integration Health | 5min | Yes | Yes |
| Login Failures | Security & Risk | 15-30min | Yes | Yes |
| MTTR & Ticket Volume | Service Operations | On-demand | Yes | Yes |
| RFC Queue Backlog | Integration | 5-15min | Yes | Yes |
| Critical User Login Spike | Security | Daily | Partial | Partial |
| Memory Swap Events | System | 5-15min | Yes | Yes |

## API Endpoints

### Agent Management
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent details
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### KPI Definitions
- `GET /api/kpi-definitions` - Get all KPI definitions
- `GET /api/kpi-definitions/by-category` - Get KPIs grouped by category

### Insights & Analysis
- `POST /api/kpi-insights` - Get insights for a KPI value

### Execution & Reporting
- `GET /api/agents/:id/history?hours=24` - Get execution history
- `GET /api/agents/:id/report?format=csv&hours=24` - Download report

## User Workflows

### Workflow 1: Create a Daily Monitoring Agent
1. Navigate to `/agents`
2. Click "Create Agent"
3. Enter name: "Daily Production Health Check"
4. Select schedule: "Daily"
5. Select KPIs: System Uptime, Failed Jobs, Login Failures
6. Click "Create"
7. Agent will run daily and collect data

### Workflow 2: View KPI Insights
1. Navigate to any system (e.g., `/systems/S4HANA_PROD`)
2. Click "KPI Insights" in the sidebar
3. View intelligent analysis for each KPI
4. Review recommendations for issues
5. Take action based on insights

### Workflow 3: Download 24-Hour Report
1. Navigate to `/agents`
2. Find the agent you want to report on
3. Click the download icon
4. CSV file downloads with last 24 hours of data
5. Open in Excel/Google Sheets for analysis

### Workflow 4: Monitor Agent Execution
1. Navigate to `/agents`
2. Click on any agent card
3. View execution history with timestamps
4. Filter by time range (1h, 6h, 24h, 7d)
5. Check success/failure status
6. Download detailed report if needed

## Technical Architecture

### Backend Services
- **agentService.js**: Manages agent lifecycle and execution history
- **kpiInsights.js**: Provides intelligent KPI analysis
- **reportService.js**: Generates downloadable reports
- **kpiDefinitions.js**: Central KPI metadata configuration

### Frontend Components
- **AgentManagement.jsx**: Main agent management interface
- **AgentCreationDialog.jsx**: Agent creation/editing dialog
- **KPIInsightsPage.jsx**: KPI insights and recommendations
- **AgentExecutionHistory.jsx**: Execution history viewer

### Data Flow
1. User creates agent with selected KPIs
2. Agent executes on schedule
3. Execution results stored in history
4. Insights generated based on KPI values
5. Reports generated from historical data
6. User downloads reports or views insights

## Future Enhancements
- Real-time KPI execution (currently mock data)
- Email/Slack notifications for critical KPIs
- Custom threshold configuration per KPI
- Multi-system agent support
- Advanced analytics and trending
- Integration with SAP Solution Manager
- Machine learning for anomaly detection

## Configuration Files
- `/server/src/config/kpiDefinitions.js` - KPI metadata and frequency settings
- `/server/src/services/kpiInsights.js` - Insight rules and recommendations

## Testing the Features
1. Start backend: `cd server && npm start`
2. Start frontend: `cd client && npm run dev`
3. Navigate to `http://localhost:3000`
4. Default route redirects to `/agents`
5. Create a test agent and explore features
