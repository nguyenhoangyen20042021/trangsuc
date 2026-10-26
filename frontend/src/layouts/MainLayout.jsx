import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingChatWidget } from '../components/FloatingChatWidget';
import { useAuth } from '../context/AuthContext';

export const MainLayout = () => {
  const { notification, closeNotification } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Footer />

      {/* Floating AI Stylist Chat Widget */}
      <FloatingChatWidget />

      {/* Global Notification Toast */}
      {notification && (
        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={4000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={closeNotification}
            severity={notification.severity || 'info'}
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
