import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  FormControlLabel,
  Checkbox,
  Link as MuiLink
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonOutlined as PersonOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
  PhoneOutlined as PhoneOutlinedIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { AllJewelryProductIcon } from '../components/icons/ProductIcons';
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4 },
        px: 2,
        background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 50%, #FAF0E6 100%)'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          mx: 'auto',
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3.5,
          border: '1px solid rgba(197, 168, 128, 0.35)',
          bgcolor: '#FFFFFF',
          boxShadow: '0 12px 40px rgba(44, 31, 32, 0.08), 0 2px 12px rgba(197, 168, 128, 0.12)'
        }}
      >
        {/* Logo Header */}
        <Box sx={{ textAlign: 'center', mb: 2.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: '#FAF5EE',
              border: '1.5px solid #C5A880',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.2,
              color: 'primary.main',
              boxShadow: '0 4px 12px rgba(197, 168, 128, 0.2)'
            }}
          >
            <AllJewelryProductIcon sx={{ fontSize: 24, color: '#8B3A48' }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              color: '#2C1F20',
              letterSpacing: '0.01em',
              mb: 0.5
            }}
          >
            Tạo Tài Khoản
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            Nhận đặc quyền trọn đời cùng <strong style={{ color: '#8B3A48' }}>LUNA BELLE</strong>
          </Typography>
        </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.8}>
              {/* Full Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  label="Họ và tên của bạn"
                  placeholder="VD: Lê Hoàng Yến Nhi"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Username & Phone Number */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Tên đăng nhập"
                  placeholder="VD: yennhi2026"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  placeholder="VD: 0987654321"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Địa chỉ Email"
                  placeholder="VD: yennhi@gmail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Password & Confirm Password */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu..."
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu..."
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Terms Checkbox */}
              <Grid size={{ xs: 12 }} sx={{ pt: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      color="primary"
                      size="small"
                      sx={{ p: 0.5, mr: 0.5 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#555' }}>
                      Tôi đồng ý với các <strong>Điều khoản</strong> & <strong>Chính sách bảo mật</strong> của LUNA BELLE.
                    </Typography>
                  }
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }} sx={{ pt: 0.5 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<PersonAddIcon />}
                  sx={{
                    py: 1.15,
                    borderRadius: 30,
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    letterSpacing: '0.02em',
                    textTransform: 'none',
                    boxShadow: '0 6px 20px rgba(139, 58, 72, 0.28)'
                  }}
                >
                  Đăng Ký Tài Khoản
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Footer Login Link */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
              Đã có tài khoản?{' '}
              <MuiLink
                component={Link}
                to="/login"
                color="primary"
                sx={{ fontWeight: 700, textDecoration: 'none', ml: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                Đăng nhập ngay
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };
