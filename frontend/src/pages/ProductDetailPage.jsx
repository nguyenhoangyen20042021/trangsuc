import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Rating,
  Tabs,
  Tab,
  Paper,
  Stack,
  IconButton,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingBag as CartIcon,
  FlashOn as BuyNowIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  WorkspacePremium as GIAIcon,
  Security as WarrantyIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckIcon,
  Send as SendIcon,
  RateReview as ReviewIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, formatCurrency } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser, notify } = useAuth();

  // Find product by Slug or MaSanPham
  const product = MOCK_PRODUCTS.find(p => p.Slug === id || String(p.MaSanPham) === id) || MOCK_PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.HinhAnhChinh);
  const [selectedVariant, setSelectedVariant] = useState(
    product.bienthe && product.bienthe.length > 0 ? product.bienthe[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  // Reviews state & form
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Nguyễn Phương Thảo',
      rating: 5,
      date: '2 ngày trước',
      content: 'Nhẫn ở ngoài sáng và lấp lánh hơn cả trong hình! Đóng gói hộp nhung rất cao cấp, có đầy đủ thẻ kiểm định và khăn lau. Rất hài lòng!'
    },
    {
      id: 2,
      author: 'Trần Hoàng Minh',
      rating: 5,
      date: '1 tuần trước',
      content: 'Mình mua tặng bạn gái nhân dịp kỷ niệm. Bạn gái mình khen nức nở giác cắt và độ tinh xảo của chấu giữ kim cương. Nhân viên tư vấn rất nhiệt tình!'
    }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState(currentUser?.HoTen || '');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewContent.trim()) {
      notify('Vui lòng nhập nội dung nhận xét!', 'warning');
      return;
    }
    const newRev = {
      id: Date.now(),
      author: newReviewAuthor.trim() || 'Khách Hàng VIP',
      rating: newReviewRating,
      date: 'Vừa xong',
      content: newReviewContent.trim()
    };
    setReviews([newRev, ...reviews]);
    setNewReviewContent('');
    notify('Cảm ơn Quý khách đã gửi nhận xét đánh giá sản phẩm!', 'success');
  };

  const relatedProducts = MOCK_PRODUCTS.filter(p => p.MaSanPham !== product.MaSanPham).slice(0, 4);

  const currentPrice = selectedVariant ? selectedVariant.GiaBan : (product.GiaMin || product.GiaCoSo);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  return (
    <Box sx={{ py: 4, pb: 10 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink component={Link} to="/" color="inherit" sx={{ fontSize: '0.86rem' }}>
            Trang Chủ
          </MuiLink>
          <MuiLink component={Link} to="/products" color="inherit" sx={{ fontSize: '0.86rem' }}>
            Sản Phẩm
          </MuiLink>
          <MuiLink component={Link} to={`/products?category=${product.CatSlug}`} color="inherit" sx={{ fontSize: '0.86rem' }}>
            {product.TenDanhMuc}
          </MuiLink>
          <Typography color="primary" sx={{ fontSize: '0.86rem', fontWeight: 600 }}>
            {product.TenSanPham}
          </Typography>
        </Breadcrumbs>

        {/* Main Product Layout */}
        <Grid container spacing={5}>
          {/* Gallery Col */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Main Image */}
              <Box
                sx={{
                  position: 'relative',
                  pt: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: '#FAF7F5',
                  border: '1px solid rgba(183, 110, 121, 0.15)',
                  boxShadow: '0 8px 30px rgba(183, 110, 121, 0.08)'
                }}
              >
                <Box
                  component="img"
                  src={activeImage}
                  alt={product.TenSanPham}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  {product.gallery.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      sx={{
                        width: 76,
                        height: 76,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: activeImage === img ? '2px solid #B76E79' : '1px solid rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                        opacity: activeImage === img ? 1 : 0.7,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <Box component="img" src={img} alt="Thumb" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Details Info Col */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Chip
                  label={product.TenDanhMuc}
                  size="small"
                  sx={{ bgcolor: 'rgba(183, 110, 121, 0.12)', color: 'primary.main', fontWeight: 700, mb: 1.5 }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20', lineHeight: 1.25 }}
                >
                  {product.TenSanPham}
                </Typography>
              </Box>

              {/* Rating & Sold count */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={5} readOnly size="small" sx={{ color: '#D4AF37' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', ml: 0.5 }}>
                    5.0
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>{product.TongBan || 24}</strong> Lượt mua thành công
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckIcon sx={{ fontSize: 16 }} /> Sẵn hàng cao cấp
                </Typography>
              </Box>

              {/* Price Box */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: '#FFF5F3',
                  border: '1px solid rgba(183, 110, 121, 0.2)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 2
                }}
              >
                <Typography variant="h4" sx={{ color: 'primary.dark', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                  {formatCurrency(currentPrice)}
                </Typography>
                {product.GiaMax && product.GiaMax > currentPrice && (
                  <Typography variant="body1" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                    {formatCurrency(product.GiaMax)}
                  </Typography>
                )}
              </Paper>

              {/* Variant Picker */}
              {product.bienthe && product.bienthe.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Tùy Chọn Phiên Bản (Size & Chất Liệu):
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {product.bienthe.map((v) => {
                      const isSelected = selectedVariant?.MaBienThe === v.MaBienThe;
                      return (
                        <Button
                          key={v.MaBienThe}
                          variant={isSelected ? 'contained' : 'outlined'}
                          color="primary"
                          onClick={() => setSelectedVariant(v)}
                          sx={{
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? 700 : 500,
                            borderColor: isSelected ? 'primary.main' : 'rgba(183, 110, 121, 0.25)',
                            bgcolor: isSelected ? 'primary.main' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : 'text.primary',
                            '&:hover': {
                              bgcolor: isSelected ? 'primary.dark' : 'rgba(183, 110, 121, 0.08)'
                            }
                          }}
                        >
                          {v.TenBienThe} ({formatCurrency(v.GiaBan)})
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* Quantity Picker */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Số Lượng:
                </Typography>
                <Stack direction="row" sx={{ alignItems: 'center', border: '1px solid rgba(183, 110, 121, 0.3)', borderRadius: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 700, fontSize: '0.95rem' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  (Còn {selectedVariant?.SoLuongTonKho || product.TongTonKho || 15} sản phẩm trong kho)
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleAddToCart}
                  startIcon={<CartIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 30,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(183, 110, 121, 0.08)', borderColor: 'primary.dark' }
                  }}
                >
                  Thêm Vào Giỏ Hàng
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleBuyNow}
                  startIcon={<BuyNowIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 30,
                    boxShadow: '0 8px 24px rgba(183, 110, 121, 0.3)'
                  }}
                >
                  Mua Ngay
                </Button>
              </Stack>

              {/* Guarantees Box */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mt: 3,
                  borderRadius: 3,
                  bgcolor: '#FAF7F5',
                  border: '1px solid rgba(183, 110, 121, 0.15)'
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <GIAIcon sx={{ color: '#D4AF37' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>GIA / C&C</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Đầy đủ chứng thư</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <WarrantyIcon sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Trọn Đời</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Làm mới & xi mạ</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <ShippingIcon sx={{ color: '#D4AF37' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Hỏa Tốc</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Bảo hiểm toàn quốc</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 8 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ borderBottom: '1px solid rgba(183, 110, 121, 0.2)' }}
          >
            <Tab label="Mô Tả Tuyệt Phẩm" sx={{ fontWeight: 600, fontSize: '0.95rem' }} />
            <Tab label="Thông Số Kỹ Thuật" sx={{ fontWeight: 600, fontSize: '0.95rem' }} />
            <Tab label={`Đánh Giá Khách Hàng (${reviews.length})`} sx={{ fontWeight: 600, fontSize: '0.95rem' }} />
          </Tabs>

          {/* Tab 0: Description */}
          {activeTab === 0 && (
            <Paper elevation={0} sx={{ p: 4, mt: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(183,110,121,0.12)' }}>
              <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', whiteSpace: 'pre-line' }}>
                {product.MoTa}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', mt: 2 }}>
                Sản phẩm được chế tác hoàn toàn thủ công bởi đội ngũ nghệ nhân kim hoàn trên 15 năm kinh nghiệm của LUNA BELLE. Từng đường cắt giác kim cương đều tuân thủ nguyên tắc hội tụ ánh sáng tuyệt đối, tạo nên vẻ rực rỡ và lấp lánh như ngọn lửa tình yêu vĩnh cửu.
              </Typography>
            </Paper>
          )}

          {/* Tab 1: Specs */}
          {activeTab === 1 && (
            <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(183,110,121,0.12)' }}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: '30%', color: 'text.secondary' }}>Chất Liệu Kim Loại</TableCell>
                      <TableCell>{product.ChatLieu}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Phong Cách Thiết Kế</TableCell>
                      <TableCell>{product.PhongCach}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Đối Tượng Phù Hợp</TableCell>
                      <TableCell>{product.DoiTuong}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Chứng Nhận Quốc Tế</TableCell>
                      <TableCell>GIA / C&C Moissanite Certificate kèm mã laser</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Chính Sách Bảo Hành</TableCell>
                      <TableCell>Bảo hành trọn đời, miễn phí chỉnh size nhẫn 02 lần</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Tab 2: Reviews & Add Review Form */}
          {activeTab === 2 && (
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Form Gửi Nhận Xét Mới */}
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: '#FFFDFD', border: '1px solid rgba(183,110,121,0.2)' }}>
                <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1, color: '#2C1F20' }}>
                  Viết Nhận Xét & Đánh Giá Của Bạn
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Chia sẻ cảm nhận về độ tinh xảo, giác cắt kim cương và dịch vụ giao hàng để giúp người mua sau có thêm thông tin hữu ích!
                </Typography>

                <Box component="form" onSubmit={handleReviewSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        label="Họ và tên của bạn"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Mức độ hài lòng:
                        </Typography>
                        <Rating
                          value={newReviewRating}
                          onChange={(e, val) => setNewReviewRating(val || 5)}
                          sx={{ color: '#D4AF37' }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Nêu cảm nhận chi tiết của bạn về sản phẩm trang sức này..."
                        value={newReviewContent}
                        onChange={(e) => setNewReviewContent(e.target.value)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        sx={{ borderRadius: 20, px: 3.5, fontWeight: 700 }}
                      >
                        Gửi Đánh Giá Ngay
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>

              {/* Danh Sách Các Đánh Giá Hiện Có */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(183,110,121,0.12)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'primary.dark' }}>
                  Nhận Xét Từ Khách Hàng Thực Tế ({reviews.length})
                </Typography>

                <Stack spacing={3}>
                  {reviews.map((rev, index) => (
                    <React.Fragment key={rev.id}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Rating value={rev.rating} readOnly size="small" sx={{ color: '#D4AF37' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{rev.author}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>{rev.date}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.7 }}>
                          {rev.content}
                        </Typography>
                      </Box>
                      {index < reviews.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Related Products */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Tuyệt Tác Cùng Bộ Sưu Tập
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((p) => (
              <Grid key={p.MaSanPham} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
