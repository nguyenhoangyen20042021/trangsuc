import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  ReceiptLong as ReceiptIcon
} from '@mui/icons-material';
import { OrderTrackingProductIcon, AllJewelryProductIcon } from '../components/icons/ProductIcons';
import { useParams, useLocation, Link } from 'react-router-dom';
import { formatCurrency } from '../services/api';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const orderData = location.state || {
    orderId: id || 'LB886291',
    formData: {
      fullName: 'Lê Hoàng Yến Nhi',
      phone: '0987654321',
      address: '123 Đồng Khởi, Bến Nghé, Quận 1, TP. HCM',
      paymentMethod: 'COD'
    },
    finalTotal: 28500000,
    items: [
      {
        TenSanPham: 'Nhẫn Kim Cương Solitaire Eternal Grace',
        TenBienThe: 'Size 10 - Vàng Trắng 18K',
        SoLuong: 1,
        GiaBan: 28500000
      }
    ]
  };

  return (
    <Box sx={{ py: 8, pb: 14 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 4,
            border: '1px solid rgba(183, 110, 121, 0.2)',
            bgcolor: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(183, 110, 121, 0.08)'
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              bgcolor: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              color: '#16a34a'
            }}
          >
            <SuccessIcon sx={{ fontSize: 52 }} />
          </Box>

          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1, color: '#2C1F20' }}>
            Đặt Hàng Thành Công!
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Cảm ơn quý khách đã tin tưởng lựa chọn kiệt tác trang sức từ <strong>LUNA BELLE</strong>.
          </Typography>

          <Chip
            icon={<ReceiptIcon sx={{ color: 'primary.main !important' }} />}
            label={`Mã đơn hàng: #${orderData.orderId}`}
            sx={{
              bgcolor: 'rgba(183, 110, 121, 0.1)',
              color: 'primary.dark',
              fontWeight: 700,
              fontSize: '0.95rem',
              py: 2.2,
              px: 1,
              mb: 4
            }}
          />

          {/* Details Box */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: '#FFFDFD',
              borderRadius: 3,
              border: '1px solid rgba(183, 110, 121, 0.15)',
              textAlign: 'left'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
              Thông Tin Nhận Hàng:
            </Typography>

            <Grid container spacing={2} sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Người nhận:</strong> {orderData.formData.fullName} ({orderData.formData.phone})
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Phương thức thanh toán:</strong> {orderData.formData.paymentMethod}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <strong>Địa chỉ giao:</strong> {orderData.formData.address}
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.dark' }}>
              Sản Phẩm Đã Mua:
            </Typography>

            {orderData.items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {item.TenSanPham} {item.TenBienThe ? `(${item.TenBienThe})` : ''} x{item.SoLuong}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(item.GiaBan * item.SoLuong)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tổng tiền:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark', fontFamily: "'Playfair Display', serif" }}>
                {formatCurrency(orderData.finalTotal)}
              </Typography>
            </Box>
          </Paper>

          {/* Action CTAs */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              component={Link}
              to={`/order-tracking?code=${orderData.orderId}`}
              variant="contained"
              color="primary"
              size="large"
              startIcon={<OrderTrackingProductIcon sx={{ fontSize: 19 }} />}
              sx={{ borderRadius: 30, px: 3.5, fontWeight: 700 }}
            >
              Theo Dõi Lộ Trình Đơn Hàng
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              startIcon={<AllJewelryProductIcon sx={{ fontSize: 18 }} />}
              sx={{ borderRadius: 30, px: 3.5, fontWeight: 600 }}
            >
              Tiếp Tục Mua Sắm
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
