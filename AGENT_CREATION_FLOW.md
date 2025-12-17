# Agent Creation Flow - Visual Guide

## User Journey: Creating a Monitoring Agent

```
┌─────────────────────────────────────────────────────────────────┐
│                     STEP 1: Landing Page                        │
│                                                                 │
│  User navigates to: http://localhost:3000                      │
│  ↓                                                              │
│  Automatically redirected to: /agents                          │
│  ↓                                                              │
│  Sees: Agent Management Dashboard                              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Monitoring Agents                    [Create Agent]  │    │
│  │                                                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │ Agent Card 1 │  │ Agent Card 2 │  │ Agent Card 3│ │    │
│  │  │ ● Active     │  │ ○ Paused     │  │ ● Active    │ │    │
│  │  │ Daily        │  │ Hourly       │  │ 15min       │ │    │
│  │  │ 5 KPIs       │  │ 8 KPIs       │  │ 3 KPIs      │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    User clicks "Create Agent"
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 2: Agent Configuration                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Create New Agent                              [X]    │    │
│  │  ─────────────────────────────────────────────────    │    │
│  │                                                        │    │
│  │  Agent Name: [Production Critical Monitoring____]     │    │
│  │                                                        │    │
│  │  Description:                                          │    │
│  │  [Monitor critical KPIs for production system___]     │    │
│  │  [_____________________________________________]       │    │
│  │                                                        │    │
│  │  System: [S4HANA Production ▼]                        │    │
│  │                                                        │    │
│  │  Schedule: [Every 15 minutes ▼]                       │    │
│  │    Options:                                            │    │
│  │    • Every 5 minutes                                   │    │
│  │    • Every 15 minutes  ← Selected                      │    │
│  │    • Every 30 minutes                                  │    │
│  │    • Hourly                                            │    │
│  │    • Daily                                             │    │
│  │                                                        │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    User scrolls down to KPI selection
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   STEP 3: KPI Selection                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Select KPIs to Monitor                                │    │
│  │                                                        │    │
│  │  ▼ System Stability                            [3]    │    │
│  │    ☑ System Uptime %              [Real-time]         │    │
│  │      Source: SAP ABAP | MMONSTAT, THSAPSTAT           │    │
│  │    ☑ Failed Background Jobs       [Daily]             │    │
│  │      Source: SM37 | BAPI_XBP_JOB_STATUS_GETLIST       │    │
│  │    ☑ ABAP Dumps (ST22)            [Frequent]           │    │
│  │      Source: SAP ABAP | SNAP, SNAP_INDEX              │    │
│  │                                                        │    │
│  │  ▼ Performance                                 [2]    │    │
│  │    ☑ Dialog Response Time         [Hourly]            │    │
│  │      Source: ST03N | SWNC_GET_WORKLOAD_STATISTIC      │    │
│  │    ☑ RFC Errors Volume            [Frequent]          │    │
│  │      Source: SAP Logs | RFCLOG                        │    │
│  │                                                        │    │
│  │  ▶ Integration Health                          [0]    │    │
│  │  ▶ Security & Risk                             [0]    │    │
│  │  ▶ Service Operations                          [0]    │    │
│  │                                                        │    │
│  │                          [Cancel]  [Create]           │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      User clicks "Create"
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   STEP 4: Agent Created                         │
│                                                                 │
│  Backend Processing:                                            │
│  1. POST /api/agents                                            │
│  2. Generate agent ID                                           │
│  3. Calculate next run time                                     │
│  4. Initialize execution history                                │
│  5. Return agent object                                         │
│                                                                 │
│  Frontend Updates:                                              │
│  1. Close dialog                                                │
│  2. Refresh agent list                                          │
│  3. Show new agent card                                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Monitoring Agents                    [Create Agent]  │    │
│  │                                                        │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │ Production Critical Monitoring        ● Active│     │    │
│  │  │ Monitor critical KPIs for production system  │     │    │
│  │  │                                              │     │    │
│  │  │ System: S4HANA_PROD                          │     │    │
│  │  │ Schedule: Every 15 minutes                   │     │    │
│  │  │ KPIs: 5                                      │     │    │
│  │  │ Last Run: Never                              │     │    │
│  │  │ Next Run: 2024-01-15 10:15:00               │     │    │
│  │  │                                              │     │    │
│  │  │ [⏸] [✏] [🗑] [⬇]                            │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Agent Lifecycle States

```
┌──────────┐
│ Created  │ ← Initial state after creation
└────┬─────┘
     │
     ↓
┌──────────┐
│  Active  │ ← Agent is enabled and running on schedule
└────┬─────┘
     │
     ├─────→ [Executing] ← Temporary state during KPI collection
     │           │
     │           ↓
     │      [Recording] ← Saving execution results
     │           │
     │           ↓
     ├────── [Complete] ← Back to Active, waiting for next run
     │
     ↓
