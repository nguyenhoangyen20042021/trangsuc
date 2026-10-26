import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  LocalOffer as VoucherIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { LuxuryBagIcon, AllJewelryProductIcon } from '../components/icons/ProductIcons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../services/api';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    appliedVoucher,
    updateQuantity,
    removeFromCart,
    applyVoucherCode,
    removeVoucher
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (voucherInput.trim()) {
      applyVoucherCode(voucherInput.trim());
      setVoucherInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              border: '1px dashed rgba(183, 110, 121, 0.3)',
              bgcolor: '#FFFFFF'
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(183, 110, 121, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                color: 'primary.main'
              }}
            >
              <LuxuryBagIcon sx={{ fontSize: 42 }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1.5 }}>
              Giỏ Hàng Của Bạn Đang Trống
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Hãy khám phá các mẫu trang sức kim cương và vàng 18K tinh xảo để chọn cho mình tuyệt tác yêu thích nhé.
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AllJewelryProductIcon sx={{ fontSize: 18 }} />}
              sx={{ borderRadius: 30, px: 4 }}
            >
              Khám Phá Sản Phẩm Ngay
            </Button>
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
          Giỏ Hàng Cao Cấp
        </Typography>

        <Grid container spacing={4}>
          {/* Cart Items Column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Desktop Table View */}
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                display: { xs: 'none', md: 'block' },
                borderRadius: 3,
                border: '1px solid rgba(183, 110, 121, 0.2)',
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: '#FFF5F3' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Sản Phẩm</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Đơn Giá</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Số Lượng</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Thành Tiền</TableCell>
                    <TableCell align="center" sx={{ width: 60 }}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.cartId} sx={{ '&:hover': { bgcolor: 'rgba(255,251,249,0.7)' } }}>
                      {/* Product Info */}
                      <TableCell>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={item.HinhAnh}
                            alt={item.TenSanPham}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              objectFit: 'cover',
                              border: '1px solid rgba(183, 110, 121, 0.15)'
                            }}
                          />
                          <Box>
                            <Typography
                              component={Link}
                              to={`/product/${item.MaSanPham}`}
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                textDecoration: 'none',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {item.TenSanPham}
                            </Typography>
                            {item.TenBienThe && (
                              <Chip
                                label={item.TenBienThe}
                                size="small"
                                sx={{ mt: 0.8, fontSize: '0.72rem', bgcolor: 'rgba(183, 110, 121, 0.08)' }}
                              />
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Unit Price */}
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(item.GiaBan)}
                        </Typography>
                      </TableCell>

                      {/* Quantity */}
                      <TableCell align="center">
                        <Stack direction="row" sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.cartId, item.SoLuong - 1)}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography sx={{ px: 1.5, fontSize: '0.9rem', fontWeight: 600 }}>
                            {item.SoLuong}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.cartId, item.SoLuong + 1)}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>

                      {/* Line Total */}
                      <TableCell align="right">
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                          {formatCurrency(item.GiaBan * item.SoLuong)}
                        </Typography>
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.cartId)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile Card View (xs to sm) */}
            <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
              {cart.map((item) => (
                <Paper
                  key={item.cartId}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(183, 110, 121, 0.2)',
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                    <Box
                      component="img"
                      src={item.HinhAnh}
                      alt={item.TenSanPham}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        objectFit: 'cover',
                        border: '1px solid rgba(183, 110, 121, 0.15)',
                        flexShrink: 0
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        component={Link}
                        to={`/product/${item.MaSanPham}`}
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          textDecoration: 'none',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.TenSanPham}
                      </Typography>
                      {item.TenBienThe && (
                        <Chip
                          label={item.TenBienThe}
                          size="small"
                          sx={{ mt: 0.5, fontSize: '0.68rem', height: 22, bgcolor: 'rgba(183, 110, 121, 0.08)' }}
                        />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark', mt: 0.5 }}>
                        {formatCurrency(item.GiaBan)}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.cartId)}
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" sx={{ alignItems: 'center', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.cartId, item.SoLuong - 1)}>
                        <RemoveIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                      <Typography sx={{ px: 1.2, fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.SoLuong}
                      </Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.cartId, item.SoLuong + 1)}>
                        <AddIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Stack>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Thành tiền
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {formatCurrency(item.GiaBan * item.SoLuong)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>

            {/* Back to Shop Link */}
            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                to="/products"
                startIcon={<ArrowBackIcon />}
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                Tiếp tục xem trang sức khác
              </Button>
            </Box>
          </Grid>

          {/* Cart Summary Col */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 4,
                border: '1px solid rgba(183, 110, 121, 0.2)',
                bgcolor: '#FFFFFF',
                boxShadow: '0 8px 30px rgba(183, 110, 121, 0.08)'
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                Tổng Đơn Hàng
              </Typography>

              {/* Voucher Box */}
              <Box component="form" onSubmit={handleApplyVoucher} sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>
                  MÃ GIẢM GIÁ (VOUCHER)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Ví dụ: LUNA500, VIPROYAL"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 2, whiteSpace: 'nowrap', px: 2.5 }}
                  >
                    Áp Dụng
                  </Button>
                </Stack>

                {appliedVoucher && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      bgcolor: '#FFF5F3',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px dashed rgba(183, 110, 121, 0.4)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VoucherIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                          {appliedVoucher.MaCode}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                          Giảm -{formatCurrency(appliedVoucher.GiaTriGiam)}
                        </Typography>
                      </Box>
                    </Box>
                    <Button size="small" color="error" onClick={removeVoucher} sx={{ minWidth: 'auto', p: 0.5, fontSize: '0.75rem' }}>
                      Bỏ chọn
                    </Button>
                  </Paper>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tạm tính</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</Typography>
                </Box>

                {appliedVoucher && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                    <Typography variant="body2">Giảm giá ({appliedVoucher.MaCode})</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>-{formatCurrency(discountAmount)}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Vận chuyển (Có bảo hiểm)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: shippingFee === 0 ? 'success.main' : 'inherit' }}>
                    {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Final Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tổng thanh toán</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark', fontFamily: "'Playfair Display', serif" }}>
                  {formatCurrency(finalTotal)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/checkout')}
                sx={{
                  py: 1.5,
                  borderRadius: 30,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(183, 110, 121, 0.3)'
                }}
              >
                Tiến Hành Đặt Hàng
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
