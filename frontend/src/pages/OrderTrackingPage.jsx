import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  SupportAgent as SupportIcon,
  CancelOutlined as CancelIcon
} from '@mui/icons-material';
import {
  LuxurySearchIcon,
  OrderTrackingProductIcon,
  LuxuryGiaIcon,
  LuxuryBagIcon
} from '../components/icons/ProductIcons';
import { useSearchParams } from 'react-router-dom';
import { formatCurrency, getStoredOrders, fetchOrders } from '../services/api';

const TRACKING_STEPS = [
  'Đã Tiếp Nhận Đơn',
  'Kiểm Định & Đóng Hộp Nhung',
  'Đang Giao Hỏa Tốc',
  'Giao Hàng Thành Công'
];

const getStepFromStatus = (status) => {
  switch (status) {
    case 'ChoXacNhan':
      return 0;
    case 'DaXacNhan':
      return 1;
    case 'DangGiao':
      return 2;
    case 'HoanThanh':
      return 3;
    case 'DaHuy':
      return -1;
    default:
      return 1;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'ChoXacNhan':
      return { label: 'Chờ Tiếp Nhận & Xác Nhận', color: 'warning' };
    case 'DaXacNhan':
      return { label: 'Đang Kiểm Định & Đóng Gói', color: 'info' };
    case 'DangGiao':
      return { label: 'Đang Vận Chuyển Hỏa Tốc', color: 'primary' };
    case 'HoanThanh':
      return { label: 'Giao Hàng Thành Công', color: 'success' };
    case 'DaHuy':
      return { label: 'Đơn Hàng Đã Hủy', color: 'error' };
    default:
      return { label: 'Đang Xử Lý', color: 'primary' };
  }
};

export const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || 'LB886291';
  const [orderCode, setOrderCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);
  const [orders, setOrders] = useState(() => getStoredOrders());

  useEffect(() => {
    fetchOrders().then((data) => {
      if (data && data.length > 0) setOrders(data);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderCode.trim()) {
      setSearchedCode(orderCode.trim());
    }
  };

  const matchedOrder = orders.find(
    (o) =>
      String(o.id).toLowerCase() === searchedCode.trim().toLowerCase() ||
      String(o.phone || '').includes(searchedCode.trim())
  ) || orders[0] || {
    id: searchedCode,
    customer: 'Khách Hàng',
    phone: '---',
    address: 'Địa chỉ nhận hàng',
    date: new Date().toLocaleDateString('vi-VN'),
    paymentMethod: 'COD',
    status: 'ChoXacNhan',
    total: 0,
    items: []
  };

  const activeStep = getStepFromStatus(matchedOrder.status);
  const statusMeta = getStatusLabel(matchedOrder.status);

  return (
    <Box sx={{ py: 6, pb: 14 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20', mb: 1.5 }}
          >
            Tra Cứu Lộ Trình Đơn Hàng
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Nhập mã đơn hàng hoặc số điện thoại để cập nhật trạng thái gia công, kiểm định GIA và hành trình vận chuyển có bảo hiểm.
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          elevation={0}
          sx={{
            p: 2,
            mb: 6,
            borderRadius: 4,
            maxWidth: 600,
            mx: 'auto',
            border: '1px solid rgba(183, 110, 121, 0.25)',
            display: 'flex',
            gap: 1.5,
            bgcolor: '#FFFFFF',
            boxShadow: '0 6px 24px rgba(183, 110, 121, 0.08)'
          }}
        >
          <TextField
            fullWidth
            placeholder="Nhập mã đơn hàng (Ví dụ: LB886291)..."
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            variant="standard"
            slotProps={{ input: { disableUnderline: true, sx: { px: 2, fontSize: '1rem' } } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<LuxurySearchIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: 3, px: 3.5, whiteSpace: 'nowrap', fontWeight: 700 }}
          >
            Tra Cứu
          </Button>
        </Paper>

        {/* Tracking Result Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: '1px solid rgba(183, 110, 121, 0.18)',
            bgcolor: '#FFFFFF',
            boxShadow: '0 8px 30px rgba(183, 110, 121, 0.06)'
          }}
        >
          {/* Order Header Meta */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Đơn Hàng #{matchedOrder.id}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Thời gian đặt: {matchedOrder.date} · Thanh toán: {matchedOrder.paymentMethod || 'COD'} · Tổng: {formatCurrency(matchedOrder.total)}
              </Typography>
            </Box>
            <Chip
              label={statusMeta.label}
              color={statusMeta.color}
              sx={{ fontWeight: 700, fontSize: '0.85rem', px: 1 }}
            />
          </Box>

          {/* Stepper Progress */}
          {activeStep >= 0 ? (
            <Box sx={{ my: 5 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {TRACKING_STEPS.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      slotProps={{
                        stepIcon: {
                          sx: {
                            '&.Mui-active': { color: 'primary.main' },
                            '&.Mui-completed': { color: '#16a34a' }
                          }
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: index <= activeStep ? 700 : 500 }}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          ) : (
            <Box sx={{ my: 4, p: 3, bgcolor: '#FEF2F2', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CancelIcon sx={{ color: '#DC2626', fontSize: 32 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#DC2626' }}>
                  Đơn Hàng Đã Bị Hủy
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Vui lòng liên hệ bộ phận hỗ trợ khách hàng LUNA BELLE nếu bạn cần hỗ trợ đặt lại.
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Order Details & Timeline Columns */}
          <Grid container spacing={4}>
            {/* Timeline Log */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
                Sản Phẩm Trong Đơn Hàng:
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {(matchedOrder.items || []).map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#FAFAFA', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LuxuryBagIcon sx={{ color: '#B76E79', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name || item.TenSanPham}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.variant || item.TenBienThe || 'Tiêu chuẩn'} · SL: {item.qty || item.quantity || 1}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#B76E79' }}>
                      {formatCurrency(item.price || item.GiaBan || 0)}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
                Nhật Ký Hành Trình:
              </Typography>

              <Stack spacing={2}>
                {activeStep >= 2 && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <OrderTrackingProductIcon sx={{ color: 'primary.main', mt: 0.5, fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Bưu tá chuyên trách kim hoàn đang trên đường giao hàng
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Dự kiến giao bảo đảm trong ngày đến địa chỉ quý khách
                      </Typography>
                    </Box>
                  </Box>
                )}

                {activeStep >= 1 && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LuxuryGiaIcon sx={{ color: '#D4AF37', mt: 0.5, fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Hoàn tất kiểm định viền đá GIA & niêm phong hộp nhung cao cấp
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Trung Tâm Chế Tác Kim Hoàn LUNA BELLE Flagship
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LuxuryBagIcon sx={{ color: 'text.disabled', mt: 0.5, fontSize: 22 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Đơn hàng được khởi tạo thành công trên hệ thống
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Thời gian: {matchedOrder.date}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Recipient & Contact Help */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#FFF5F3',
                  border: '1px solid rgba(183, 110, 121, 0.2)'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.dark' }}>
                  Thông Tin Người Nhận:
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{matchedOrder.customer}</strong> {matchedOrder.phone ? `- ${matchedOrder.phone}` : ''}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
                  {matchedOrder.address || 'Giao tại cửa hàng Flagship'}
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<SupportIcon />}
                  sx={{ borderRadius: 20, fontWeight: 700, bgcolor: '#FFFFFF' }}
                  onClick={() => window.open('tel:19008888')}
                >
                  Hotline Hỗ Trợ 1900 8888
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};


