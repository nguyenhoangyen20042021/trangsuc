import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Slider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Button,
  Chip,
  Pagination,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  IconButton,
  Drawer
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, formatCurrency } from '../services/api';

const MATERIALS = ['Tất cả', 'Kim Cương GIA', 'Vàng 18K & Moissanite', 'Kim Cương & Bạch Kim', 'Ngọc Trai South Sea & Vàng 18K', 'Đá Quý Emerald & Vàng Vàng 18K'];
const STYLES = ['Tất cả', 'Sang trọng', 'Lãng mạn', 'Đẳng cấp', 'Quý phái', 'Quyền lực', 'Tối giản'];
const AUDIENCES = ['Tất cả', 'Nữ', 'Nam', 'Unisex', 'Cặp đôi'];

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedMaterial, setSelectedMaterial] = useState('Tất cả');
  const [selectedStyle, setSelectedStyle] = useState('Tất cả');
  const [selectedAudience, setSelectedAudience] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState([0, 70000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize when URL category changes
  React.useEffect(() => {
    if (categoryParam !== 'all') {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('Tất cả');
    setSelectedStyle('Tất cả');
    setSelectedAudience('Tất cả');
    setPriceRange([0, 70000000]);
    setSortBy('newest');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Search query
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = product.TenSanPham.toLowerCase().includes(q);
        const matchesDesc = product.MoTa.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        const matchesSlug = product.CatSlug === selectedCategory;
        const parentCategory = MOCK_CATEGORIES.find(c => c.children?.some(sub => sub.Slug === selectedCategory));
        const matchesParent = parentCategory && product.CatSlug === parentCategory.Slug;
        if (!matchesSlug && !matchesParent) return false;
      }

      // Material
      if (selectedMaterial !== 'Tất cả' && product.ChatLieu !== selectedMaterial) {
        return false;
      }

      // Style
      if (selectedStyle !== 'Tất cả' && product.PhongCach !== selectedStyle) {
        return false;
      }

      // Audience
      if (selectedAudience !== 'Tất cả' && product.DoiTuong !== selectedAudience) {
        return false;
      }

      // Price Range
      const minPrice = product.GiaMin || product.GiaCoSo;
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.GiaMin || a.GiaCoSo;
      const priceB = b.GiaMin || b.GiaCoSo;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'bestseller') return b.TongBan - a.TongBan;
      return b.MaSanPham - a.MaSanPham; // newest
    });
  }, [queryParam, selectedCategory, selectedMaterial, selectedStyle, selectedAudience, priceRange, sortBy]);

  const pageSize = 8;
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  const FilterSidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          Bộ Lọc Tuyển Chọn
        </Typography>
        <Button
          size="small"
          onClick={handleResetFilters}
          startIcon={<ResetIcon />}
          sx={{ fontSize: '0.78rem', color: 'primary.main' }}
        >
          Đặt lại
        </Button>
      </Box>

      {/* Category Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Danh Mục Sản Phẩm
        </Typography>
        <RadioGroup value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <FormControlLabel
            value="all"
            control={<Radio size="small" color="primary" />}
            label="Tất cả danh mục"
            sx={{ '& .MuiTypography-root': { fontSize: '0.88rem' } }}
          />
          {MOCK_CATEGORIES.map((cat) => (
            <FormControlLabel
              key={cat.Slug}
              value={cat.Slug}
              control={<Radio size="small" color="primary" />}
              label={cat.TenDanhMuc}
              sx={{ '& .MuiTypography-root': { fontSize: '0.88rem' } }}
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Price Range Slider */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Khoảng Giá
        </Typography>
        <Slider
          value={priceRange}
          onChange={(e, newVal) => setPriceRange(newVal)}
          min={0}
          max={70000000}
          step={1000000}
          color="primary"
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => `${(val / 1000000).toFixed(0)}tr`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {formatCurrency(priceRange[0])}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {formatCurrency(priceRange[1])}
          </Typography>
        </Box>
      </Box>

      {/* Material Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Chất Liệu & Đá Quý
        </Typography>
        <RadioGroup value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
          {MATERIALS.map((mat) => (
            <FormControlLabel
              key={mat}
              value={mat}
              control={<Radio size="small" color="primary" />}
              label={mat}
              sx={{ '& .MuiTypography-root': { fontSize: '0.85rem' } }}
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Style Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Phong Cách Thiết Kế
        </Typography>
        <RadioGroup value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
          {STYLES.map((st) => (
            <FormControlLabel
              key={st}
              value={st}
              control={<Radio size="small" color="primary" />}
              label={st}
              sx={{ '& .MuiTypography-root': { fontSize: '0.85rem' } }}
            />
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ py: 4, pb: 10 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" color="inherit" sx={{ fontSize: '0.86rem' }}>
            Trang Chủ
          </MuiLink>
          <Typography color="primary" sx={{ fontSize: '0.86rem', fontWeight: 600 }}>
            Danh Mục Sản Phẩm
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Desktop Filter Sidebar */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(183, 110, 121, 0.15)',
                bgcolor: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(183, 110, 121, 0.05)'
              }}
            >
              {FilterSidebarContent}
            </Paper>
          </Grid>

          {/* Product Listing Main */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Header Controls */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(183, 110, 121, 0.12)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setMobileFilterOpen(true)}
                  sx={{ display: { xs: 'inline-flex', md: 'none' }, borderRadius: 20 }}
                >
                  Lọc
                </Button>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm trang sức
                </Typography>
              </Box>

              {/* Sort By Select */}
              <Box sx={{ minWidth: 200 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Sắp xếp theo</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sắp xếp theo"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="newest">Mới nhất</MenuItem>
                    <MenuItem value="bestseller">Bán chạy nhất</MenuItem>
                    <MenuItem value="price-asc">Giá: Thấp đến Cao</MenuItem>
                    <MenuItem value="price-desc">Giá: Cao đến Thấp</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Active Filters Bar */}
            {(selectedCategory !== 'all' || selectedMaterial !== 'Tất cả' || selectedStyle !== 'Tất cả' || queryParam) && (
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {queryParam && (
                  <Chip
                    label={`Từ khóa: "${queryParam}"`}
                    onDelete={() => setSearchParams({})}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {selectedCategory !== 'all' && (
                  <Chip
                    label={`Danh mục: ${selectedCategory}`}
                    onDelete={() => setSelectedCategory('all')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {selectedMaterial !== 'Tất cả' && (
                  <Chip
                    label={`Chất liệu: ${selectedMaterial}`}
                    onDelete={() => setSelectedMaterial('Tất cả')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            )}

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid key={product.MaSanPham} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#FFFFFF', border: '1px dashed rgba(183,110,121,0.3)' }}>
                <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", mb: 1, color: 'text.secondary' }}>
                  Không tìm thấy sản phẩm phù hợp
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                  Vui lòng thử điều chỉnh lại bộ lọc giá hoặc danh mục tìm kiếm.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleResetFilters}>
                  Xóa bộ lọc
                </Button>
              </Paper>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{ sx: { width: 300, p: 3 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {FilterSidebarContent}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setMobileFilterOpen(false)}
          sx={{ mt: 3, borderRadius: 20 }}
        >
          Áp dụng bộ lọc
        </Button>
      </Drawer>
    </Box>
  );
};
