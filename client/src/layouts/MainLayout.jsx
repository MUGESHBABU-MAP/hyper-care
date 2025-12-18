import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider, AppBar, Button } from '@mui/material';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Dashboard, Dns, Speed, Schedule, SyncAlt, Security, VerifiedUser, Business, SupportAgent, Lightbulb, SmartToy } from '@mui/icons-material';
import Breadcrumbs from '../components/Breadcrumbs';

const drawerWidth = 280;

// Full list preserved for future use — we will control visibility via `allowedMenuTexts` below.
const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: 'overview' },
    { text: 'KPI Insights', icon: <Lightbulb />, path: 'insights' },
    { text: 'System Connectivity', icon: <Dns />, path: 'system' },
    { text: 'System Performance', icon: <Speed />, path: 'performance' },
    { text: 'Job & Batch Monitoring', icon: <Schedule />, path: 'jobs' },
    { text: 'Integration & Interfaces', icon: <SyncAlt />, path: 'integration' },
    { text: 'Security & Authorization', icon: <Security />, path: 'security' },
    { text: 'Data & Master Data', icon: <VerifiedUser />, path: 'masterdata' },
    { text: 'Business Process KPIs', icon: <Business />, path: 'business' },
    { text: 'Incident & Support KPIs', icon: <SupportAgent />, path: 'incidents' },
];

// High-level categories (preserved in code; rendering uses route map below)
const highLevelMenu = [
    { group: 'System Stability', items: [
        { text: 'Availability', path: 'overview' },
        { text: 'Job Monitoring', path: 'jobs' },
        { text: 'Dump Monitoring', path: 'performance' },
    ]},
    { group: 'Performance', items: [
        { text: 'Performance', path: 'performance' },
    ]},
    { group: 'Integration Health', items: [
        { text: 'Integration Monitoring', path: 'integration' },
    ]},
    { group: 'Security & Risk', items: [
        { text: 'Security & Audit', path: 'security' },
    ]},
    { group: 'Service Operations', items: [
        { text: 'Incident Mgmt', path: 'incidents' },
    ]},
    { group: 'Integration', items: [
        { text: 'Interfaces', path: 'integration' },
    ]},
    { group: 'Security', items: [
        { text: 'Security', path: 'security' },
    ]},
    { group: 'System', items: [
        { text: 'System Health', path: 'system' },
    ]},
];

const MainLayout = () => {
    const { systemId } = useParams();

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#0066cc' }}>
                <Toolbar>
                    <SmartToy sx={{ mr: 2 }} />
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, flex: 1 }}>
                        SAP Hypercare Monitoring Dashboard
                    </Typography>
                    <Button color="inherit" component={NavLink} to="/agents" sx={{ mr: 2 }}>
                        Agents
                    </Button>
                    <Button color="inherit" component={NavLink} to="/systems">
                        Systems
                    </Button>
                </Toolbar>
            </AppBar>
            {systemId && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { 
                            width: drawerWidth, 
                            boxSizing: 'border-box', 
                            backgroundColor: '#ffffff',
                            borderRight: '1px solid #e0e0e0'
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto', mt: 2, px: 1 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ px: 2, display: 'block' }}>
                            System:
                        </Typography>
                        <Typography variant="h6" noWrap component="div" sx={{ px: 2, pb: 2, fontWeight: 600, color: '#0066cc' }}>
                            {systemId}
                        </Typography>
                        <Divider />
                        {/* Render grouped high-level categories (non-destructive). */}
                        <List>
                            {highLevelMenu.map((group) => (
                                <Box key={group.group} sx={{ px: 1, mb: 1 }}>
                                    <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
                                        {group.group}
                                    </Typography>
                                    {group.items.map(item => (
                                        <ListItem
                                            button
                                            component={NavLink}
                                            to={`/systems/${systemId}/${item.path}`}
                                            key={group.group + '-' + item.text}
                                            sx={{
                                                mx: 1,
                                                borderRadius: 1,
                                                mb: 0.5,
                                                '&.active': {
                                                    backgroundColor: '#e3f2fd',
                                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                                        color: '#0066cc',
                                                        fontWeight: 600,
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                },
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: '#666', minWidth: 40 }}>
                                                {/* Try to find a matching icon from menuItems (fallback to Dashboard) */}
                                                { (menuItems.find(m => m.text.toLowerCase().includes(item.text.split(' ')[0].toLowerCase())) || menuItems[0]).icon }
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={item.text} 
                                                primaryTypographyProps={{ 
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </Box>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            )}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}
            >
                <Toolbar />
                <Breadcrumbs />
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
