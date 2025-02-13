import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PageManager from './pages/PageManager';
import WebsiteList from './pages/WebsiteList';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { authService } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  if (!authService.isAuthenticated()) {
    return children;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/pages" element={
              <PrivateRoute>
                <PageManager />
              </PrivateRoute>
            } />
            <Route path="/websites" element={
              <PrivateRoute>
                <WebsiteList />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
