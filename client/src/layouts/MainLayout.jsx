import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider, AppBar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Dashboard, Dns, Speed, Schedule, SyncAlt, Security, VerifiedUser, Business, SupportAgent } from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/dashboard/overview' },
    { text: 'System Connectivity', icon: <Dns />, path: '/dashboard/system' },
    { text: 'System Performance', icon: <Speed />, path: '/dashboard/performance' },
    { text: 'Job & Batch Monitoring', icon: <Schedule />, path: '/dashboard/jobs' },
    { text: 'Integration & Interfaces', icon: <SyncAlt />, path: '/dashboard/integration' },
    { text: 'Security & Authorization', icon: <Security />, path: '/dashboard/security' },
    { text: 'Data & Master Data', icon: <VerifiedUser />, path: '/dashboard/masterdata' },
    { text: 'Business Process KPIs', icon: <Business />, path: '/dashboard/business' },
    { text: 'Incident & Support KPIs', icon: <SupportAgent />, path: '/dashboard/incidents' },
];

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#0066cc' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                        SAP Hypercare Monitoring Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
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
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem 
                                button 
                                component={NavLink} 
                                to={item.path} 
                                key={item.text}
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
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ 
                                        fontSize: item.text === 'Overview' ? '0.95rem' : '0.9rem',
                                        fontWeight: item.text === 'Overview' ? 600 : 400
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
