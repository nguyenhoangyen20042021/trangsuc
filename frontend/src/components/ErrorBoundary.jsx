import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FAF8F5',
            py: 8,
            px: 2
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 4,
                border: '1px solid rgba(183, 110, 121, 0.25)',
                bgcolor: '#FFFFFF',
                textAlign: 'center',
                boxShadow: '0 12px 40px rgba(183, 110, 121, 0.1)'
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#8B3A48',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  mb: 2
                }}
              >
                LUNA BELLE
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  color: '#2C1F20',
                  mb: 1.5
                }}
              >
                Đã Xảy Ra Sự Cố Hiển Thị
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 420,
                  mx: 'auto'
                }}
              >
                Hệ thống đang được làm mới để mang lại trải nghiệm tốt nhất. Quý khách vui lòng thử tải lại trang hoặc quay lại trang chủ.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  sx={{ borderRadius: 30, px: 3, fontWeight: 700 }}
                >
                  Tải Lại Trang
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  sx={{ borderRadius: 30, px: 3, fontWeight: 700 }}
                >
                  Về Trang Chủ
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

