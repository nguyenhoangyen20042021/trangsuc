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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { getCategoryProductIcon } from '../../components/icons/ProductIcons';
import {
  MOCK_CATEGORIES,
  getStoredCategories,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminCategoriesPage = () => {
  const { notify } = useAuth();
  const [categories, setCategories] = useState(getStoredCategories);

  useEffect(() => {
    fetchCategories().then(data => {
      if (data && data.length) setCategories(data);
    });
  }, []);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    TenDanhMuc: '',
    Slug: '',
    MoTa: '',
    AnhDaiDien: ''
  });

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      TenDanhMuc: '',
      Slug: '',
      MoTa: '',
      AnhDaiDien: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      TenDanhMuc: cat.TenDanhMuc,
      Slug: cat.Slug,
      MoTa: cat.MoTa || '',
      AnhDaiDien: cat.AnhDaiDien || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.MaDanhMuc !== id));
      notify(`Đã xóa danh mục "${name}"!`, 'info');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.TenDanhMuc.trim()) {
      notify('Vui lòng nhập tên danh mục!', 'warning');
      return;
    }

    const slug = formData.Slug.trim() || formData.TenDanhMuc.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCat) {
      const updatedCat = await updateCategory(editingCat.MaDanhMuc, { ...formData, Slug: slug });
      setCategories(prev => prev.map(c => (c.MaDanhMuc === editingCat.MaDanhMuc ? updatedCat : c)));
      notify(`Đã cập nhật danh mục "${formData.TenDanhMuc}"!`, 'success');
    } else {
      const newCat = await createCategory({
        ...formData,
        Slug: slug
      });
      setCategories(prev => [...prev, newCat]);
      notify(`Đã thêm danh mục mới "${formData.TenDanhMuc}"!`, 'success');
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Quản Lý Danh Mục Trang Sức
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Cấu hình danh mục cha - con hiển thị trên thanh điều hướng website LUNA BELLE.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}
        >
          Thêm Danh Mục
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Ảnh Đại Diện</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Danh Mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đường Dẫn Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Danh Mục Con</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mô Tả</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.MaDanhMuc} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={cat.AnhDaiDien}
                      alt={cat.TenDanhMuc}
                      sx={{ width: 50, height: 50, borderRadius: 2, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryProductIcon(cat.Slug, { sx: { fontSize: 20, color: 'primary.main' } })}
                      <span>{cat.TenDanhMuc}</span>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    /{cat.Slug}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${cat.children?.length || 0} danh mục con`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, color: 'text.secondary', fontSize: '0.85rem' }}>
                    {cat.MoTa}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(cat)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(cat.MaDanhMuc, cat.TenDanhMuc)}>
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

      {/* Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          {editingCat ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên danh mục"
                value={formData.TenDanhMuc}
                onChange={(e) => setFormData({ ...formData, TenDanhMuc: e.target.value })}
              />
              <TextField
                fullWidth
                label="Đường dẫn tĩnh (Slug)"
                value={formData.Slug}
                placeholder="Tự động tạo theo tên nếu để trống"
                onChange={(e) => setFormData({ ...formData, Slug: e.target.value })}
              />
              <Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadIcon />}
                    component="label"
                    sx={{ borderRadius: 2 }}
                  >
                    Tải ảnh từ máy tính
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setFormData(prev => ({ ...prev, AnhDaiDien: ev.target.result }));
                            notify('Đã tải ảnh danh mục từ máy tính thành công!', 'success');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Button>
                  {formData.AnhDaiDien && (
                    <Box
                      component="img"
                      src={formData.AnhDaiDien}
                      alt="Preview"
                      sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  )}
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Hoặc dán URL ảnh đại diện danh mục"
                  value={formData.AnhDaiDien}
                  onChange={(e) => setFormData({ ...formData, AnhDaiDien: e.target.value })}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả danh mục"
                value={formData.MoTa}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}>
              {editingCat ? 'Lưu' : 'Tạo Danh Mục'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
