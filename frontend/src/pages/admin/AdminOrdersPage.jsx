import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  MenuItem,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ConfirmIcon,
  LocalShipping as ShipIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { formatCurrency } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_ORDERS = [
  {
    id: 'LB886291',
    customer: 'Lê Hoàng Yến Nhi',
    phone: '0987654321',
    address: '123 Đồng Khởi, Bến Nghé, Quận 1, TP. HCM',
    total: 28500000,
    date: '26/10/2026 14:35',
    paymentMethod: 'COD (Tiền mặt)',
    paymentStatus: 'ChuaThanhToan',
    status: 'DangGiao',
    items: [
      { name: 'Nhẫn Kim Cương Solitaire Eternal Grace', variant: 'Size 10 - Vàng Trắng 18K', qty: 1, price: 28500000 }
    ],
    notes: 'Yêu cầu khắc tên "Yên Nhi & Minh Tri" vào lòng trong của nhẫn'
  },
  {
    id: 'LB886290',
    customer: 'Trần Minh Trí',
    phone: '0978999888',
    address: '456 Lê Lợi, Bến Thành, Quận 1, TP. HCM',
    total: 45000000,
    date: '26/10/2026 11:20',
    paymentMethod: 'VietQR Chuyển khoản',
    paymentStatus: 'DaThanhToan',
    status: 'DaXacNhan',
    items: [
      { name: 'Vòng Tay Tennis Diamond Riviera Sparkle', variant: 'Cỡ 16cm - Bạch Kim Pt950', qty: 1, price: 45000000 }
    ],
    notes: 'Đóng hộp quà nơ lụa đỏ phong cách hoàng gia'
  },
  {
    id: 'LB886289',
    customer: 'Nguyễn Bích Phương',
    phone: '0912333444',
    address: '12 Thảo Điền, TP. Thủ Đức, TP. HCM',
    total: 16800000,
    date: '25/10/2026 16:10',
    paymentMethod: 'VNPAY Online',
    paymentStatus: 'DaThanhToan',
    status: 'DaGiao',
    items: [
      { name: 'Dây Chuyền Mặt Tim Royal Romance Moissanite', variant: 'Dây 42cm - Vàng Hồng 18K', qty: 1, price: 16800000 }
    ],
    notes: ''
  },
  {
    id: 'LB886288',
    customer: 'Phạm Đăng Khoa',
    phone: '0908111222',
    address: '88 Nguyễn Huệ, Quận 1, TP. HCM',
    total: 58000000,
    date: '25/10/2026 09:15',
    paymentMethod: 'COD (Tiền mặt)',
    paymentStatus: 'ChuaThanhToan',
    status: 'ChoXacNhan',
    items: [
      { name: 'Nhẫn Nam Hoàng Đế Emerald Signet Ring', variant: 'Size 18 - Vàng Vàng 18K', qty: 1, price: 58000000 }
    ],
    notes: 'Liên hệ trước khi giao hàng 1 tiếng'
  }
];

