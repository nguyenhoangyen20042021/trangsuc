import React, { useState, useEffect, useMemo } from 'react';
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
  Chip,
  Collapse,
  MenuItem,
  InputAdornment,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  AccountTree as HierarchyIcon,
  Inventory2 as InventoryIcon,
  UnfoldMore as UnfoldMoreIcon,
  UnfoldLess as UnfoldLessIcon
} from '@mui/icons-material';
import { getCategoryProductIcon } from '../../components/icons/ProductIcons';
import {
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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedCatIds, setExpandedCatIds] = useState({});

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [isChildMode, setIsChildMode] = useState(false);
  const [formData, setFormData] = useState({
    TenDanhMuc: '',
    MaDanhMucCha: '',
    MoTa: '',
    AnhDaiDien: ''
  });

  // Refresh categories from backend
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.warn('Lỗi tải danh mục:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Compute Statistics
  const stats = useMemo(() => {
    let subCount = 0;
    let prodCount = 0;
    categories.forEach(c => {
      subCount += (c.children?.length || 0);
      prodCount += (c.SoLuongSP || 0);
    });
    return {
      parents: categories.length,
      subs: subCount,
      products: prodCount
    };
  }, [categories]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map(cat => {
        const matchParent = cat.TenDanhMuc?.toLowerCase().includes(q) || cat.MoTa?.toLowerCase().includes(q);
        const matchingChildren = (cat.children || []).filter(
          ch => ch.TenDanhMuc?.toLowerCase().includes(q) || ch.MoTa?.toLowerCase().includes(q)
        );
        if (matchParent || matchingChildren.length > 0) {
          return {
            ...cat,
            // If parent matched, keep all children; if only children matched, keep matched children
            children: matchParent ? cat.children : matchingChildren
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [categories, search]);

  // Toggle expand for a category
  const toggleExpand = (catId) => {
    setExpandedCatIds(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Expand / Collapse all
  const handleToggleAll = (expand) => {
    const newState = {};
    if (expand) {
      categories.forEach(c => {
        newState[c.MaDanhMuc] = true;
      });
    }
    setExpandedCatIds(newState);
  };

  // Open Dialog to Add Parent Category
  const handleOpenAddParent = () => {
    setEditingCat(null);
    setIsChildMode(false);
    setFormData({
      TenDanhMuc: '',
      MaDanhMucCha: '',
      MoTa: '',
      AnhDaiDien: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    });
    setOpenDialog(true);
  };

  // Open Dialog to Add Subcategory
  const handleOpenAddChild = (parentCat = null) => {
    setEditingCat(null);
    setIsChildMode(true);
    const parentId = parentCat ? parentCat.MaDanhMuc : (categories[0]?.MaDanhMuc || '');
    setFormData({
      TenDanhMuc: '',
      MaDanhMucCha: parentId,
      MoTa: '',
      AnhDaiDien: parentCat?.AnhDaiDien || ''
    });
    // Auto expand this parent row so user sees new subcategory
    if (parentId) {
      setExpandedCatIds(prev => ({ ...prev, [parentId]: true }));
    }
    setOpenDialog(true);
  };

  // Open Dialog to Edit Category (Parent or Child)
  const handleOpenEdit = (cat, isChild = false, parentId = null) => {
    setEditingCat(cat);
    setIsChildMode(isChild);
    setFormData({
      TenDanhMuc: cat.TenDanhMuc || '',
      MaDanhMucCha: isChild ? (cat.MaDanhMucCha || parentId || '') : '',
      MoTa: cat.MoTa || '',
      AnhDaiDien: cat.AnhDaiDien || ''
    });
    setOpenDialog(true);
  };

  // Handle Delete (Parent or Subcategory)
  const handleDelete = async (id, name, isChild = false, childCount = 0) => {
    let confirmMsg = `Bạn có chắc muốn xóa ${isChild ? 'danh mục con' : 'danh mục'} "${name}"?`;
    if (!isChild && childCount > 0) {
      confirmMsg += `\nLƯU Ý: Danh mục này đang chứa ${childCount} danh mục con!`;
    }

    if (window.confirm(confirmMsg)) {
      const res = await deleteCategory(id);
      if (res && res.success === false) {
        notify(res.message || 'Không thể xóa danh mục này!', 'error');
        return;
      }
      await loadCategories();
      notify(`Đã xóa thành công danh mục "${name}"!`, 'info');
    }
  };

  // Save Category Form (Add or Edit)
  const handleSave = async (e) => {
    e.preventDefault();
    const trimmedName = formData.TenDanhMuc.trim();
    if (!trimmedName) {
      notify('Vui lòng nhập tên danh mục!', 'warning');
      return;
    }

    const payload = {
      TenDanhMuc: trimmedName,
      MoTa: formData.MoTa.trim(),
      AnhDaiDien: formData.AnhDaiDien.trim() || undefined,
      MaDanhMucCha: formData.MaDanhMucCha ? Number(formData.MaDanhMucCha) : null
    };

    try {
      if (editingCat) {
        await updateCategory(editingCat.MaDanhMuc, payload);
        notify(`Đã cập nhật danh mục "${trimmedName}"!`, 'success');
      } else {
        await createCategory(payload);
        notify(`Đã tạo danh mục mới "${trimmedName}"!`, 'success');
      }

      // If added a subcategory, ensure its parent is expanded
      if (payload.MaDanhMucCha) {
        setExpandedCatIds(prev => ({ ...prev, [payload.MaDanhMucCha]: true }));
      }

      await loadCategories();
      setOpenDialog(false);
    } catch (err) {
      notify(err.message || 'Lỗi khi lưu danh mục', 'error');
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* 1. Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Quản Lý Danh Mục Trang Sức
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Cấu hình phân cấp danh mục chính & danh mục con hiển thị trên hệ thống LUNA BELLE.
          </Typography>

          {/* Quick Statistics Badges */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<CategoryIcon sx={{ fontSize: 16 }} />}
              label={`${stats.parents} Danh mục chính`}
              size="small"
              sx={{ bgcolor: '#F7F3EE', color: '#8B3A48', fontWeight: 600, border: '1px solid #EADCCB' }}
            />
            <Chip
              icon={<HierarchyIcon sx={{ fontSize: 16 }} />}
              label={`${stats.subs} Danh mục con`}
              size="small"
              sx={{ bgcolor: '#F0F7F4', color: '#2E7D32', fontWeight: 600, border: '1px solid #C8E6C9' }}
            />
            <Chip
              icon={<InventoryIcon sx={{ fontSize: 16 }} />}
              label={`${stats.products} Tổng sản phẩm`}
              size="small"
              sx={{ bgcolor: '#F5F5FA', color: '#3F51B5', fontWeight: 600, border: '1px solid #D6D8F0' }}
            />
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SubdirectoryArrowRightIcon />}
            onClick={() => handleOpenAddChild()}
            sx={{ borderRadius: 20, px: 2.5, fontWeight: 700, textTransform: 'none' }}
          >
            Thêm Danh Mục Con
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddParent}
            sx={{ borderRadius: 20, px: 3, fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px rgba(139, 58, 72, 0.25)' }}
          >
            Thêm Danh Mục Chính
          </Button>
        </Stack>
      </Box>

      {/* 2. Search & Expand Controls Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 3,
          border: '1px solid rgba(197, 168, 128, 0.25)',
          bgcolor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm danh mục chính hoặc danh mục con..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 360 } }}
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

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="text"
            startIcon={<UnfoldMoreIcon />}
            onClick={() => handleToggleAll(true)}
            sx={{ color: 'text.secondary', fontSize: '0.82rem', textTransform: 'none' }}
          >
            Mở rộng tất cả
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<UnfoldLessIcon />}
            onClick={() => handleToggleAll(false)}
            sx={{ color: 'text.secondary', fontSize: '0.82rem', textTransform: 'none' }}
          >
            Thu gọn tất cả
          </Button>
        </Stack>
      </Paper>

      {/* 3. Main Hierarchical Category Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ width: 48, fontWeight: 700 }} align="center" />
                <TableCell sx={{ fontWeight: 700, width: 75 }}>Ảnh</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Danh Mục Chính</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 100 }}>Mã Số</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 180 }}>Danh Mục Con</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 130 }}>Sản Phẩm</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mô Tả</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, width: 160 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    Đang tải dữ liệu danh mục...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {search ? `Không tìm thấy danh mục nào phù hợp với từ khóa "${search}".` : 'Chưa có danh mục nào trong hệ thống. Bấm nút "Thêm Danh Mục" để tạo mới.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat) => {
                  const isExpanded = !!expandedCatIds[cat.MaDanhMuc];
                  const childCount = cat.children?.length || 0;

                  return (
                    <React.Fragment key={cat.MaDanhMuc}>
                      {/* PARENT ROW */}
                      <TableRow
                        hover
                        sx={{
                          bgcolor: isExpanded ? 'rgba(197, 168, 128, 0.04)' : 'inherit',
                          '&:hover': { bgcolor: 'rgba(197, 168, 128, 0.08)' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {/* Expand / Collapse Icon */}
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Tooltip title={isExpanded ? 'Thu gọn danh mục con' : `Xem ${childCount} danh mục con`}>
                            <IconButton
                              size="small"
                              onClick={() => toggleExpand(cat.MaDanhMuc)}
                              sx={{
                                color: isExpanded ? 'primary.main' : 'text.secondary',
                                bgcolor: isExpanded ? 'rgba(139, 58, 72, 0.08)' : 'transparent',
                                transition: 'all 0.2s'
                              }}
                            >
                              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>

                        {/* Thumbnail */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Box
                            component="img"
                            src={cat.AnhDaiDien || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'}
                            alt={cat.TenDanhMuc}
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,
                              objectFit: 'cover',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                              border: '1px solid rgba(0,0,0,0.06)'
                            }}
                          />
                        </TableCell>

                        {/* Category Name */}
                        <TableCell sx={{ fontWeight: 700, color: 'text.primary', py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            {getCategoryProductIcon(cat.TenDanhMuc, { sx: { fontSize: 22, color: 'primary.main' } })}
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C1F20' }}>
                              {cat.TenDanhMuc}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* ID */}
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', py: 1.5 }}>
                          <Typography variant="caption" sx={{ bgcolor: '#F0F0F0', px: 1, py: 0.4, borderRadius: 1, fontWeight: 600 }}>
                            #{cat.MaDanhMuc}
                          </Typography>
                        </TableCell>

                        {/* Subcategory Count Chip (Click to toggle) */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Tooltip title="Nhấn để xem / đóng danh mục con">
                            <Chip
                              icon={<HierarchyIcon sx={{ fontSize: '14px !important' }} />}
                              label={`${childCount} danh mục con`}
                              size="small"
                              onClick={() => toggleExpand(cat.MaDanhMuc)}
                              color={childCount > 0 ? 'primary' : 'default'}
                              variant={isExpanded ? 'filled' : 'outlined'}
                              sx={{
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.78rem'
                              }}
                            />
                          </Tooltip>
                        </TableCell>

                        {/* Total Product Count */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={`${cat.SoLuongSP || 0} sản phẩm`}
                            size="small"
                            sx={{
                              bgcolor: '#F3F4F6',
                              color: 'text.primary',
                              fontWeight: 600,
                              fontSize: '0.78rem'
                            }}
                          />
                        </TableCell>

                        {/* Description */}
                        <TableCell sx={{ maxWidth: 280, color: 'text.secondary', fontSize: '0.85rem', py: 1.5 }}>
                          <Typography variant="body2" noWrap title={cat.MoTa || ''} sx={{ fontSize: '0.85rem' }}>
                            {cat.MoTa || '—'}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                            <Tooltip title="Thêm danh mục con vào mục này">
                              <IconButton
                                size="small"
                                sx={{ color: '#2E7D32', bgcolor: 'rgba(46, 125, 50, 0.08)', '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.16)' } }}
                                onClick={() => handleOpenAddChild(cat)}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Chỉnh sửa danh mục chính">
                              <IconButton size="small" color="primary" onClick={() => handleOpenEdit(cat, false)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Xóa danh mục chính">
                              <IconButton size="small" color="error" onClick={() => handleDelete(cat.MaDanhMuc, cat.TenDanhMuc, false, childCount)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>

                      {/* SUBCATEGORIES EXPANDABLE ROW */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0, borderBottom: isExpanded ? '1px solid rgba(0,0,0,0.12)' : 'none' }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                py: 2.5,
                                px: 4,
                                bgcolor: '#FCFAF7',
                                borderLeft: '4px solid #C5A880',
                                borderTop: '1px dashed rgba(197, 168, 128, 0.3)',
                                borderBottom: '1px dashed rgba(197, 168, 128, 0.3)',
                                ml: 2,
                                mr: 2,
                                my: 1,
                                borderRadius: 2
                              }}
                            >
                              {/* Subcategory Panel Header */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SubdirectoryArrowRightIcon sx={{ color: '#8B3A48', fontSize: 20 }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C1F20' }}>
                                    Danh Mục Con Thuộc «{cat.TenDanhMuc}»
                                  </Typography>
                                  <Chip
                                    label={`${childCount} mục`}
                                    size="small"
                                    sx={{ bgcolor: '#F2E8DC', color: '#8B3A48', fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                                  />
                                </Box>

                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleOpenAddChild(cat)}
                                  sx={{
                                    borderRadius: 15,
                                    px: 2,
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    boxShadow: 'none'
                                  }}
                                >
                                  + Thêm Danh Mục Con Cho «{cat.TenDanhMuc}»
                                </Button>
                              </Box>

                              {/* Nested Subcategories Table */}
                              {childCount === 0 ? (
                                <Alert
                                  severity="info"
                                  sx={{
                                    bgcolor: 'rgba(212, 175, 55, 0.08)',
                                    color: '#5D4037',
                                    border: '1px solid rgba(212, 175, 55, 0.25)',
                                    borderRadius: 2
                                  }}
                                  action={
                                    <Button
                                      size="small"
                                      color="primary"
                                      onClick={() => handleOpenAddChild(cat)}
                                      sx={{ fontWeight: 700, textTransform: 'none' }}
                                    >
                                      Thêm ngay
                                    </Button>
                                  }
                                >
                                  Danh mục này chưa có danh mục con nào. Hãy tạo danh mục con để phân loại trang sức chi tiết hơn!
                                </Alert>
                              ) : (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
                                  <Table size="small">
                                    <TableHead sx={{ bgcolor: '#F5EFEB' }}>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 700, width: 80, fontSize: '0.78rem' }}>Mã Số</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Tên Danh Mục Con</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: 140, fontSize: '0.78rem' }}>Sản Phẩm</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>Mô Tả Chi Tiết</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, width: 120, fontSize: '0.78rem' }}>Thao Tác</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {cat.children.map((sub) => (
                                        <TableRow
                                          key={sub.MaDanhMuc}
                                          hover
                                          sx={{ '&:hover': { bgcolor: 'rgba(139, 58, 72, 0.03)' } }}
                                        >
                                          <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                            <Typography variant="caption" sx={{ bgcolor: '#FFF', border: '1px solid #E5E7EB', px: 0.8, py: 0.2, borderRadius: 1, fontWeight: 600 }}>
                                              #{sub.MaDanhMuc}
                                            </Typography>
                                          </TableCell>

                                          <TableCell sx={{ fontWeight: 600, color: '#2C1F20', fontSize: '0.85rem' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                              {getCategoryProductIcon(sub.TenDanhMuc, { sx: { fontSize: 16, color: '#8B3A48' } })}
                                              <span>{sub.TenDanhMuc}</span>
                                            </Box>
                                          </TableCell>

                                          <TableCell sx={{ fontSize: '0.8rem' }}>
                                            <Chip
                                              label={`${sub.SoLuongSP || 0} sản phẩm`}
                                              size="small"
                                              variant="outlined"
                                              sx={{ fontSize: '0.72rem', height: 22, fontWeight: 600 }}
                                            />
                                          </TableCell>

                                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', maxWidth: 300 }}>
                                            {sub.MoTa || '—'}
                                          </TableCell>

                                          <TableCell align="center">
                                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                              <Tooltip title="Chỉnh sửa danh mục con">
                                                <IconButton
                                                  size="small"
                                                  color="primary"
                                                  onClick={() => handleOpenEdit(sub, true, cat.MaDanhMuc)}
                                                >
                                                  <EditIcon sx={{ fontSize: 17 }} />
                                                </IconButton>
                                              </Tooltip>

                                              <Tooltip title="Xóa danh mục con">
                                                <IconButton
                                                  size="small"
                                                  color="error"
                                                  onClick={() => handleDelete(sub.MaDanhMuc, sub.TenDanhMuc, true, 0)}
                                                >
                                                  <DeleteIcon sx={{ fontSize: 17 }} />
                                                </IconButton>
                                              </Tooltip>
                                            </Stack>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 4. Unified Dialog for Adding / Editing Category or Subcategory */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
      >
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, pb: 1 }}>
          {editingCat
            ? (isChildMode ? 'Cập Nhật Danh Mục Con' : 'Cập Nhật Danh Mục Chính')
            : (isChildMode ? 'Thêm Danh Mục Con Mới' : 'Thêm Danh Mục Chính Mới')}
        </DialogTitle>

        <Divider />

        <form onSubmit={handleSave}>
          <DialogContent sx={{ pt: 2.5 }}>
            <Stack spacing={2.5}>
              {/* Category Type / Parent Selector */}
              <TextField
                select
                fullWidth
                label="Cấp bậc danh mục"
                value={formData.MaDanhMucCha || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, MaDanhMucCha: val });
                  setIsChildMode(Boolean(val));
                }}
                helperText={formData.MaDanhMucCha ? 'Danh mục con sẽ hiển thị nằm dưới danh mục chính đã chọn.' : 'Danh mục chính độc lập ở cấp cao nhất trên thanh menu điều hướng.'}
              >
                <MenuItem value="" sx={{ fontWeight: 700, color: '#8B3A48' }}>
                  ⭐ Là Danh Mục Chính (Cấp Cao Nhất)
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {categories.map((c) => (
                  <MenuItem
                    key={c.MaDanhMuc}
                    value={c.MaDanhMuc}
                    disabled={editingCat && editingCat.MaDanhMuc === c.MaDanhMuc}
                    sx={{ pl: 3 }}
                  >
                    ↳ Thuộc danh mục: <strong>{c.TenDanhMuc}</strong>
                  </MenuItem>
                ))}
              </TextField>

              {/* Category Name */}
              <TextField
                required
                fullWidth
                label={isChildMode ? 'Tên danh mục con' : 'Tên danh mục chính'}
                placeholder={isChildMode ? 'VD: Nhẫn Cầu Hôn Solitaire, Vòng Tay Tennis...' : 'VD: Nhẫn Kim Cương, Dây Chuyền & Mặt Dây...'}
                value={formData.TenDanhMuc}
                onChange={(e) => setFormData({ ...formData, TenDanhMuc: e.target.value })}
              />

              {/* Thumbnail / Image Upload */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
                  Ảnh đại diện danh mục {isChildMode ? '(tùy chọn)' : '(khuyến nghị có)'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadIcon />}
                    component="label"
                    sx={{ borderRadius: 2, textTransform: 'none' }}
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
                  label="Hoặc dán URL ảnh đại diện"
                  value={formData.AnhDaiDien}
                  onChange={(e) => setFormData({ ...formData, AnhDaiDien: e.target.value })}
                />
              </Box>

              {/* Description */}
              <TextField
                fullWidth
                multiline
                rows={2.5}
                label="Mô tả danh mục"
                placeholder="Mô tả ngắn gọn về đặc điểm trang sức, phong cách hoặc bộ sưu tập..."
                value={formData.MoTa}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 20, px: 3, fontWeight: 700, textTransform: 'none' }}
            >
              {editingCat ? 'Lưu Thay Đổi' : (isChildMode ? 'Tạo Danh Mục Con' : 'Tạo Danh Mục Chính')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
