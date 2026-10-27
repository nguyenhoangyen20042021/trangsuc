import React, { useState, useRef, useEffect } from 'react';
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
  InputAdornment,
  Divider,
  Tooltip,
  Card,
  CardMedia
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  AddPhotoAlternate as GalleryIcon,
  Tune as VariantIcon,
  Delete as RemoveVariantIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  AllJewelryProductIcon,
  LuxurySearchIcon,
  getCategoryProductIcon
} from '../../components/icons/ProductIcons';
import {
  formatCurrency,
  getStoredProducts,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getStoredCategories,
  fetchCategories,
  uploadProductImage
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminProductsPage = () => {
  const { notify } = useAuth();
  const [products, setProducts] = useState(getStoredProducts);
  const [categories, setCategories] = useState(getStoredCategories);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    fetchProducts().then(data => {
      if (Array.isArray(data)) setProducts(data);
    });
    fetchCategories().then(data => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, []);

  // File input refs for direct computer upload
  const primaryFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    TenSanPham: '',
    MaDanhMuc: '',
    GiaCoSo: 20000000,
    ChatLieu: 'Vàng 18K & Kim Cương',
    PhongCach: 'Sang trọng',
    DoiTuong: 'Nữ',
    TongTonKho: 15,
    HinhAnhChinh: '',
    gallery: [],
    MoTa: '',
    LaNoiBat: 1,
    bienthe: []
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      TenSanPham: '',
      MaDanhMuc: '',
      GiaCoSo: 20000000,
      ChatLieu: 'Vàng 18K & Kim Cương',
      PhongCach: 'Sang trọng',
      DoiTuong: 'Nữ',
      TongTonKho: 15,
      HinhAnhChinh: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
      ],
      MoTa: 'Tuyệt tác trang sức vàng 18K đính kim cương chuẩn kiểm định GIA.',
      LaNoiBat: 1,
      bienthe: [
        { MaBienThe: 1, TenBienThe: 'Size 10 - Vàng Trắng 18K', GiaBan: 20000000, SoLuongTonKho: 8 },
        { MaBienThe: 2, TenBienThe: 'Size 11 - Vàng Trắng 18K', GiaBan: 20000000, SoLuongTonKho: 7 }
      ]
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      TenSanPham: prod.TenSanPham,
      MaDanhMuc: prod.MaDanhMuc || '',
      GiaCoSo: prod.GiaMin || prod.GiaCoSo,
      ChatLieu: prod.ChatLieu || 'Kim Cương GIA',
      PhongCach: prod.PhongCach || 'Sang trọng',
      DoiTuong: prod.DoiTuong || 'Nữ',
      TongTonKho: prod.TongTonKho || 15,
      HinhAnhChinh: prod.HinhAnhChinh,
      gallery: prod.gallery && prod.gallery.length > 0 ? [...prod.gallery] : [prod.HinhAnhChinh],
      MoTa: prod.MoTa,
      LaNoiBat: prod.LaNoiBat || 0,
      bienthe: prod.bienthe && prod.bienthe.length > 0
        ? prod.bienthe.map(v => ({ ...v }))
        : [
            {
              MaBienThe: Date.now(),
              TenBienThe: 'Tiêu Chuẩn',
              GiaBan: prod.GiaMin || prod.GiaCoSo,
              SoLuongTonKho: prod.TongTonKho || 15
            }
          ]
    });
    setOpenDialog(true);
  };

  // Upload Primary Image from local computer
  const handlePrimaryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP)!', 'warning');
      return;
    }
    try {
      notify('Đang tải ảnh lên hệ thống...', 'info');
      const url = await uploadProductImage(file);
      setFormData(prev => {
        const newGallery = prev.gallery ? [...prev.gallery] : [];
        if (!newGallery.includes(url)) {
          newGallery.unshift(url);
        }
        return {
          ...prev,
          HinhAnhChinh: url,
          gallery: newGallery.slice(0, 5)
        };
      });
      notify('Tải ảnh đại diện chính từ máy tính thành công!', 'success');
    } catch (err) {
      notify('Tải ảnh thất bại: ' + err.message, 'error');
    } finally {
      e.target.value = '';
    }
  };

  // Upload multiple Gallery Images from local computer (Max 5 total)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentCount = formData.gallery?.length || 0;
    const remainingSlots = 5 - currentCount;
    if (remainingSlots <= 0) {
      notify('Đã đạt giới hạn tối đa 5 ảnh cho mỗi sản phẩm!', 'warning');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    try {
      notify(`Đang tải ${filesToUpload.length} ảnh lên máy chủ...`, 'info');
      const uploadPromises = filesToUpload.map(f => uploadProductImage(f));
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...urls].slice(0, 5)
      }));
      notify(`Đã tải trực tiếp ${urls.length} hình ảnh vào bộ sưu tập!`, 'success');
    } catch (err) {
      notify('Tải ảnh thất bại: ' + err.message, 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData(prev => {
      const updatedGallery = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      let updatedMain = prev.HinhAnhChinh;
      if (prev.gallery[indexToRemove] === prev.HinhAnhChinh) {
        updatedMain = updatedGallery[0] || '';
      }
      return {
        ...prev,
        gallery: updatedGallery,
        HinhAnhChinh: updatedMain
      };
    });
  };

  const handleSetPrimaryImage = (imgUrl) => {
    setFormData(prev => ({
      ...prev,
      HinhAnhChinh: imgUrl
    }));
    notify('Đã đặt làm ảnh chính đại diện!', 'info');
  };

  // Variant operations
  const handleAddVariant = () => {
    const newVariant = {
      MaBienThe: Date.now() + Math.random(),
      TenBienThe: `Size ${10 + (formData.bienthe?.length || 0)} - Vàng 18K`,
      GiaBan: Number(formData.GiaCoSo) || 20000000,
      SoLuongTonKho: 5
    };
    setFormData(prev => ({
      ...prev,
      bienthe: [...(prev.bienthe || []), newVariant]
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.bienthe || [])];
      updated[index] = {
        ...updated[index],
        [field]: field === 'GiaBan' || field === 'SoLuongTonKho' ? Number(value) : value
      };
      return { ...prev, bienthe: updated };
    });
  };

  const handleRemoveVariant = (indexToRemove) => {
    if ((formData.bienthe || []).length <= 1) {
      notify('Sản phẩm cần có ít nhất 1 phiên bản/biến thể!', 'warning');
      return;
    }
    setFormData(prev => ({
      ...prev,
      bienthe: prev.bienthe.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleQuickAddSizes = () => {
    const defaultPrice = Number(formData.GiaCoSo) || 20000000;
    const sizes = [9, 10, 11, 12];
    const newVariants = sizes.map((sz, idx) => ({
      MaBienThe: Date.now() + idx,
      TenBienThe: `Size ${sz} - ${formData.ChatLieu || 'Vàng Trắng 18K'}`,
      GiaBan: defaultPrice,
      SoLuongTonKho: 5
    }));
    setFormData(prev => ({
      ...prev,
      bienthe: newVariants
    }));
    notify('Đã áp dụng nhanh bộ size nhẫn chuẩn (Size 9, 10, 11, 12)!', 'success');
  };

  const handleQuickAddMaterials = () => {
    const defaultPrice = Number(formData.GiaCoSo) || 20000000;
    const materials = [
      { name: 'Vàng Trắng 18K (White Gold)', priceAdj: 0 },
      { name: 'Vàng Hồng 18K (Rose Gold)', priceAdj: 1000000 },
      { name: 'Vàng 24K Hoàng Gia (Yellow Gold)', priceAdj: 2500000 },
      { name: 'Bạch Kim Platinum 950', priceAdj: 5000000 }
    ];
    const newVariants = materials.map((m, idx) => ({
      MaBienThe: Date.now() + idx,
      TenBienThe: m.name,
      GiaBan: defaultPrice + m.priceAdj,
      SoLuongTonKho: 6
    }));
    setFormData(prev => ({
      ...prev,
      bienthe: newVariants
    }));
    notify('Đã áp dụng nhanh bộ chất liệu Vàng Trắng, Vàng Hồng & Bạch Kim!', 'success');
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi hệ thống?`)) {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.MaSanPham !== id));
      notify(`Đã xóa sản phẩm "${name}" thành công!`, 'info');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.TenSanPham.trim()) {
      notify('Vui lòng nhập tên sản phẩm!', 'warning');
      return;
    }

    const catObj = categories.find(c => String(c.MaDanhMuc) === String(formData.MaDanhMuc));
    const categoryName = catObj ? catObj.TenDanhMuc : 'Trang Sức Cao Cấp';

    // Calculate price range and total inventory from variants
    let minPrice = Number(formData.GiaCoSo);
    let maxPrice = Number(formData.GiaCoSo);
    let totalStock = Number(formData.TongTonKho) || 0;

    let validVariants = (formData.bienthe || []).filter(v => v.TenBienThe && v.TenBienThe.trim());
    if (validVariants.length > 0) {
      const prices = validVariants.map(v => Number(v.GiaBan) || minPrice);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
      totalStock = validVariants.reduce((sum, v) => sum + (Number(v.SoLuongTonKho) || 0), 0);
    } else {
      validVariants = [
        {
          MaBienThe: Date.now(),
          TenBienThe: 'Tiêu Chuẩn',
          GiaBan: minPrice,
          SoLuongTonKho: totalStock
        }
      ];
    }

    // Ensure gallery has at least HinhAnhChinh
    let finalGallery = formData.gallery && formData.gallery.length > 0
      ? [...formData.gallery]
      : [formData.HinhAnhChinh || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'];
    if (formData.HinhAnhChinh && !finalGallery.includes(formData.HinhAnhChinh)) {
      finalGallery.unshift(formData.HinhAnhChinh);
    }

    if (editingProduct) {
      const updatedItem = await updateProduct(editingProduct.MaSanPham, {
        ...formData,
        TenDanhMuc: categoryName,
        GiaMin: minPrice,
        GiaMax: maxPrice,
        GiaCoSo: minPrice,
        TongTonKho: totalStock,
        gallery: finalGallery,
        bienthe: validVariants
      });
      setProducts(prev => prev.map(p => (p.MaSanPham === editingProduct.MaSanPham ? updatedItem : p)));
      notify(`Đã cập nhật sản phẩm "${formData.TenSanPham}" kèm ${validVariants.length} biến thể!`, 'success');
    } else {
      const newProd = await createProduct({
        ...formData,
        TenDanhMuc: categoryName,
        GiaMin: minPrice,
        GiaMax: maxPrice,
        GiaCoSo: minPrice,
        TongTonKho: totalStock,
        gallery: finalGallery,
        bienthe: validVariants
      });
      setProducts(prev => [newProd, ...prev]);
      notify(`Đã thêm mới sản phẩm "${formData.TenSanPham}" với ${validVariants.length} biến thể!`, 'success');
    }
    setOpenDialog(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.TenSanPham.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || String(p.MaDanhMuc) === String(filterCat);
    return matchSearch && matchCat;
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Title & Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Quản Lý Tuyệt Tác Sản Phẩm
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Quản lý biến thể (Size, Chất liệu, Giá bán) và tải ảnh trực tiếp từ máy tính lên hệ thống.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 20, px: 3, fontWeight: 700, boxShadow: '0 4px 14px rgba(183,110,121,0.3)' }}
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
                  <LuxurySearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
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
          {categories.map(c => (
            <MenuItem key={c.MaDanhMuc} value={String(c.MaDanhMuc)}>{c.TenDanhMuc}</MenuItem>
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
                <TableCell sx={{ fontWeight: 700 }}>Tên Sản Phẩm & Biến Thể</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Danh Mục</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chất Liệu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Khoảng Giá</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tổng Tồn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Bộ Sưu Tập</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    Chưa có sản phẩm nào. Bấm "Thêm Sản Phẩm Mới" để bắt đầu.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((prod) => (
                <TableRow key={prod.MaSanPham} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={prod.HinhAnhChinh || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'}
                      alt={prod.TenSanPham}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800';
                      }}
                      sx={{ width: 52, height: 52, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 240 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {prod.TenSanPham}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                      {prod.LaNoiBat === 1 && (
                        <Chip label="Nổi bật" size="small" color="primary" sx={{ fontSize: '0.65rem', height: 18 }} />
                      )}
                      {prod.bienthe && prod.bienthe.length > 0 && (
                        <Chip
                          label={`${prod.bienthe.length} biến thể`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 18, color: 'text.secondary' }}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {getCategoryProductIcon(prod.TenDanhMuc, { sx: { fontSize: 16, color: 'primary.main' } })}
                      <span>{prod.TenDanhMuc}</span>
                    </Box>
                  </TableCell>
                  <TableCell>{prod.ChatLieu || 'Kim Cương GIA'}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    {formatCurrency(prod.GiaMin || prod.GiaCoSo)}
                    {prod.GiaMax && prod.GiaMax > (prod.GiaMin || prod.GiaCoSo) && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 500 }}>
                        đến {formatCurrency(prod.GiaMax)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: (prod.TongTonKho || 10) < 5 ? 'error.main' : 'inherit' }}>
                      {prod.TongTonKho || 15}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${prod.gallery ? prod.gallery.length : 1} ảnh`}
                      size="small"
                      sx={{ bgcolor: '#FFF5F3', color: 'primary.main', fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(prod)} title="Chỉnh sửa sản phẩm & biến thể">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(prod.MaSanPham, prod.TenSanPham)} title="Xóa sản phẩm">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Hidden File Inputs for Direct Computer Upload */}
      <input
        type="file"
        ref={primaryFileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePrimaryImageUpload}
      />
      <input
        type="file"
        ref={galleryFileInputRef}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleGalleryUpload}
      />

      {/* Add / Edit Product Modal Dialog with Direct Upload & Variants */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{editingProduct ? 'Chỉnh Sửa Sản Phẩm & Biến Thể' : 'Thêm Tuyệt Tác Trang Sức Mới'}</span>
          <IconButton size="small" onClick={() => setOpenDialog(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSave}>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3.5}>
              {/* SECTION 1: BASIC INFORMATION */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AllJewelryProductIcon sx={{ fontSize: 18, color: 'primary.main' }} /> 1. THÔNG TIN CƠ BẢN CỦA TUYỆT TÁC
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Tên sản phẩm trang sức"
                      value={formData.TenSanPham}
                      onChange={(e) => setFormData({ ...formData, TenSanPham: e.target.value })}
                      placeholder="VD: Nhẫn Kim Cương Solitaire Eternal Grace..."
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Danh mục trang sức"
                      value={formData.MaDanhMuc || ''}
                      onChange={(e) => setFormData({ ...formData, MaDanhMuc: e.target.value })}
                    >
                      {categories.length === 0 ? (
                        <MenuItem value="" disabled>Chưa có danh mục nào (Hãy tạo danh mục trước)</MenuItem>
                      ) : (
                        categories.map(c => (
                          <MenuItem key={c.MaDanhMuc} value={c.MaDanhMuc}>{c.TenDanhMuc}</MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Giá cơ sở tham chiếu (VNĐ)"
                      value={formData.GiaCoSo}
                      onChange={(e) => setFormData({ ...formData, GiaCoSo: e.target.value })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Chất liệu & Đá quý chủ"
                      value={formData.ChatLieu}
                      onChange={(e) => setFormData({ ...formData, ChatLieu: e.target.value })}
                      placeholder="VD: Vàng 18K & Kim Cương GIA..."
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Đối tượng phù hợp"
                      value={formData.DoiTuong}
                      onChange={(e) => setFormData({ ...formData, DoiTuong: e.target.value })}
                    >
                      <MenuItem value="Nữ">Nữ giới</MenuItem>
                      <MenuItem value="Nam">Nam giới</MenuItem>
                      <MenuItem value="Unisex">Cặp đôi / Unisex</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2.5}
                      label="Mô tả giác cắt, độ tinh khiết & thiết kế"
                      value={formData.MoTa}
                      onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* SECTION 2: DIRECT IMAGE UPLOAD & GALLERY (MAX 5 IMAGES AS JINJA) */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GalleryIcon fontSize="small" /> 2. HÌNH ẢNH SẢN PHẨM & TẢI TRỰC TIẾP TỪ MÁY TÍNH
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={() => primaryFileInputRef.current?.click()}
                      sx={{ borderRadius: 2 }}
                    >
                      Tải Ảnh Chính Từ Máy
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<GalleryIcon />}
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={(formData.gallery?.length || 0) >= 5}
                      sx={{ borderRadius: 2 }}
                    >
                      Thêm Ảnh BST ({formData.gallery?.length || 0}/5)
                    </Button>
                  </Stack>
                </Box>

                {/* Primary & Gallery Preview Cards */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    Danh sách hình ảnh (Tối đa 5 ảnh). Bấm "Đặt làm ảnh chính" hoặc bấm nút xóa để đổi ảnh:
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
                    {(formData.gallery && formData.gallery.length > 0 ? formData.gallery : [formData.HinhAnhChinh]).map((img, idx) => {
                      const isMain = img === formData.HinhAnhChinh;
                      return (
                        <Card
                          key={idx}
                          sx={{
                            width: 130,
                            flexShrink: 0,
                            borderRadius: 2,
                            position: 'relative',
                            border: isMain ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.12)',
                            boxShadow: isMain ? '0 4px 12px rgba(183,110,121,0.2)' : 'none'
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="110"
                            image={img || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'}
                            alt={`Gallery ${idx}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800';
                            }}
                            sx={{ objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              color: '#FFFFFF',
                              p: 0.3,
                              '&:hover': { bgcolor: 'error.main' }
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>

                          <Box sx={{ p: 0.8, textAlign: 'center', bgcolor: isMain ? '#FFF5F3' : '#FFFFFF' }}>
                            {isMain ? (
                              <Chip
                                label="Ảnh Đại Diện"
                                size="small"
                                color="primary"
                                sx={{ fontSize: '0.65rem', height: 18, fontWeight: 700 }}
                              />
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleSetPrimaryImage(img)}
                                sx={{ fontSize: '0.65rem', p: 0, minWidth: 0, textTransform: 'none' }}
                              >
                                Đặt làm ảnh chính
                              </Button>
                            )}
                          </Box>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  label="Hoặc dán URL hình ảnh chính trực tiếp"
                  value={formData.HinhAnhChinh}
                  onChange={(e) => setFormData({ ...formData, HinhAnhChinh: e.target.value })}
                  placeholder="https://..."
                />
              </Box>

              <Divider />

              {/* SECTION 3: PRODUCT VARIANTS MANAGEMENT (SIZE, STONE/MATERIAL, PRICE, STOCK) */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VariantIcon fontSize="small" /> 3. QUẢN LÝ BIẾN THỂ TRANG SỨC (SIZE, CHẤT LIỆU, GIÁ BÁN, TỒN KHO)
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleQuickAddSizes}
                      sx={{ fontSize: '0.75rem', borderRadius: 2 }}
                    >
                      Tạo nhanh Size 9-12
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleQuickAddMaterials}
                      sx={{ fontSize: '0.75rem', borderRadius: 2 }}
                    >
                      Tạo nhanh Chất Liệu
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<AddIcon />}
                      onClick={handleAddVariant}
                      sx={{ fontSize: '0.75rem', borderRadius: 2 }}
                    >
                      Thêm Biến Thể
                    </Button>
                  </Stack>
                </Box>

                <Paper elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Tên Phiên Bản / Size / Chất Liệu</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: 170 }}>Giá Bán (VNĐ)</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: 120 }}>Tồn Kho</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, width: 60 }}>Xóa</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(formData.bienthe || []).map((v, index) => (
                        <TableRow key={v.MaBienThe || index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={v.TenBienThe}
                              onChange={(e) => handleUpdateVariant(index, 'TenBienThe', e.target.value)}
                              placeholder="VD: Size 10 - Vàng Trắng 18K"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={v.GiaBan}
                              onChange={(e) => handleUpdateVariant(index, 'GiaBan', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={v.SoLuongTonKho}
                              onChange={(e) => handleUpdateVariant(index, 'SoLuongTonKho', e.target.value)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveVariant(index)}
                              title="Xóa biến thể này"
                            >
                              <RemoveVariantIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 20, px: 3.5, fontWeight: 700, boxShadow: '0 4px 14px rgba(183,110,121,0.3)' }}
            >
              {editingProduct ? 'Lưu Thay Đổi Sản Phẩm' : 'Xác Nhận Thêm Sản Phẩm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