┌──────────┐
│  Paused  │ ← User disabled the agent
└────┬─────┘
     │
     ↓
┌──────────┐
│ Deleted  │ ← Agent removed from system
└──────────┘
```

## KPI Execution Flow

```
Agent Schedule Trigger
        │
        ↓
┌───────────────────┐
│ Check Agent State │
└────────┬──────────┘
         │
         ↓ (if Active)
┌───────────────────┐
│ Load KPI List     │
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│ For Each KPI:     │
│ 1. Call Service   │
│ 2. Get Value      │
│ 3. Generate Insight│
│ 4. Record Result  │
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│ Update Agent      │
│ - lastRun         │
│ - nextRun         │
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│ Store in History  │
└───────────────────┘
```

## Category-Based KPI Organization

```
High-Level Categories
│
├─ System Stability
│  ├─ Availability
│  │  └─ System Uptime % [5-15min]
│  ├─ Job Monitoring
│  │  └─ Failed Background Jobs [Daily]
│  └─ Dump Monitoring
│     └─ ABAP Dumps (ST22) [15-30min]
│
├─ Performance
│  └─ Performance
│     ├─ Dialog Response Time [Hourly]
│     └─ RFC Errors Volume [15min]
│
├─ Integration Health
│  └─ Integration Monitoring
│     ├─ IDoc Failures [5-15min]
│     └─ RFC Destinations Health [5min]
│
├─ Security & Risk
│  └─ Security & Audit
│     └─ Login Failures [15-30min]
│
├─ Service Operations
│  └─ Incident Mgmt
│     └─ MTTR & Ticket Volume [On-demand]
│
├─ Integration
│  └─ Interfaces
│     └─ RFC Queue Backlog [5-15min]
│
├─ Security
│  └─ Security
│     └─ Critical User Login Spike [Daily]
│
└─ System
   └─ System Health
      └─ Memory Swap Events [5-15min]
```

## Frequency Distribution

```
Real-time (5-15 min)     ████████ 5 KPIs
Frequent (15-30 min)     ███ 2 KPIs
Hourly                   ██ 1 KPI
Daily                    ███ 2 KPIs
On-demand                ██ 1 KPI
```

## Report Generation Flow

```
User Action: Click Download
        │
        ↓
┌───────────────────────────────┐
│ GET /api/agents/:id/report    │
│ ?format=csv&hours=24          │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Fetch Execution History       │
│ - Filter by time range        │
│ - Group by KPI                │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Generate Report Structure     │
│ - Summary section             │
│ - KPI details                 │
│ - Execution timeline          │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Format as CSV                 │
│ - Headers                     │
│ - Data rows                   │
│ - Metadata                    │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Send to Browser               │
│ Content-Type: text/csv        │
│ Content-Disposition: attachment│
└────────┬──────────────────────┘
         │
         ↓
    User Downloads File
```

## Insight Generation Flow

```
KPI Value Received
        │
        ↓
┌───────────────────────────────┐
│ POST /api/kpi-insights        │
│ { kpiId, value }              │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Load Insight Rules for KPI    │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Evaluate Value Against Rules  │
│ - Parse numeric/string value  │
│ - Apply threshold logic       │
│ - Determine severity          │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Generate Insight Object       │
│ {                             │
│   severity: 'warning',        │
│   message: '...',             │
│   recommendations: [...]      │
│ }                             │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Return to Frontend            │
└────────┬──────────────────────┘
         │
         ↓
┌───────────────────────────────┐
│ Display in UI                 │
│ - Color-coded alert           │
│ - Icon indicator              │
│ - Recommendation list         │
└───────────────────────────────┘
```

## Navigation Structure

```
http://localhost:3000
│
├─ /agents (Default Landing)
│  │
│  ├─ View all agents
│  ├─ Create new agent
│  ├─ Edit agent
│  ├─ Delete agent
│  ├─ Download report
│  └─ Toggle enable/disable
│
├─ /agents/:agentId/history
│  │
│  ├─ View execution timeline
│  ├─ Filter by time range
│  └─ Download detailed report
│
├─ /systems
│  │
│  └─ View all systems
│
└─ /systems/:systemId
   │
   ├─ /overview
   ├─ /insights ← NEW
   │  │
   │  ├─ View KPI analysis
   │  ├─ See severity indicators
   │  └─ Read recommendations
   │
   ├─ /system
   ├─ /performance
   ├─ /jobs
   ├─ /integration
   ├─ /security
   ├─ /masterdata
   ├─ /business
   └─ /incidents
```
