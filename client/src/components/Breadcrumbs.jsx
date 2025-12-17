import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const breadcrumbNameMap = {
    '/dashboard/overview': 'Overview',
    '/dashboard/system': 'System Connectivity',
    '/dashboard/performance': 'System Performance',
    '/dashboard/jobs': 'Job & Batch Monitoring',
    '/dashboard/integration': 'Integration & Interfaces',
    '/dashboard/security': 'Security & Authorization',
    '/dashboard/masterdata': 'Data & Master Data',
    '/dashboard/business': 'Business Process KPIs',
    '/dashboard/incidents': 'Incident & Support KPIs',
};

const Breadcrumbs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPage = breadcrumbNameMap[location.pathname];

    return (
        <MuiBreadcrumbs sx={{ mb: 2 }}>
            <Link
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#666' }}
                onClick={() => navigate('/dashboard/overview')}
            >
                <Home sx={{ mr: 0.5, fontSize: 18 }} />
                Home
            </Link>
            {location.pathname !== '/dashboard/overview' && (
                <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                    {currentPage}
                </Typography>
            )}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;
