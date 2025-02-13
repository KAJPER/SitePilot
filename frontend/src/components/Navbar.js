import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!authService.isAuthenticated()) {
        return null;
    }

    return (
        <AppBar 
            position="static" 
            sx={{ 
                backgroundColor: 'white',
                color: 'black',
                boxShadow: 1
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Panel Administratora
                </Typography>
                <Box>
                    <Button 
                        color="inherit" 
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        Wyloguj
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;