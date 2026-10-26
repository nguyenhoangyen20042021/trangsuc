import React, { useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocalOffer as VoucherIcon
} from '@mui/icons-material';
import {
  MOCK_VOUCHERS,
  formatCurrency,
  getStoredVouchers,
  fetchVouchers,
  createVoucher,
  deleteVoucher
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminVouchersPage = () => {
  const { notify } = useAuth();
  const [vouchers, setVouchers] = useState(getStoredVouchers);

  useEffect(() => {
    fetchVouchers().then(data => {
      if (data && data.length) setVouchers(data);
    });
  }, []);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    MaCode: '',
    GiaTriGiam: 500000,
    GiaTriDonToiThieu: 5000000,
    MoTa: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      MaCode: '',
      GiaTriGiam: 500000,
      GiaTriDonToiThieu: 5000000,
      MoTa: ''
    });
    setOpenDialog(true);
  };

  const handleToggleActive = (code, current) => {
    setVouchers(prev => prev.map(v => (v.MaCode === code ? { ...v, active: !current } : v)));
    notify(`Đã ${current ? 'tạm ngưng' : 'kích hoạt lại'} mã giảm giá ${code}!`, 'info');
  };

  const handleDelete = async (code) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã giảm giá "${code}"?`)) {
      await deleteVoucher(code);
      setVouchers(prev => prev.filter(v => v.MaCode !== code && v.MaGiamGia !== code));
      notify(`Đã xóa mã voucher "${code}"!`, 'info');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.MaCode.trim()) {
      notify('Vui lòng nhập mã code giảm giá!', 'warning');
      return;
    }

    const newVoucher = await createVoucher({
      MaCode: formData.MaCode.trim().toUpperCase(),
      GiaTriGiam: Number(formData.GiaTriGiam),
      GiaTriDonToiThieu: Number(formData.GiaTriDonToiThieu),
      MoTa: formData.MoTa.trim() || `Giảm ${formatCurrency(formData.GiaTriGiam)} cho đơn từ ${formatCurrency(formData.GiaTriDonToiThieu)}`
    });

    setVouchers(prev => [newVoucher, ...prev]);
    notify(`Đã tạo mã giảm giá "${newVoucher.MaCode}" thành công!`, 'success');
    setOpenDialog(false);
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Quản Lý Mã Giảm Giá (Vouchers)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tạo và cấu hình các chiến dịch mã khuyến mãi áp dụng khi khách hàng đặt mua trang sức.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}
        >
          Tạo Mã Khuyến Mãi Mới
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mức Giảm Giá</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đơn Hàng Tối Thiểu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nội Dung Áp Dụng</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Kích Hoạt</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.MaCode} hover>
                  <TableCell>
                    <Chip
                      icon={<VoucherIcon sx={{ fontSize: 16 }} />}
                      label={v.MaCode}
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    -{formatCurrency(v.GiaTriGiam)}
                  </TableCell>
                  <TableCell>{formatCurrency(v.GiaTriDonToiThieu)}</TableCell>
                  <TableCell sx={{ maxWidth: 280, color: 'text.secondary' }}>{v.MoTa}</TableCell>
                  <TableCell>
                    <Switch
                      checked={v.active}
                      onChange={() => handleToggleActive(v.MaCode, v.active)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="error" onClick={() => handleDelete(v.MaCode)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Voucher Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          Tạo Mã Khuyến Mãi Mới
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Mã Code (viết liền, không dấu, VD: LUNA1000)"
                value={formData.MaCode}
                onChange={(e) => setFormData({ ...formData, MaCode: e.target.value.toUpperCase() })}
              />
              <TextField
                required
                fullWidth
                type="number"
                label="Số tiền giảm (VNĐ)"
                value={formData.GiaTriGiam}
                onChange={(e) => setFormData({ ...formData, GiaTriGiam: e.target.value })}
              />
              <TextField
                required
                fullWidth
                type="number"
                label="Giá trị đơn hàng tối thiểu áp dụng (VNĐ)"
                value={formData.GiaTriDonToiThieu}
                onChange={(e) => setFormData({ ...formData, GiaTriDonToiThieu: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả ưu đãi hiển thị cho khách"
                value={formData.MoTa}
                placeholder="VD: Giảm 500k cho đơn từ 5 triệu"
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}>
              Tạo Voucher
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
