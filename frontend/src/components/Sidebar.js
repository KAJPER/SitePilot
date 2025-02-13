import React from 'react';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Box,
    Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WebIcon from '@mui/icons-material/Web';
import ArticleIcon from '@mui/icons-material/Article';
import MenuIcon from '@mui/icons-material/Menu';
import ImageIcon from '@mui/icons-material/Image';

const drawerWidth = 240;

function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Strony WWW', icon: <WebIcon />, path: '/websites' },
        { text: 'Artykuły', icon: <ArticleIcon />, path: '/pages' },
        { text: 'Menu', icon: <MenuIcon />, path: '/menus' },
        { text: 'Media', icon: <ImageIcon />, path: '/media' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1a237e',
                    color: 'white',
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div">
                    SitePilot
                </Typography>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: 'white' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar; 