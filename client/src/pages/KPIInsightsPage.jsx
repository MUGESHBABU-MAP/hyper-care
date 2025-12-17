import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const KPIInsightsPage = () => {
  const { systemId } = useParams();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    loadInsights();
  }, [systemId]);

  const loadInsights = async () => {
    // Mock data - in real implementation, fetch from backend
    const mockInsights = [
      { kpiId: 'system_uptime', name: 'System Uptime %', value: '99.95', category: 'System Stability' },
      { kpiId: 'failed_jobs_trend', name: 'Failed Background Jobs', value: '3', category: 'System Stability' },
      { kpiId: 'dialog_response_time', name: 'Dialog Response Time', value: '450', category: 'Performance' },
      { kpiId: 'idoc_failures', name: 'IDoc Failures', value: '12', category: 'Integration Health' }
    ];

    const insightsWithAnalysis = await Promise.all(
      mockInsights.map(async (kpi) => {
        try {
          const response = await axios.post('http://localhost:4000/api/kpi-insights', {
            kpiId: kpi.kpiId,
            value: kpi.value
          });
          return { ...kpi, insight: response.data };
        } catch (error) {
          console.error('Error loading insight:', error);
          return kpi;
        }
      })
    );

    setInsights(insightsWithAnalysis);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      default: return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>KPI Insights & Recommendations</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        AI-powered analysis and actionable recommendations for your KPIs
      </Typography>

      <Grid container spacing={3}>
        {insights.map((item) => (
          <Grid item xs={12} key={item.kpiId}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {item.insight && getSeverityIcon(item.insight.severity)}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip label={item.category} size="small" />
                      <Chip label={`Value: ${item.value}`} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Box>

                {item.insight && (
                  <>
                    <Alert severity={getSeverityColor(item.insight.severity)} sx={{ mb: 2 }}>
                      {item.insight.message}
                    </Alert>

                    {item.insight.recommendations && item.insight.recommendations.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Recommendations:
                        </Typography>
                        <List dense>
                          {item.insight.recommendations.map((rec, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={`• ${rec}`} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIInsightsPage;
