import React from 'react';
import { Chip } from '@mui/material';
import { Schedule, AccessTime, CalendarToday, TouchApp } from '@mui/icons-material';

const KPIFrequencyBadge = ({ frequency }) => {
  const getFrequencyConfig = (freq) => {
    switch (freq) {
      case '5min':
      case '5-15min':
        return { label: 'Real-time', color: 'error', icon: <AccessTime fontSize="small" /> };
      case '15min':
      case '15-30min':
        return { label: 'Frequent', color: 'warning', icon: <Schedule fontSize="small" /> };
      case '30min':
      case 'hourly':
        return { label: 'Hourly', color: 'info', icon: <Schedule fontSize="small" /> };
      case 'daily':
        return { label: 'Daily', color: 'success', icon: <CalendarToday fontSize="small" /> };
      case 'on-demand':
        return { label: 'On-Demand', color: 'default', icon: <TouchApp fontSize="small" /> };
      default:
        return { label: freq, color: 'default', icon: <Schedule fontSize="small" /> };
    }
  };

  const config = getFrequencyConfig(frequency);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default KPIFrequencyBadge;
