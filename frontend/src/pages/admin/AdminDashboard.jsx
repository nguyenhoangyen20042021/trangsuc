import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import {
  LuxuryBagIcon,
  AllJewelryProductIcon,
  LuxuryUserIcon,
  OrderTrackingProductIcon
} from '../../components/icons/ProductIcons';
import { Link } from 'react-router-dom';
import { formatCurrency, MOCK_PRODUCTS } from '../../services/api';

const STATS = [
  {
    title: 'Doanh Thu Tháng Này',
    value: '428.500.000 ₫',
    change: '+18.4% so với tháng trước',
    icon: <RevenueIcon sx={{ fontSize: 28, color: '#D4AF37' }} />,
    color: '#D4AF37',
    bg: 'rgba(212, 175, 55, 0.1)'
  },
  {
    title: 'Đơn Hàng Mới',
    value: '64 đơn',
    change: '+12 đơn trong tuần',
    icon: <OrderTrackingProductIcon sx={{ fontSize: 28, color: '#B76E79' }} />,
    color: '#B76E79',
    bg: 'rgba(183, 110, 121, 0.1)'
  },
  {
    title: 'Sản Phẩm Đang Bán',
    value: `${MOCK_PRODUCTS.length} sản phẩm`,
    change: '3 sản phẩm sắp hết hàng',
    icon: <AllJewelryProductIcon sx={{ fontSize: 28, color: '#3b82f6' }} />,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)'
  },
  {
    title: 'Khách Hàng Thành Viên',
    value: '1,280 VIP',
    change: '+35 thành viên mới',
    icon: <LuxuryUserIcon sx={{ fontSize: 28, color: '#10b981' }} />,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)'
  }
];

const RECENT_ORDERS = [
  { id: 'LB886291', customer: 'Lê Hoàng Yến Nhi', phone: '0987654321', total: 28500000, date: '26/10/2026', statusText: 'Đang Giao', color: 'primary', address: '123 Đồng Khởi, Q.1', items: 'Nhẫn Kim Cương Solitaire Eternal Grace (Size 10)' },
  { id: 'LB886290', customer: 'Trần Minh Trí', phone: '0978999888', total: 45000000, date: '26/10/2026', statusText: 'Đã Xác Nhận', color: 'info', address: '456 Lê Lợi, Q.1', items: 'Vòng Tay Tennis Diamond Riviera Sparkle' },
  { id: 'LB886289', customer: 'Nguyễn Bích Phương', phone: '0912333444', total: 16800000, date: '25/10/2026', statusText: 'Đã Giao', color: 'success', address: '12 Thảo Điền, TP. Thủ Đức', items: 'Dây Chuyền Mặt Tim Royal Romance Moissanite' },
  { id: 'LB886288', customer: 'Phạm Đăng Khoa', phone: '0908111222', total: 58000000, date: '25/10/2026', statusText: 'Chờ Duyệt', color: 'warning', address: '88 Nguyễn Huệ, Q.1', items: 'Nhẫn Nam Hoàng Đế Emerald Signet Ring' },
];

export const AdminDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Top Welcome Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Bảng Điều Khiển Quản Trị
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tổng quan hiệu suất kinh doanh trang sức và đơn hàng kim hoàn thời gian thực.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            to="/admin/products"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 20, px: 2.5, fontWeight: 700 }}
          >
            Quản Lý Sản Phẩm
          </Button>
          <Button
            component={Link}
            to="/admin/orders"
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 20, px: 2.5, fontWeight: 600 }}
          >
            Xử Lý Đơn Hàng
          </Button>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {STATS.map((stat, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  {stat.title}
                </Typography>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C1F20', mb: 1 }}>
                {stat.value}
              </Typography>

              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16 }} /> {stat.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders Table */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Đơn Hàng Kim Hoàn Gần Đây
          </Typography>
          <Button
            component={Link}
            to="/admin/orders"
            size="small"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 600 }}
          >
            Xem toàn bộ đơn hàng
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Đơn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Khách Hàng</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tổng Tiền</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thời Gian</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {RECENT_ORDERS.map((ord) => (
                <TableRow key={ord.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    #{ord.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{ord.customer}</TableCell>
                  <TableCell>{ord.phone}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(ord.total)}</TableCell>
                  <TableCell>{ord.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={ord.statusText}
                      color={ord.color}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => setSelectedOrder(ord)}
                      sx={{ borderRadius: 12, fontSize: '0.75rem' }}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            Đơn Hàng #{selectedOrder.id}
          </DialogTitle>
          <DialogContent sx={{ pt: 2.5 }}>
            <Stack spacing={1.5}>
              <Typography variant="body2"><strong>Khách hàng:</strong> {selectedOrder.customer} ({selectedOrder.phone})</Typography>
              <Typography variant="body2"><strong>Địa chỉ giao:</strong> {selectedOrder.address}</Typography>
              <Typography variant="body2"><strong>Sản phẩm:</strong> {selectedOrder.items}</Typography>
              <Typography variant="body2"><strong>Trạng thái:</strong> {selectedOrder.statusText}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700 }}>
                Tổng thanh toán: {formatCurrency(selectedOrder.total)}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSelectedOrder(null)}>Đóng</Button>
            <Button
              component={Link}
              to="/admin/orders"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 20 }}
            >
              Mở Trang Xử Lý Đơn
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
