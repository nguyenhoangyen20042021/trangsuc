import React, { useState } from 'react';
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
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as SuccessIcon,
  SupportAgent as SupportIcon,
  Inventory as InventoryIcon,
  FactCheck as VerifyIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../services/api';

const TRACKING_STEPS = [
  'Đã Tiếp Nhận Đơn',
  'Kiểm Định & Đóng Hộp Nhung',
  'Đang Giao Hỏa Tốc',
  'Giao Hàng Thành Công'
];

export const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || 'LB886291';
  const [orderCode, setOrderCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderCode.trim()) {
      setSearchedCode(orderCode.trim());
    }
  };

  // Mock tracking details
  const activeStep = 2; // Step 2: Đang giao hỏa tốc

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
            startIcon={<SearchIcon />}
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
                Đơn Hàng #{searchedCode}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Thời gian đặt: 14:35 - 26/10/2026 · Thanh toán: COD
              </Typography>
            </Box>
            <Chip
              label="Đang Vận Chuyển Hỏa Tốc"
              color="primary"
              sx={{ fontWeight: 700, fontSize: '0.85rem', px: 1 }}
            />
          </Box>

          {/* Stepper Progress */}
          <Box sx={{ my: 5 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {TRACKING_STEPS.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': { color: 'primary.main' },
                        '&.Mui-completed': { color: '#16a34a' }
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

          <Divider sx={{ my: 4 }} />

          {/* Order Details & Timeline Columns */}
          <Grid container spacing={4}>
            {/* Timeline Log */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.dark' }}>
                Nhật Ký Hành Trình Đơn Hàng:
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <ShippingIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Bưu tá chuyên trách kim hoàn đang trên đường giao hàng
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      26/10/2026 - 16:20 | Khu vực Bến Nghé, Quận 1, TP. HCM (Dự kiến giao trong 45 phút)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <VerifyIcon sx={{ color: '#D4AF37', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Hoàn tất kiểm định viền đá GIA & niêm phong hộp nhung
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      26/10/2026 - 15:10 | Trung Tâm Chế Tác Kim Hoàn LUNA BELLE Flagship
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <InventoryIcon sx={{ color: 'text.disabled', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Đơn hàng được khởi tạo thành công trên hệ thống
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      26/10/2026 - 14:35 | Khách hàng đặt trực tuyến
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
                  Địa Chỉ Giao Hàng:
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Lê Hoàng Yến Nhi</strong> - 0987654321
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
                  123 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh
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
