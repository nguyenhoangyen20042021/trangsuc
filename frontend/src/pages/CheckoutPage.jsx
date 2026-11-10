import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Stack,
  Alert,
  Chip
} from '@mui/material';
import {
  Store as StoreIcon,
  Payments as CodIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { OrderTrackingProductIcon, LuxuryGiaIcon, LuxuryBagIcon } from '../components/icons/ProductIcons';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, createOrder } from '../services/api';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal, discountAmount, shippingFee, finalTotal, clearCart } = useCart();
  const { currentUser, notify } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.HoTen || '',
    phone: currentUser?.SoDienThoai || '',
    email: currentUser?.Email || '',
    address: currentUser?.DiaChi || '',
    city: 'Hồ Chí Minh',
    notes: '',
    deliveryMethod: 'express', // express | store
    paymentMethod: 'COD' // COD | VNPAY | BANK
  });

  // Sync customer information when authentication state changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || currentUser.HoTen || '',
        phone: prev.phone || currentUser.SoDienThoai || '',
        email: prev.email || currentUser.Email || '',
        address: prev.address || currentUser.DiaChi || ''
      }));
    }
  }, [currentUser]);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!Array.isArray(cart) || cart.length === 0) {
      notify('Giỏ hàng trống, vui lòng chọn sản phẩm!', 'warning');
      return;
    }
    if (!formData.fullName || !formData.phone || !formData.address) {
      notify('Vui lòng điền đầy đủ thông tin giao hàng bắt buộc!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const safeItems = cart.map(it => ({
        TenSanPham: it?.TenSanPham || 'Trang sức kim hoàn',
        TenBienThe: it?.TenBienThe || '',
        SoLuong: Number(it?.SoLuong) || 1,
        GiaBan: Number(it?.GiaBan) || 0
      }));

      const newOrder = await createOrder({
        userId: currentUser?.MaNguoiDung || 3,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        notes: formData.notes,
        subtotal: Number(subtotal) || 0,
        shippingFee: Number(shippingFee) || 0,
        discountAmount: Number(discountAmount) || 0,
        finalTotal: Number(finalTotal) || 0,
        paymentMethod: formData.paymentMethod,
        items: safeItems
      });

      const orderId = newOrder?.id || `LB${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setLoading(false);
      navigate(`/order-success/${orderId}`, {
        state: {
          orderId,
          formData,
          finalTotal: Number(finalTotal) || 0,
          items: safeItems
        }
      });
    } catch (err) {
      console.error('Order creation error:', err);
      setLoading(false);
      notify('Đã có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại!', 'error');
    }
  };

  // If cart is empty, show a luxury friendly empty cart notice instead of a blank/crashing screen
  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <Box sx={{ py: 10, pb: 16, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              border: '1px dashed rgba(183, 110, 121, 0.35)',
              bgcolor: '#FFFFFF',
              boxShadow: '0 10px 40px rgba(183, 110, 121, 0.08)'
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(183, 110, 121, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                color: 'primary.main'
              }}
            >
              <LuxuryBagIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1.5, color: '#2C1F20' }}>
              Giỏ Hàng Đang Trống
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
              Quý khách hiện chưa có sản phẩm nào trong giỏ hàng để tiến hành thanh toán. Vui lòng khám phá các kiệt tác kim cương & trang sức cao cấp để chọn món trang sức yêu thích nhé.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 30, px: 3.5, py: 1.2, fontWeight: 700 }}
              >
                Khám Phá Trang Sức
              </Button>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ArrowBackIcon />}
                sx={{ borderRadius: 30, px: 3, py: 1.2, fontWeight: 600 }}
              >
                Về Trang Chủ
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5, pb: 12 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 4, color: '#2C1F20' }}
        >
          Thanh Toán Đơn Hàng Kim Hoàn
        </Typography>

        <form onSubmit={handlePlaceOrder}>
          <Grid container spacing={4}>
            {/* Left Col: Customer Info & Shipping & Payment */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={4}>
                
                {/* 1. Shipping Address */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid rgba(183, 110, 121, 0.15)',
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                    1. Địa Chỉ Nhận Hàng
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        label="Họ và tên người nhận"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Email nhận hóa đơn & chứng thư"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã, Quận/Huyện)"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Ghi chú đơn hàng (Ví dụ: Khắc tên lên nhẫn, gói hộp quà nơ lụa...)"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* 2. Delivery Method */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid rgba(183, 110, 121, 0.15)',
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 2 }}>
                    2. Phương Thức Vận Chuyển
                  </Typography>

                  <RadioGroup
                    name="deliveryMethod"
                    value={formData.deliveryMethod}
                    onChange={handleInputChange}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 3,
                        border: formData.deliveryMethod === 'express' ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        bgcolor: formData.deliveryMethod === 'express' ? 'rgba(183,110,121,0.04)' : '#FFFFFF'
                      }}
                    >
                      <FormControlLabel
                        value="express"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <OrderTrackingProductIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Giao Hàng Hỏa Tốc Kim Hoàn (Bảo hiểm 100%)
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Nhân viên chuyên nghiệp giao tận tay, kiểm tra chứng thư trước khi nhận. Miễn phí từ 2.000.000₫.
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: formData.deliveryMethod === 'store' ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        bgcolor: formData.deliveryMethod === 'store' ? 'rgba(183,110,121,0.04)' : '#FFFFFF'
                      }}
                    >
                      <FormControlLabel
                        value="store"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StoreIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Nhận Trực Tiếp Tại Showroom Flagship
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              88 Đồng Khởi, Quận 1, TP. HCM (Trải nghiệm phòng thử VIP và phục vụ sâm-panh).
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </RadioGroup>
                </Paper>

                {/* 3. Payment Method */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: '1px solid rgba(183, 110, 121, 0.15)',
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 2 }}>
                    3. Phương Thức Thanh Toán
                  </Typography>

                  {/* COD Only */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: '2px solid #B76E79',
                      bgcolor: 'rgba(183,110,121,0.04)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'rgba(183, 110, 121, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                          flexShrink: 0
                        }}
                      >
                        <CodIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2C1F20' }}>
                            Thanh Toán Khi Nhận Hàng (COD)
                          </Typography>
                          <Chip
                            size="small"
                            label="Phương thức duy nhất"
                            color="primary"
                            sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          Quý khách nhận hàng, mở hộp kiểm tra trang sức và chứng thư kiểm định GIA trước khi thanh toán tiền mặt cho nhân viên giao hàng.
                        </Typography>
                        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px dashed rgba(183,110,121,0.3)' }}>
                          <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 600, display: 'block' }}>
                            ✓ Quý khách vui lòng chuẩn bị số tiền <strong>{formatCurrency(finalTotal)}</strong> khi nhân viên giao hàng liên hệ.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Paper>
              </Stack>
            </Grid>

            {/* Right Col: Order Summary */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: 4,
                  border: '1px solid rgba(183, 110, 121, 0.2)',
                  bgcolor: '#FFFFFF',
                  position: 'sticky',
                  top: 100
                }}
              >
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                  Tóm Tắt Đơn Hàng
                </Typography>

                {/* Items Mini List */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {cart.map((item) => (
                    <Box key={item.cartId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          component="img"
                          src={item.HinhAnh}
                          alt={item.TenSanPham}
                          sx={{ width: 50, height: 50, borderRadius: 1.5, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.TenSanPham}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            x{item.SoLuong} {item.TenBienThe ? `(${item.TenBienThe})` : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {formatCurrency(item.GiaBan * item.SoLuong)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Totals */}
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tạm tính</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</Typography>
                  </Box>

                  {discountAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                      <Typography variant="body2">Ưu đãi giảm giá</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>-{formatCurrency(discountAmount)}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Phí vận chuyển bảo hiểm</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: shippingFee === 0 ? 'success.main' : 'inherit' }}>
                      {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tổng thanh toán</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark', fontFamily: "'Playfair Display', serif" }}>
                    {formatCurrency(finalTotal)}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={<LockIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 30,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 24px rgba(183, 110, 121, 0.3)'
                  }}
                >
                  {loading ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Hàng'}
                </Button>

                <Alert severity="info" icon={<LuxuryGiaIcon sx={{ color: 'primary.main', fontSize: 20 }} />} sx={{ mt: 3, borderRadius: 2, fontSize: '0.78rem' }}>
                  Thông tin thanh toán của bạn được mã hóa an toàn 256-bit SSL.
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};
