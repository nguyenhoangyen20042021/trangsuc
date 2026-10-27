import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  PersonOutlined as PersonOutlinedIcon,
  LockOutlined as LockOutlinedIcon
} from '@mui/icons-material';
import { AllJewelryProductIcon } from '../components/icons/ProductIcons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('khachhang');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    let role = 'CUSTOMER';
    let fullName = 'Lê Hoàng Yến Nhi';
    if (username === 'admin') {
      role = 'ADMIN';
      fullName = 'Quản Trị Viên Cao Cấp';
    } else if (username === 'nhanvien') {
      role = 'STAFF';
      fullName = 'Nguyễn Văn Nhân Viên';
    }

    login({
      MaNguoiDung: username === 'admin' ? 1 : (username === 'nhanvien' ? 2 : 3),
      TenDangNhap: username,
      HoTen: fullName,
      Email: `${username}@lunabelle.vn`,
      SoDienThoai: '0987654321',
      TenVaiTro: role,
      DiaChi: '123 Đồng Khởi, Quận 1, TP. Hồ Chí Minh'
    });

    if (role === 'ADMIN' || role === 'STAFF') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const setDemoAccount = (u, p) => {
    setUsername(u);
    setPassword(p);
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
          maxWidth: 400,
          mx: 'auto',
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3.5,
          border: '1px solid rgba(197, 168, 128, 0.35)',
          bgcolor: '#FFFFFF',
          boxShadow: '0 12px 40px rgba(44, 31, 32, 0.08), 0 2px 12px rgba(197, 168, 128, 0.12)'
        }}
      >
        {/* Logo Brand Header */}
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
              Đăng Nhập
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              Chào mừng quý khách trở lại với <strong style={{ color: '#8B3A48' }}>LUNA BELLE</strong>
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label="Tên đăng nhập hoặc Email"
                placeholder="Nhập tên đăng nhập hoặc email..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

              <TextField
                required
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              {/* Remember me & Forgot Password */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                      sx={{ p: 0.5, mr: 0.5 }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#4A3B32' }}>Ghi nhớ đăng nhập</Typography>}
                />
                <MuiLink
                  component={Link}
                  to="#"
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Quên mật khẩu?
                </MuiLink>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.3,
                  borderRadius: 30,
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  letterSpacing: '0.02em',
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(139, 58, 72, 0.28)'
                }}
              >
                Đăng Nhập Ngay
              </Button>
            </Stack>
          </form>

          {/* Quick Demo Credentials */}
          <Box
            sx={{
              mt: 2.2,
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: '#FAF8F5',
              border: '1px dashed rgba(197, 168, 128, 0.45)',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#8B3A48',
                fontWeight: 700,
                letterSpacing: '0.04em',
                display: 'block',
                mb: 1,
                fontSize: '0.74rem'
              }}
            >
              ⚡ CHỌN TÀI KHOẢN MẪU ĐỂ TEST NHANH:
            </Typography>
            <Stack direction="row" spacing={0.8} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 0.8 }}>
              <Chip
                label="Khách Hàng (123456)"
                onClick={() => setDemoAccount('khachhang', '123456')}
                clickable
                variant={username === 'khachhang' ? 'filled' : 'outlined'}
                color="primary"
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.74rem' }}
              />
              <Chip
                label="Quản Trị Viên (admin123)"
                onClick={() => setDemoAccount('admin', 'admin123')}
                clickable
                variant={username === 'admin' ? 'filled' : 'outlined'}
                color="secondary"
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.74rem' }}
              />
              <Chip
                label="Nhân Viên (staff123)"
                onClick={() => setDemoAccount('nhanvien', 'staff123')}
                clickable
                variant={username === 'nhanvien' ? 'filled' : 'outlined'}
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.74rem' }}
              />
            </Stack>
          </Box>

          {/* Footer Register Link */}
          <Box sx={{ textAlign: 'center', mt: 2.2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
              Chưa có tài khoản?{' '}
              <MuiLink
                component={Link}
                to="/register"
                color="primary"
                sx={{ fontWeight: 700, textDecoration: 'none', ml: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                Đăng ký ngay
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };
