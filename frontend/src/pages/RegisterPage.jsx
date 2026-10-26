import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Grid
} from '@mui/material';
import {
  Diamond as DiamondIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, notify } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      notify('Mật khẩu xác nhận không trùng khớp!', 'error');
      return;
    }
    if (!formData.agreeTerms) {
      notify('Vui lòng đồng ý với điều khoản dịch vụ của LUNA BELLE!', 'warning');
      return;
    }

    // Auto login
    login({
      MaNguoiDung: Math.floor(Math.random() * 1000) + 10,
      TenDangNhap: formData.username,
      HoTen: formData.fullName,
      Email: formData.email,
      SoDienThoai: formData.phone,
      TenVaiTro: 'CUSTOMER',
      DiaChi: 'TP. Hồ Chí Minh'
    });

    notify('Đăng ký tài khoản thành công! Chào mừng quý khách.', 'success');
    navigate('/');
  };

  return (
    <Box sx={{ py: 8, pb: 14 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 4,
            border: '1px solid rgba(183, 110, 121, 0.2)',
            bgcolor: '#FFFFFF',
            boxShadow: '0 10px 40px rgba(183, 110, 121, 0.08)'
          }}
        >
          {/* Logo Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: 'rgba(183, 110, 121, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
                color: 'primary.main',
                border: '1px solid rgba(183, 110, 121, 0.25)'
              }}
            >
              <DiamondIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
              Tạo Tài Khoản
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Trở thành thành viên VIP để nhận đặc quyền bảo dưỡng trọn đời
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  label="Họ và tên của bạn"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Tên đăng nhập"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Địa chỉ Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Tôi đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật của LUNA BELLE.
                    </Typography>
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<RegisterIcon />}
                  sx={{
                    py: 1.4,
                    borderRadius: 30,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 24px rgba(183, 110, 121, 0.3)'
                  }}
                >
                  Đăng Ký Tài Khoản
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Đã có tài khoản?{' '}
              <MuiLink component={Link} to="/login" color="primary" sx={{ fontWeight: 700, textDecoration: 'none' }}>
                Đăng nhập ngay
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
