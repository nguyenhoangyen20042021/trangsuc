import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Person as PersonIcon,
  ReceiptLong as OrdersIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  LocalShipping as TrackIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../services/api';

const MOCK_ORDER_HISTORY = [
  {
    id: 'LB886291',
    date: '26/10/2026',
    items: 'Nhẫn Kim Cương Solitaire Eternal Grace (Size 10)',
    total: 28500000,
    status: 'DangGiao',
    statusText: 'Đang Giao Hàng',
    statusColor: 'primary'
  },
  {
    id: 'LB754210',
    date: '15/09/2026',
    items: 'Dây Chuyền Mặt Tim Royal Romance Moissanite',
    total: 16800000,
    status: 'DaGiao',
    statusText: 'Giao Thành Công',
    statusColor: 'success'
  }
];

export const ProfilePage = () => {
  const location = useLocation();
  const { currentUser, notify } = useAuth();

  const [activeTab, setActiveTab] = useState(location.hash === '#orders' ? 1 : 0);

  const [formData, setFormData] = useState({
    fullName: currentUser?.HoTen || '',
    phone: currentUser?.SoDienThoai || '',
    email: currentUser?.Email || '',
    address: currentUser?.DiaChi || ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    notify('Đã cập nhật thông tin cá nhân thành công!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      notify('Mật khẩu mới không trùng khớp!', 'error');
      return;
    }
    notify('Đã đổi mật khẩu thành công!', 'success');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Box sx={{ py: 6, pb: 14 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 4, color: '#2C1F20' }}
        >
          Tài Khoản Của Tôi
        </Typography>

        <Grid container spacing={4}>
          {/* User Meta Card Left */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: '1px solid rgba(183, 110, 121, 0.18)',
                bgcolor: '#FFFFFF',
                textAlign: 'center',
                boxShadow: '0 6px 24px rgba(183, 110, 121, 0.06)'
              }}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(183, 110, 121, 0.25)'
                }}
              >
                {currentUser?.HoTen?.charAt(0) || 'U'}
              </Avatar>

              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {currentUser?.HoTen || 'Quý Khách'}
              </Typography>

              <Chip
                label={currentUser?.TenVaiTro === 'ADMIN' ? '👑 Quản Trị Viên' : '💎 Khách Hàng VIP'}
                color="primary"
                size="small"
                sx={{ mt: 1, mb: 2, fontWeight: 700 }}
              />

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currentUser?.Email || 'user@lunabelle.vn'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {currentUser?.SoDienThoai || '0987654321'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Tabs
                orientation="vertical"
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                sx={{
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    borderRadius: 2,
                    mb: 0.8,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none'
                  }
                }}
              >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Hồ Sơ Cá Nhân" />
                <Tab icon={<OrdersIcon />} iconPosition="start" label="Lịch Sử Mua Hàng" />
                <Tab icon={<LockIcon />} iconPosition="start" label="Bảo Mật & Mật Khẩu" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Tab Content Right */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                border: '1px solid rgba(183, 110, 121, 0.18)',
                bgcolor: '#FFFFFF',
                boxShadow: '0 6px 24px rgba(183, 110, 121, 0.06)'
              }}
            >
              {/* Tab 0: Profile form */}
              {activeTab === 0 && (
                <Box component="form" onSubmit={handleSaveProfile}>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                    Thông Tin Cá Nhân
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        label="Họ và tên"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        label="Số điện thoại"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        type="email"
                        label="Email nhận thông báo"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Địa chỉ giao hàng mặc định"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SaveIcon />}
                        sx={{ borderRadius: 30, px: 4, fontWeight: 700, mt: 1 }}
                      >
                        Lưu Cập Nhật
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab 1: Orders list */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                    Lịch Sử Đơn Hàng Của Bạn
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: '#FFF5F3' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Mã Đơn</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Ngày Đặt</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Sản Phẩm</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Tổng Tiền</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {MOCK_ORDER_HISTORY.map((ord) => (
                          <TableRow key={ord.id}>
                            <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                              #{ord.id}
                            </TableCell>
                            <TableCell>{ord.date}</TableCell>
                            <TableCell sx={{ maxWidth: 220 }}>{ord.items}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(ord.total)}</TableCell>
                            <TableCell>
                              <Chip
                                label={ord.statusText}
                                color={ord.statusColor}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                component={Link}
                                to={`/order-tracking?code=${ord.id}`}
                                size="small"
                                variant="outlined"
                                startIcon={<TrackIcon />}
                                sx={{ borderRadius: 20, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                              >
                                Theo dõi
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Tab 2: Change password */}
              {activeTab === 2 && (
                <Box component="form" onSubmit={handleChangePassword}>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                    Đổi Mật Khẩu Bảo Mật
                  </Typography>

                  <Stack spacing={2.5} sx={{ maxWidth: 450 }}>
                    <TextField
                      required
                      fullWidth
                      type="password"
                      label="Mật khẩu hiện tại"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    />
                    <TextField
                      required
                      fullWidth
                      type="password"
                      label="Mật khẩu mới"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                    <TextField
                      required
                      fullWidth
                      type="password"
                      label="Nhập lại mật khẩu mới"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ borderRadius: 30, py: 1.2, fontWeight: 700 }}
                    >
                      Xác Nhận Đổi Mật Khẩu
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
