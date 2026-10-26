import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Diamond as ProductIcon,
  Category as CategoryIcon,
  ReceiptLong as OrderIcon,
  People as UserIcon,
  LocalOffer as VoucherIcon,
  SmartToy as AiIcon,
  Storefront as StoreIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const ADMIN_NAV_ITEMS = [
  { text: 'Tổng Quan (Dashboard)', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Quản Lý Sản Phẩm', icon: <ProductIcon />, path: '/admin/products' },
  { text: 'Danh Mục Sản Phẩm', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Quản Lý Đơn Hàng', icon: <OrderIcon />, path: '/admin/orders' },
  { text: 'Người Dùng & Vai Trò', icon: <UserIcon />, path: '/admin/users' },
  { text: 'Mã Giảm Giá (Voucher)', icon: <VoucherIcon />, path: '/admin/vouchers' },
  { text: 'Cấu Hình AI Stylist', icon: <AiIcon />, path: '/admin/ai-settings' },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1E1B24', color: '#FFFFFF' }}>
      {/* Brand Title */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ProductIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '0.08em', color: '#D4AF37' }}>
            LUNA BELLE
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
            ADMIN PORTAL
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Nav links */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.8)',
                  bgcolor: isActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: '#FFFFFF'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(212, 175, 55, 0.15)',
                    borderLeft: '4px solid #D4AF37',
                    '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.2)' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 400 }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Back to Client Store & Logout */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<StoreIcon />}
          fullWidth
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            fontSize: '0.84rem',
            '&:hover': { borderColor: '#D4AF37', color: '#D4AF37' }
          }}
        >
          Xem Website Khách
        </Button>
        <Button
          onClick={() => { logout(); navigate('/login'); }}
          startIcon={<LogoutIcon />}
          fullWidth
          color="error"
          sx={{ fontSize: '0.84rem' }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Hệ Thống Quản Trị Kim Hoàn LUNA BELLE
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline' } }}>
              Xin chào, <strong>{currentUser?.HoTen || 'Admin'}</strong>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: '#F9FAFB'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
