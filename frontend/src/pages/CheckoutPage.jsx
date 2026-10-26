import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import {
  Store as StoreIcon,
  CreditCard as CardIcon,
  QrCode2 as QrIcon,
  Payments as CodIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { OrderTrackingProductIcon, LuxuryGiaIcon } from '../components/icons/ProductIcons';
import { useNavigate } from 'react-router-dom';
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

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      notify('Vui lòng điền đầy đủ thông tin giao hàng bắt buộc!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const newOrder = await createOrder({
        userId: currentUser?.MaNguoiDung || 3,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        notes: formData.notes,
        subtotal,
        shippingFee,
        discountAmount,
        finalTotal,
        paymentMethod: formData.paymentMethod,
        items: cart.map(it => ({
          TenSanPham: it.TenSanPham,
          TenBienThe: it.TenBienThe,
          SoLuong: it.SoLuong,
          GiaBan: it.GiaBan
        }))
      });
      const orderId = newOrder.id;
      clearCart();
      setLoading(false);
      navigate(`/order-success/${orderId}`, {
        state: {
          orderId,
          formData,
          finalTotal,
          items: cart
        }
      });
    } catch (e) {
      console.error('Order creation error:', e);
      setLoading(false);
      notify('Đã có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại!', 'error');
    }
  };

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

                  <RadioGroup
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    {/* COD */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 3,
                        border: formData.paymentMethod === 'COD' ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        bgcolor: formData.paymentMethod === 'COD' ? 'rgba(183,110,121,0.04)' : '#FFFFFF'
                      }}
                    >
                      <FormControlLabel
                        value="COD"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CodIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Thanh Toán Khi Nhận Hàng (COD)
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Được mở hộp kiểm tra trang sức, kiểm tra mã số khắc laser GIA trước khi thanh toán.
                            </Typography>
                          </Box>
                        }
                      />
                      {formData.paymentMethod === 'COD' && (
                        <Box sx={{ mt: 1.5, ml: 4, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px dashed rgba(183,110,121,0.3)' }}>
                          <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 600, display: 'block' }}>
                            ✓ Quý khách vui lòng chuẩn bị số tiền <strong>{formatCurrency(finalTotal)}</strong> khi nhân viên giao hàng liên hệ.
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {/* VNPay */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 3,
                        border: formData.paymentMethod === 'VNPAY' ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        bgcolor: formData.paymentMethod === 'VNPAY' ? 'rgba(183,110,121,0.04)' : '#FFFFFF'
                      }}
                    >
                      <FormControlLabel
                        value="VNPAY"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CardIcon sx={{ color: '#0066CC', fontSize: 20 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Cổng VNPAY (Thẻ ATM nội địa / Visa / Mastercard / VNPAY-QR)
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Thanh toán an toàn, bảo mật tiêu chuẩn ngân hàng quốc tế PCI-DSS.
                            </Typography>
                          </Box>
                        }
                      />
                      {formData.paymentMethod === 'VNPAY' && (
                        <Box sx={{ mt: 1.5, ml: 4, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px dashed rgba(0,102,204,0.3)' }}>
                          <Typography variant="caption" sx={{ color: '#0066CC', fontWeight: 600, display: 'block', mb: 0.5 }}>
                            Hỗ trợ hơn 40 ngân hàng: Vietcombank, MB, Techcombank, BIDV, ACB, VietinBank và thẻ Visa/Mastercard.
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Hệ thống sẽ chuyển hướng bạn sang cổng thanh toán bảo mật VNPAY ngay sau khi bấm Xác Nhận Đặt Hàng.
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {/* Bank Transfer (VietQR) */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 3,
                        border: formData.paymentMethod === 'BANK' ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        bgcolor: formData.paymentMethod === 'BANK' ? 'rgba(183,110,121,0.04)' : '#FFFFFF'
                      }}
                    >
                      <FormControlLabel
                        value="BANK"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <QrIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Chuyển Khoản Ngân Hàng Qua Mã VietQR
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Quét mã VietQR trên ứng dụng ngân hàng bất kỳ để chuyển tiền nhanh 24/7.
                            </Typography>
                          </Box>
                        }
                      />
                      {formData.paymentMethod === 'BANK' && (
                        <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 }, p: 2, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 4px 16px rgba(212,175,55,0.08)' }}>
                          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 12, sm: 7 }}>
                              <Stack spacing={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  Ngân hàng: <strong>Quân Đội (MB Bank) - CN Sài Gòn</strong>
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                                    Số tài khoản: 8888 9999 6868
                                  </Typography>
                                  <Button size="small" variant="text" onClick={() => { navigator.clipboard.writeText('888899996868'); notify('Đã sao chép số tài khoản!', 'success'); }} sx={{ fontSize: '0.72rem', py: 0 }}>
                                    Sao chép
                                  </Button>
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  Chủ TK: <strong>CONG TY TNHH LUNA BELLE</strong>
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Nội dung CK: <strong>LB {formData.phone || 'DONHANG'}</strong>
                                  </Typography>
                                  <Button size="small" variant="text" onClick={() => { navigator.clipboard.writeText(`LB ${formData.phone || 'DONHANG'}`); notify('Đã sao chép nội dung chuyển khoản!', 'success'); }} sx={{ fontSize: '0.72rem', py: 0 }}>
                                    Sao chép
                                  </Button>
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark', pt: 0.5 }}>
                                  Số tiền: {formatCurrency(finalTotal)}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: 'center' }}>
                              <Box
                                component="img"
                                src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=247-MB-888899996868"
                                alt="VietQR Payment Code"
                                sx={{ width: 120, height: 120, mx: 'auto', borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)', p: 0.5 }}
                              />
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                Quét mã để thanh toán ngay
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Paper>

                    {/* E-Wallet (MoMo / ZaloPay) */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: formData.paymentMethod === 'MOMO' ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        bgcolor: formData.paymentMethod === 'MOMO' ? 'rgba(183,110,121,0.04)' : '#FFFFFF'
                      }}
                    >
                      <FormControlLabel
                        value="MOMO"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#a50064', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>M</Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Ví Điện Tử MoMo / ZaloPay
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Thanh toán 1-chạm qua ứng dụng Ví MoMo hoặc ZaloPay.
                            </Typography>
                          </Box>
                        }
                      />
                      {formData.paymentMethod === 'MOMO' && (
                        <Box sx={{ mt: 1.5, ml: 4, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px dashed #a50064' }}>
                          <Typography variant="caption" sx={{ color: '#a50064', fontWeight: 600 }}>
                            Quét mã QR MoMo của LUNA BELLE Merchant để xác nhận thanh toán hỏa tốc.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </RadioGroup>
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
