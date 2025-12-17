import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Home, NavigateNext } from '@mui/icons-material';

const breadcrumbNameMap = {
  'overview': 'Overview',
  'system': 'System Connectivity',
  'performance': 'System Performance',
  'jobs': 'Job & Batch Monitoring',
  'integration': 'Integration & Interfaces',
  'security': 'Security & Authorization',
  'masterdata': 'Data & Master Data',
  'business': 'Business Process KPIs',
  'incidents': 'Incident & Support KPIs',
};

const Breadcrumbs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <MuiBreadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 4 }}>
            <Link
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                color="inherit"
                onClick={() => navigate('/systems')}
            >
                <Home sx={{ mr: 0.5, fontSize: 'inherit' }} />
                Systems Overview
            </Link>
            {params.systemId && (
                 <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    color="inherit"
                    onClick={() => navigate(`/systems/${params.systemId}/performance`)}
                >
                    {params.systemId}
                </Link>
            )}
            {pathnames.length > 2 && (
                <Typography color="text.primary">
                    {breadcrumbNameMap[pathnames[2]]}
                </Typography>
            )}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;
