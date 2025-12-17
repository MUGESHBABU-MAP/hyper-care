// KPI Insights and Recommendations
const KPI_INSIGHTS = {
  system_uptime: {
    getInsight: (value) => {
      const uptime = parseFloat(value);
      if (uptime >= 99.9) return { severity: 'success', message: 'Excellent system availability. Meets enterprise SLA standards.' };
      if (uptime >= 99.5) return { severity: 'info', message: 'Good uptime. Monitor for any degradation patterns.' };
      if (uptime >= 99.0) return { severity: 'warning', message: 'Uptime below optimal. Review recent restart events and system logs.' };
      return { severity: 'error', message: 'Critical: System availability is below acceptable levels. Immediate investigation required.' };
    },
    recommendations: [
      'Enable high availability configuration',
      'Review system restart patterns',
      'Check for hardware or network issues',
      'Implement automated failover mechanisms'
    ]
  },
  
  failed_jobs_trend: {
    getInsight: (value) => {
      const failed = parseInt(value);
      if (failed === 0) return { severity: 'success', message: 'No failed jobs detected. Background processing is healthy.' };
      if (failed <= 5) return { severity: 'info', message: 'Minor job failures detected. Review and reprocess if needed.' };
      if (failed <= 20) return { severity: 'warning', message: 'Elevated job failure rate. Investigate common failure patterns.' };
      return { severity: 'error', message: 'High job failure rate impacting business processes. Immediate action required.' };
    },
    recommendations: [
      'Review SM37 for failure details',
      'Check variant configurations',
      'Verify authorization for job users',
      'Analyze system resources during job execution'
    ]
  },
  
  abap_dumps: {
    getInsight: (value) => {
      const dumps = parseInt(value);
      if (dumps === 0) return { severity: 'success', message: 'No ABAP dumps. System stability is excellent.' };
      if (dumps <= 3) return { severity: 'info', message: 'Few dumps detected. Monitor for recurring patterns.' };
      if (dumps <= 10) return { severity: 'warning', message: 'Multiple dumps detected. Review ST22 for root causes.' };
      return { severity: 'error', message: 'Critical: High dump frequency indicates serious stability issues.' };
    },
    recommendations: [
      'Analyze dump types in ST22',
      'Review recent transports and changes',
      'Check for timeout or memory issues',
      'Engage development team for code fixes'
    ]
  },
  
  dialog_response_time: {
    getInsight: (value) => {
      const time = parseInt(value);
      if (time <= 500) return { severity: 'success', message: 'Excellent response time. Users experiencing optimal performance.' };
      if (time <= 1000) return { severity: 'info', message: 'Acceptable response time. Monitor for degradation.' };
      if (time <= 2000) return { severity: 'warning', message: 'Response time degrading. User productivity may be impacted.' };
      return { severity: 'error', message: 'Critical: Poor response time severely impacting user experience.' };
    },
    recommendations: [
      'Review ST03N workload analysis',
      'Check database performance',
      'Analyze expensive SQL statements',
      'Consider system tuning or scaling'
    ]
  },
  
  rfc_errors_volume: {
    getInsight: (value) => {
      const errors = parseInt(value);
      if (errors === 0) return { severity: 'success', message: 'No RFC errors. Interface communication is stable.' };
      if (errors <= 10) return { severity: 'info', message: 'Minor RFC errors. Review destination configurations.' };
      if (errors <= 50) return { severity: 'warning', message: 'Elevated RFC error rate. Check network and destination systems.' };
      return { severity: 'error', message: 'Critical: High RFC error volume disrupting integrations.' };
    },
    recommendations: [
      'Test RFC destinations in SM59',
      'Verify network connectivity',
      'Check destination system availability',
      'Review RFC user authorizations'
    ]
  },
  
  idoc_failures: {
    getInsight: (value) => {
      const failures = parseInt(value);
      if (failures === 0) return { severity: 'success', message: 'All IDocs processing successfully.' };
      if (failures <= 20) return { severity: 'info', message: 'Few IDoc errors. Reprocess failed IDocs.' };
      if (failures <= 100) return { severity: 'warning', message: 'Significant IDoc failures. Review partner configurations.' };
      return { severity: 'error', message: 'Critical: High IDoc failure rate impacting business integrations.' };
    },
    recommendations: [
      'Review WE02/WE05 for error details',
      'Check partner profile configurations',
      'Verify port and RFC destination settings',
      'Reprocess failed IDocs after fixes'
    ]
  },
  
  rfc_destinations_health: {
    getInsight: (value) => {
      if (value === 'Healthy') return { severity: 'success', message: 'All RFC destinations responding normally.' };
      if (value === 'Degraded') return { severity: 'warning', message: 'Some RFC destinations experiencing issues.' };
      return { severity: 'error', message: 'Critical RFC destinations unavailable.' };
    },
    recommendations: [
      'Ping destinations in SM59',
      'Check target system availability',
      'Verify network routes and firewall rules',
      'Review connection pooling settings'
    ]
  },
  
  login_failures: {
    getInsight: (value) => {
      const failures = parseInt(value);
      if (failures === 0) return { severity: 'success', message: 'No failed login attempts detected.' };
      if (failures <= 10) return { severity: 'info', message: 'Minor login failures. Likely user errors.' };
      if (failures <= 50) return { severity: 'warning', message: 'Elevated login failures. Check for security threats.' };
      return { severity: 'error', message: 'Critical: High login failure rate. Possible security breach attempt.' };
    },
    recommendations: [
      'Review SM21 system log',
      'Check for brute force patterns',
      'Verify user account status',
      'Consider implementing login restrictions'
    ]
  },
  
  mttr_ticket_volume: {
    getInsight: (value) => {
      const hours = parseFloat(value);
      if (hours <= 4) return { severity: 'success', message: 'Excellent incident resolution time.' };
      if (hours <= 24) return { severity: 'info', message: 'Acceptable MTTR. Continue monitoring.' };
      if (hours <= 48) return { severity: 'warning', message: 'MTTR increasing. Review support processes.' };
      return { severity: 'error', message: 'Critical: High MTTR impacting business operations.' };
    },
    recommendations: [
      'Analyze ticket categories',
      'Improve knowledge base',
      'Enhance first-level support training',
      'Implement automated diagnostics'
    ]
  },
  
  rfc_queue_backlog: {
    getInsight: (value) => {
      const backlog = parseInt(value);
      if (backlog === 0) return { severity: 'success', message: 'No RFC queue backlog. Processing is current.' };
      if (backlog <= 100) return { severity: 'info', message: 'Minor backlog. Monitor processing rate.' };
      if (backlog <= 1000) return { severity: 'warning', message: 'Growing backlog. Check destination availability.' };
      return { severity: 'error', message: 'Critical: Large backlog causing integration delays.' };
    },
    recommendations: [
      'Check SMQ1/SMQ2 queues',
      'Verify destination system capacity',
      'Review queue scheduler settings',
      'Consider parallel processing'
    ]
  },
  
  critical_user_login_spike: {
    getInsight: (value) => {
      if (value === 'Normal') return { severity: 'success', message: 'Privileged user activity within baseline.' };
      if (value === 'Elevated') return { severity: 'warning', message: 'Unusual privileged user activity detected.' };
      return { severity: 'error', message: 'Critical: Abnormal privileged user login pattern. Security review needed.' };
    },
    recommendations: [
      'Review SM20 security audit log',
      'Verify user activity legitimacy',
      'Check for compromised accounts',
      'Implement additional monitoring'
    ]
  },
  
  memory_swap_events: {
    getInsight: (value) => {
      const events = parseInt(value);
      if (events === 0) return { severity: 'success', message: 'No memory swapping. System memory is adequate.' };
      if (events <= 5) return { severity: 'info', message: 'Minor swap activity. Monitor memory usage.' };
      if (events <= 20) return { severity: 'warning', message: 'Frequent swapping. System may need more memory.' };
      return { severity: 'error', message: 'Critical: Excessive swapping causing performance degradation.' };
    },
    recommendations: [
      'Review ST06 OS monitor',
      'Analyze memory consumption patterns',
      'Consider increasing system memory',
      'Optimize memory-intensive processes'
    ]
  }
};

const getKPIInsight = (kpiId, value) => {
  const insight = KPI_INSIGHTS[kpiId];
  if (!insight) {
    return {
      severity: 'info',
      message: 'No specific insights available for this KPI.',
      recommendations: []
    };
  }
  
  const analysis = insight.getInsight(value);
  return {
    ...analysis,
    recommendations: insight.recommendations
  };
};

module.exports = { getKPIInsight };