export const AdminOrdersPage = () => {
  const { notify } = useAuth();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusChip = (status) => {
    switch (status) {
      case 'ChoXacNhan':
        return <Chip label="Chờ Xác Nhận" color="warning" size="small" sx={{ fontWeight: 600 }} />;
      case 'DaXacNhan':
        return <Chip label="Đã Xác Nhận" color="info" size="small" sx={{ fontWeight: 600 }} />;
      case 'DangGiao':
        return <Chip label="Đang Giao Hàng" color="primary" size="small" sx={{ fontWeight: 600 }} />;
      case 'DaGiao':
        return <Chip label="Giao Thành Công" color="success" size="small" sx={{ fontWeight: 600 }} />;
      case 'DaHuy':
        return <Chip label="Đã Hủy" color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    notify(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"!`, 'success');
  };

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
          Quản Lý Đơn Hàng Kim Hoàn
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Cập nhật quy trình duyệt đơn, kiểm định trang sức và điều phối giao hàng hỏa tốc.
        </Typography>
      </Box>

      {/* Filter Tabs */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}>
        <Tabs
          value={statusFilter}
          onChange={(e, val) => setStatusFilter(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="ALL" label={`Tất Cả (${orders.length})`} sx={{ fontWeight: 600 }} />
          <Tab value="ChoXacNhan" label="Chờ Xác Nhận" sx={{ fontWeight: 600 }} />
          <Tab value="DaXacNhan" label="Đã Xác Nhận" sx={{ fontWeight: 600 }} />
          <Tab value="DangGiao" label="Đang Giao" sx={{ fontWeight: 600 }} />
          <Tab value="DaGiao" label="Giao Thành Công" sx={{ fontWeight: 600 }} />
          <Tab value="DaHuy" label="Đã Hủy" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Paper>

      {/* Orders Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Đơn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Khách Hàng</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tổng Tiền</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thanh Toán</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái Đơn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cập Nhật Nhanh</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((ord) => (
                <TableRow key={ord.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    #{ord.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{ord.customer}</TableCell>
                  <TableCell>{ord.phone}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    {formatCurrency(ord.total)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                      {ord.paymentMethod}
                    </Typography>
                    <Chip
                      label={ord.paymentStatus === 'DaThanhToan' ? 'Đã Thanh Toán' : 'Chưa Thu Tiền'}
                      size="small"
                      color={ord.paymentStatus === 'DaThanhToan' ? 'success' : 'default'}
                      sx={{ fontSize: '0.68rem', height: 20 }}
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(ord.status)}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      sx={{ minWidth: 145, '& .MuiSelect-select': { py: 0.6, fontSize: '0.8rem' } }}
                    >
                      <MenuItem value="ChoXacNhan">Chờ Xác Nhận</MenuItem>
                      <MenuItem value="DaXacNhan">Đã Xác Nhận</MenuItem>
                      <MenuItem value="DangGiao">Đang Giao</MenuItem>
                      <MenuItem value="DaGiao">Giao Thành Công</MenuItem>
                      <MenuItem value="DaHuy">Đã Hủy</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => setSelectedOrder(ord)}
                      sx={{ borderRadius: 12, fontSize: '0.78rem' }}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Chi Tiết Đơn Hàng #{selectedOrder.id}</span>
            {getStatusChip(selectedOrder.status)}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Thông Tin Người Nhận:
                </Typography>
                <Typography variant="body2"><strong>Họ tên:</strong> {selectedOrder.customer}</Typography>
                <Typography variant="body2"><strong>Số điện thoại:</strong> {selectedOrder.phone}</Typography>
                <Typography variant="body2"><strong>Địa chỉ:</strong> {selectedOrder.address}</Typography>
                {selectedOrder.notes && (
                  <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: '#FFF5F3', borderRadius: 1.5, color: 'primary.dark' }}>
                    <strong>Ghi chú:</strong> {selectedOrder.notes}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Hình Thức Thanh Toán & Vận Chuyển:
                </Typography>
                <Typography variant="body2"><strong>Thời gian đặt:</strong> {selectedOrder.date}</Typography>
                <Typography variant="body2"><strong>Phương thức:</strong> {selectedOrder.paymentMethod}</Typography>
                <Typography variant="body2"><strong>Trạng thái TT:</strong> {selectedOrder.paymentStatus === 'DaThanhToan' ? 'Đã Thanh Toán' : 'Chưa Thu Tiền'}</Typography>
                <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 700, mt: 1 }}>
                  Tổng tiền: {formatCurrency(selectedOrder.total)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.dark' }}>
                  Sản Phẩm Đặt Mua:
                </Typography>
                {selectedOrder.items.map((it, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: '#F9FAFB', borderRadius: 2, mb: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{it.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{it.variant} · SL: {it.qty}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {formatCurrency(it.price * it.qty)}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)', justifyContent: 'space-between' }}>
            <Button startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ color: 'text.secondary' }}>
              In Hóa Đơn Kim Hoàn
            </Button>
            <Box>
              <Button onClick={() => setSelectedOrder(null)} sx={{ mr: 1 }}>Đóng</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleUpdateStatus(selectedOrder.id, selectedOrder.status === 'ChoXacNhan' ? 'DaXacNhan' : 'DangGiao');
                  setSelectedOrder(null);
                }}
                sx={{ borderRadius: 20, px: 2.5 }}
              >
                Duyệt Tiến Độ Tiếp Theo
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
