import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Diamond as DiamondIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('khachhang');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
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
          {/* Logo Brand Header */}
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
              Đăng Nhập
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Chào mừng quý khách trở lại với <strong>LUNA BELLE</strong>
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên đăng nhập hoặc Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                required
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="button" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                  label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
                />
                <MuiLink href="#" variant="body2" color="primary" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                  Quên mật khẩu?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.4,
                  borderRadius: 30,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(183, 110, 121, 0.3)'
                }}
              >
                Đăng Nhập Ngay
              </Button>
            </Stack>
          </form>

          {/* Quick Demo Credentials */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed rgba(183, 110, 121, 0.25)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, fontWeight: 600 }}>
              ⚡ CHỌN TÀI KHOẢN MẪU ĐỂ TEST NHANH:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Khách Hàng (khachhang / 123456)"
                onClick={() => setDemoAccount('khachhang', '123456')}
                clickable
                variant="outlined"
                color="primary"
                size="small"
              />
              <Chip
                label="Quản Trị Viên (admin / admin123)"
                onClick={() => setDemoAccount('admin', 'admin123')}
                clickable
                variant="outlined"
                color="secondary"
                size="small"
              />
              <Chip
                label="Nhân Viên (nhanvien / staff123)"
                onClick={() => setDemoAccount('nhanvien', 'staff123')}
                clickable
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Chưa có tài khoản?{' '}
              <MuiLink component={Link} to="/register" color="primary" sx={{ fontWeight: 700, textDecoration: 'none' }}>
                Đăng ký ngay
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
