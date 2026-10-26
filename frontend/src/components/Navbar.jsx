import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Badge,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingBag as CartIcon,
  SmartToy as RobotIcon,
  Person as UserIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  KeyboardArrowDown as ArrowDownIcon,
  AdminPanelSettings as AdminIcon,
  ReceiptLong as OrderIcon,
  Logout as LogoutIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MOCK_CATEGORIES } from '../services/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [activeParentCat, setActiveParentCat] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navScrollRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleScrollNav = (direction) => {
    if (navScrollRef.current) {
      const scrollOffset = direction === 'left' ? -220 : 220;
      navScrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const handleOpenCatMenu = (event, cat) => {
    if (cat.children && cat.children.length > 0) {
      setCategoryMenuAnchor(event.currentTarget);
      setActiveParentCat(cat);
    } else {
      navigate(`/products?category=${cat.Slug}`);
    }
  };

  return (
    <>
      {/* 1. Top Luxury Announcement Bar (Cartier / Tiffany Style) */}
      <Box
        sx={{
          bgcolor: '#1E1416',
          color: '#F5E6AB',
          py: 0.8,
          textAlign: 'center',
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
        }}
      >
        ✦ MIỄN PHÍ VẬN CHUYỂN BẢO HIỂM TOÀN QUỐC · BẢO HÀNH KIM CƯƠNG GIA TRỌN ĐỜI ✦
      </Box>

      {/* 2. Main Glassmorphism Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(197, 168, 128, 0.2)',
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 }, justifyContent: 'space-between', gap: 2 }}>
            
            {/* Mobile Hamburger */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#8B3A48' }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo (Refined Serif Typography) */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: 'rgba(212, 175, 55, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B76E79',
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}
              >
                <DiamondIcon sx={{ fontSize: 22, color: '#D4AF37' }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    lineHeight: 1.05,
                    color: '#2C1F20'
                  }}
                >
                  LUNA BELLE
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '0.65rem',
                    letterSpacing: '0.28em',
                    color: '#B76E79',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}
                >
                  Haute Joaillerie
                </Typography>
              </Box>
            </Box>

            {/* Search Input Bar */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                bgcolor: '#FAF8F5',
                borderRadius: 30,
                border: '1px solid rgba(197, 168, 128, 0.25)',
                px: 2,
                py: 0.6,
                flexGrow: 1,
                maxWidth: 440,
                mx: 3,
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  borderColor: '#B76E79',
                  boxShadow: '0 0 0 3px rgba(183, 110, 121, 0.1)',
                  bgcolor: '#FFFFFF'
                }
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 19 }} />
              <InputBase
                fullWidth
                placeholder="Tìm nhẫn kim cương, dây chuyền, bông tai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ fontSize: '0.86rem', color: '#2C1F20' }}
              />
            </Box>

            {/* Action Buttons Right (NO Wishlist button) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, md: 1.5 } }}>
              
              {/* AI Consultant Pill */}
              <Button
                component={Link}
                to="/ai-consultant"
                variant="outlined"
                startIcon={<RobotIcon sx={{ color: '#D4AF37' }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                  bgcolor: 'rgba(212, 175, 55, 0.05)',
                  color: '#2C1F20',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: 30,
                  px: 2,
                  '&:hover': {
                    borderColor: '#D4AF37',
                    bgcolor: 'rgba(212, 175, 55, 0.12)'
                  }
                }}
              >
                Tư vấn AI Stylist
              </Button>

              {/* Cart Button with refined Badge */}
              <Button
                component={Link}
                to="/cart"
                startIcon={
                  <Badge
                    badgeContent={cartCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: '#B76E79',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.7rem'
                      }
                    }}
                  >
                    <CartIcon sx={{ color: '#8B3A48' }} />
                  </Badge>
                }
                sx={{
                  color: '#2C1F20',
                  fontWeight: 600,
                  px: { xs: 1, sm: 2 },
                  minWidth: { xs: 40, sm: 'auto' },
                  borderRadius: 20,
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                  bgcolor: '#FFFFFF',
                  '&:hover': { bgcolor: '#FAF8F5' },
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } }
                }}
              >
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 600 }}>
                  Giỏ hàng
                </Typography>
              </Button>

              {/* User Account / Auth */}
              {currentUser ? (
                <>
                  <Button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    startIcon={<UserIcon sx={{ color: '#8B3A48' }} />}
                    endIcon={<ArrowDownIcon sx={{ fontSize: 16, display: { xs: 'none', sm: 'inline' } }} />}
                    sx={{
                      color: '#2C1F20',
                      borderRadius: 20,
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      border: '1px solid rgba(197, 168, 128, 0.25)',
                      px: { xs: 1, sm: 2 },
                      minWidth: { xs: 40, sm: 'auto' },
                      '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } }
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      {currentUser.HoTen.split(' ').slice(-1)[0]}
                    </Box>
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 3,
                        boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(197, 168, 128, 0.25)'
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {currentUser.HoTen}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#B76E79', fontWeight: 600 }}>
                        {currentUser.TenVaiTro === 'ADMIN' ? '👑 Quản Trị Viên' : '💎 Khách Hàng VIP'}
                      </Typography>
                    </Box>

                    <MenuItem component={Link} to="/profile" onClick={() => setUserMenuAnchor(null)}>
                      <ListItemIcon><UserIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Tài khoản của tôi" />
                    </MenuItem>

                    <MenuItem component={Link} to="/profile#orders" onClick={() => setUserMenuAnchor(null)}>
                      <ListItemIcon><OrderIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Đơn hàng đã mua" />
                    </MenuItem>

                    {['ADMIN', 'STAFF'].includes(currentUser.TenVaiTro) && (
                      <MenuItem component={Link} to="/admin" onClick={() => setUserMenuAnchor(null)} sx={{ color: '#8B3A48' }}>
                        <ListItemIcon><AdminIcon fontSize="small" sx={{ color: '#8B3A48' }} /></ListItemIcon>
                        <ListItemText primary="Trang Quản Trị" />
                      </MenuItem>
                    )}

                    <Divider />

                    <MenuItem onClick={() => { setUserMenuAnchor(null); logout(); }} sx={{ color: 'error.main' }}>
                      <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                      <ListItemText primary="Đăng xuất" />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<UserIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderRadius: 20,
                    px: { xs: 1.2, sm: 2.2 },
                    py: 0.7,
                    minWidth: { xs: 38, sm: 'auto' },
                    background: 'linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #8B3A48 100%)',
                    fontWeight: 700,
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.8 } }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Đăng nhập
                  </Box>
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* 3. Sleek Categories Navigation Bar */}
        <Box
          sx={{
            borderTop: '1px solid rgba(197, 168, 128, 0.15)',
            bgcolor: '#FFFFFF',
            position: 'relative'
          }}
        >
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <IconButton
              size="small"
              onClick={() => handleScrollNav('left')}
              sx={{ color: '#B76E79', display: { xs: 'none', md: 'flex' }, mr: 0.5 }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <Box
              ref={navScrollRef}
              sx={{
                display: 'flex',
                alignItems: 'center',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                py: 0.6,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                gap: 1.2,
                flexGrow: 1
              }}
            >
              <Button
                component={Link}
                to="/"
                sx={{
                  color: location.pathname === '/' ? '#B76E79' : '#2C1F20',
                  fontWeight: location.pathname === '/' ? 700 : 500,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  borderRadius: 16,
                  px: 2,
                  borderBottom: location.pathname === '/' ? '2px solid #B76E79' : '2px solid transparent'
                }}
              >
                TRANG CHỦ
              </Button>

              <Button
                component={Link}
                to="/products"
                sx={{
                  color: location.pathname === '/products' && !location.search ? '#B76E79' : '#2C1F20',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  borderRadius: 16,
                  px: 2
                }}
              >
                TẤT CẢ TRANG SỨC
              </Button>

              {MOCK_CATEGORIES.map((cat) => (
                <Button
                  key={cat.MaDanhMuc}
                  onClick={(e) => handleOpenCatMenu(e, cat)}
                  endIcon={cat.children?.length > 0 ? <ArrowDownIcon sx={{ fontSize: 14 }} /> : null}
                  sx={{
                    color: '#2C1F20',
                    fontWeight: 500,
                    fontSize: '0.84rem',
                    letterSpacing: '0.06em',
                    borderRadius: 16,
                    px: 2,
                    '&:hover': { color: '#B76E79' }
                  }}
                >
                  {cat.TenDanhMuc.toUpperCase()}
                </Button>
              ))}

              <Button
                component={Link}
                to="/order-tracking"
                sx={{
                  color: '#2C1F20',
                  fontWeight: 500,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  borderRadius: 16,
                  px: 2
                }}
              >
                TRA CỨU ĐƠN HÀNG
              </Button>
            </Box>

            <IconButton
              size="small"
              onClick={() => handleScrollNav('right')}
              sx={{ color: '#B76E79', display: { xs: 'none', md: 'flex' }, ml: 0.5 }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Container>
        </Box>
      </AppBar>

      {/* Category Submenu */}
      <Menu
        anchorEl={categoryMenuAnchor}
        open={Boolean(categoryMenuAnchor)}
        onClose={() => setCategoryMenuAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 240,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid rgba(197, 168, 128, 0.25)'
          }
        }}
      >
        {activeParentCat && (
          <>
            <MenuItem
              component={Link}
              to={`/products?category=${activeParentCat.Slug}`}
              onClick={() => setCategoryMenuAnchor(null)}
              sx={{ fontWeight: 700, color: '#8B3A48', borderBottom: '1px dashed rgba(197, 168, 128, 0.25)' }}
            >
              ✨ Xem tất cả {activeParentCat.TenDanhMuc}
            </MenuItem>
            {activeParentCat.children?.map((sub) => (
              <MenuItem
                key={sub.MaDanhMuc}
                component={Link}
                to={`/products?category=${sub.Slug}`}
                onClick={() => setCategoryMenuAnchor(null)}
                sx={{ fontSize: '0.88rem', py: 1 }}
              >
                {sub.TenDanhMuc}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      {/* Mobile Drawer (NO Wishlist) */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, p: 2.5 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <DiamondIcon sx={{ color: '#D4AF37', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#8B3A48' }}>
            LUNA BELLE
          </Typography>
        </Box>

        {/* Mobile Search Input */}
        <Box
          component="form"
          onSubmit={(e) => {
            handleSearchSubmit(e);
            setMobileDrawerOpen(false);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#FAF8F5',
            borderRadius: 2,
            border: '1px solid rgba(197, 168, 128, 0.3)',
            px: 1.5,
            py: 0.8,
            mb: 2.5
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
          <InputBase
            fullWidth
            placeholder="Tìm trang sức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ fontSize: '0.86rem' }}
          />
        </Box>

        <Divider sx={{ mb: 1.5 }} />
        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/" onClick={() => setMobileDrawerOpen(false)} sx={{ borderRadius: 2 }}>
              <ListItemText primary="Trang Chủ" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/products" onClick={() => setMobileDrawerOpen(false)} sx={{ borderRadius: 2 }}>
              <ListItemText primary="Tất Cả Sản Phẩm" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/ai-consultant" onClick={() => setMobileDrawerOpen(false)} sx={{ borderRadius: 2, bgcolor: 'rgba(212, 175, 55, 0.08)' }}>
              <ListItemIcon sx={{ minWidth: 36 }}><RobotIcon sx={{ color: '#D4AF37', fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary="Tư Vấn AI Stylist" primaryTypographyProps={{ fontWeight: 700, color: '#8B3A48' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/order-tracking" onClick={() => setMobileDrawerOpen(false)} sx={{ borderRadius: 2 }}>
              <ListItemText primary="Tra Cứu Đơn Hàng" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} to="/cart" onClick={() => setMobileDrawerOpen(false)} sx={{ borderRadius: 2 }}>
              <ListItemText primary={`Giỏ Hàng (${cartCount})`} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
