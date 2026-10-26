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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, formatCurrency } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminProductsPage = () => {
  const { notify } = useAuth();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    TenSanPham: '',
    CatSlug: 'nhan-kim-cuong',
    GiaCoSo: 20000000,
    ChatLieu: 'Vàng 18K & Kim Cương',
    PhongCach: 'Sang trọng',
    DoiTuong: 'Nữ',
    TongTonKho: 10,
    HinhAnhChinh: '',
    MoTa: '',
    LaNoiBat: 1
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      TenSanPham: '',
      CatSlug: 'nhan-kim-cuong',
      GiaCoSo: 20000000,
      ChatLieu: 'Vàng 18K & Kim Cương',
      PhongCach: 'Sang trọng',
      DoiTuong: 'Nữ',
      TongTonKho: 10,
      HinhAnhChinh: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      MoTa: 'Tuyệt tác trang sức vàng 18K đính kim cương chuẩn kiểm định GIA.',
      LaNoiBat: 1
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      TenSanPham: prod.TenSanPham,
      CatSlug: prod.CatSlug || 'nhan-kim-cuong',
      GiaCoSo: prod.GiaMin || prod.GiaCoSo,
      ChatLieu: prod.ChatLieu || 'Kim Cương GIA',
      PhongCach: prod.PhongCach || 'Sang trọng',
      DoiTuong: prod.DoiTuong || 'Nữ',
      TongTonKho: prod.TongTonKho || 15,
      HinhAnhChinh: prod.HinhAnhChinh,
      MoTa: prod.MoTa,
      LaNoiBat: prod.LaNoiBat || 0
    });
    setOpenDialog(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi hệ thống?`)) {
      setProducts(prev => prev.filter(p => p.MaSanPham !== id));
      notify(`Đã xóa sản phẩm "${name}" thành công!`, 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.TenSanPham.trim()) {
      notify('Vui lòng nhập tên sản phẩm!', 'warning');
      return;
    }

    const catObj = MOCK_CATEGORIES.find(c => c.Slug === formData.CatSlug);
    const categoryName = catObj ? catObj.TenDanhMuc : 'Trang Sức Cao Cấp';

    if (editingProduct) {
      setProducts(prev => prev.map(p => {
        if (p.MaSanPham === editingProduct.MaSanPham) {
          return {
            ...p,
            ...formData,
            TenDanhMuc: categoryName,
            GiaMin: Number(formData.GiaCoSo),
            GiaCoSo: Number(formData.GiaCoSo)
          };
        }
        return p;
      }));
      notify(`Đã cập nhật sản phẩm "${formData.TenSanPham}" thành công!`, 'success');
    } else {
      const newProd = {
        MaSanPham: Date.now(),
        ...formData,
        Slug: formData.TenSanPham.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        TenDanhMuc: categoryName,
        GiaMin: Number(formData.GiaCoSo),
        TongBan: 0,
        gallery: [formData.HinhAnhChinh]
      };
      setProducts([newProd, ...products]);
      notify(`Đã thêm mới sản phẩm "${formData.TenSanPham}"!`, 'success');
    }
    setOpenDialog(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.TenSanPham.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.CatSlug === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Title & Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Quản Lý Sản Phẩm Trang Sức
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Danh sách và thao tác Thêm, Sửa, Xóa trang sức kim cương trong cơ sở dữ liệu.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}
        >
          Thêm Sản Phẩm Mới
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Tìm theo tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              )
            }
          }}
        />

        <TextField
          select
          size="small"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Tất cả danh mục</MenuItem>
          {MOCK_CATEGORIES.map(c => (
            <MenuItem key={c.Slug} value={c.Slug}>{c.TenDanhMuc}</MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Products Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Hình Ảnh</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Sản Phẩm</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Danh Mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chất Liệu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Giá Bán</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tồn Kho</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((prod) => (
                <TableRow key={prod.MaSanPham} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={prod.HinhAnhChinh}
                      alt={prod.TenSanPham}
                      sx={{ width: 50, height: 50, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {prod.TenSanPham}
                    </Typography>
                    {prod.LaNoiBat === 1 && (
                      <Chip label="Nổi bật" size="small" color="primary" sx={{ fontSize: '0.65rem', height: 18, mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell>{prod.TenDanhMuc}</TableCell>
                  <TableCell>{prod.ChatLieu || 'Kim Cương GIA'}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    {formatCurrency(prod.GiaMin || prod.GiaCoSo)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: (prod.TongTonKho || 10) < 5 ? 'error.main' : 'inherit' }}>
                      {prod.TongTonKho || 15}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label="Đang bán" color="success" size="small" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(prod)} title="Chỉnh sửa sản phẩm">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(prod.MaSanPham, prod.TenSanPham)} title="Xóa sản phẩm">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Product Modal Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Tuyệt Tác Trang Sức Mới'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  label="Tên sản phẩm trang sức"
                  value={formData.TenSanPham}
                  onChange={(e) => setFormData({ ...formData, TenSanPham: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Danh mục"
                  value={formData.CatSlug}
                  onChange={(e) => setFormData({ ...formData, CatSlug: e.target.value })}
                >
                  {MOCK_CATEGORIES.map(c => (
                    <MenuItem key={c.Slug} value={c.Slug}>{c.TenDanhMuc}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Giá cơ sở (VNĐ)"
                  value={formData.GiaCoSo}
                  onChange={(e) => setFormData({ ...formData, GiaCoSo: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Chất liệu & Đá chủ"
                  value={formData.ChatLieu}
                  onChange={(e) => setFormData({ ...formData, ChatLieu: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số lượng tồn kho"
                  value={formData.TongTonKho}
                  onChange={(e) => setFormData({ ...formData, TongTonKho: Number(e.target.value) })}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  label="Đường dẫn ảnh chính (URL)"
                  value={formData.HinhAnhChinh}
                  onChange={(e) => setFormData({ ...formData, HinhAnhChinh: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô tả giác cắt & ý nghĩa thiết kế"
                  value={formData.MoTa}
                  onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}>
              {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
