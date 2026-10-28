import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Stack,
  Chip,
  Paper
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ContentCopy as CopyIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import {
  RingProductIcon,
  NecklaceProductIcon,
  OrderTrackingProductIcon,
  LuxurySparkleIcon,
  LuxuryGiaIcon
} from '../components/icons/ProductIcons';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import {
  getStoredProducts,
  fetchProducts,
  getStoredVouchers,
  fetchVouchers,
  getStoredCategories,
  fetchCategories
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { notify } = useAuth();
  const [products, setProducts] = React.useState(getStoredProducts);
  const [vouchers, setVouchers] = React.useState(getStoredVouchers);
  const [categories, setCategories] = React.useState(getStoredCategories);

  React.useEffect(() => {
    fetchProducts().then(data => { if (Array.isArray(data)) setProducts(data); });
    fetchVouchers().then(data => { if (Array.isArray(data)) setVouchers(data); });
    fetchCategories().then(data => { if (Array.isArray(data)) setCategories(data); });
  }, []);

  const featuredProducts = products.filter(p => p.LaNoiBat === 1).slice(0, 4);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    notify(`Đã lưu mã ưu đãi ${code}!`, 'success');
  };

  return (
    <Box sx={{ pb: 10, bgcolor: '#FCFBF9' }}>
      
      {/* 1. Hero Section (Modern Luxury Minimalist - Cartier / Tiffany Style) */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 540, md: 680 },
          display: 'flex',
          alignItems: 'center',
          background: 'radial-gradient(ellipse at 80% 20%, rgba(212, 175, 55, 0.12) 0%, rgba(183, 110, 121, 0.08) 35%, #FCFBF9 75%)',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(197, 168, 128, 0.18)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
            
            {/* Left Content Column */}
            <Grid size={{ xs: 12, md: 6.5 }} sx={{ zIndex: 2, textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.6,
                  borderRadius: 30,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  backdropFilter: 'blur(8px)',
                  mb: 3
                }}
              >
                <SparkleIcon sx={{ color: '#D4AF37', fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#8B3A48',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Haute Joaillerie Collection 2026
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.6rem', md: '4.4rem' },
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  lineHeight: 1.12,
                  color: '#2C1F20',
                  letterSpacing: '-0.02em',
                  mb: 3
                }}
              >
                Ánh Sáng Của <br />
                <Box
                  component="span"
                  sx={{
                    fontStyle: 'italic',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: 'linear-gradient(135deg, #B76E79 0%, #8B3A48 60%, #6B3A3A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Tình Yêu Vĩnh Cửu
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.12rem' },
                  color: 'text.secondary',
                  maxWidth: 540,
                  mb: 4.5,
                  mx: { xs: 'auto', md: 0 },
                  lineHeight: 1.85,
                  fontFamily: "'Jost', sans-serif"
                }}
              >
                Mỗi kiệt tác kim hoàn LUNA BELLE được chạm khắc với viên kim cương kiểm định GIA chuẩn giác cắt tối ưu, tôn vinh khí chất thanh tú và thần thái vương giả của chủ nhân.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4.5,
                    py: 1.6,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    borderRadius: 30,
                    background: 'linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #8B3A48 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 26px rgba(183, 110, 121, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B58259 0%, #A45B66 40%, #863B50 100%)',
                      boxShadow: '0 12px 32px rgba(183, 110, 121, 0.45)'
                    }
                  }}
                >
                  Khám Phá Tuyệt Tác
                </Button>

                <Button
                  component={Link}
                  to="/ai-consultant"
                  variant="outlined"
                  size="large"
                  startIcon={<LuxurySparkleIcon sx={{ color: '#D4AF37' }} />}
                  sx={{
                    px: 3.5,
                    py: 1.6,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    borderRadius: 30,
                    borderColor: 'rgba(197, 168, 128, 0.5)',
                    color: '#2C1F20',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      borderColor: '#B76E79',
                      bgcolor: '#FFFFFF'
                    }
                  }}
                >
                  Trợ Lý AI Stylist
                </Button>
              </Stack>
            </Grid>

            {/* Right Media Column */}
            <Grid size={{ xs: 12, md: 5.5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 300, sm: 380, md: 450 },
                  height: { xs: 300, sm: 380, md: 450 }
                }}
              >
                {/* Glowing halo */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -12,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(183, 110, 121, 0.15) 50%, transparent 75%)',
                    filter: 'blur(20px)'
                  }}
                />

                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80"
                  alt="LUNA BELLE Solitaire Diamond Ring"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '8px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 24px 60px rgba(183, 110, 121, 0.2)',
                    position: 'relative',
                    zIndex: 2
                  }}
                />

                {/* Floating Glassmorphism Badge */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: 15,
                    left: { xs: 8, sm: -15 },
                    zIndex: 3,
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                  }}
                >
                  <LuxuryGiaIcon sx={{ color: '#D4AF37', fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#8B3A48', letterSpacing: '0.06em' }}>
                      GIA CERTIFICATE
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                      Mã số khắc laser bảo an
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Brand Heritage Pillars (Minimalist luxury 4-pillar strip) */}
      <Container maxWidth="lg" sx={{ mt: -3.5, position: 'relative', zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3.5,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(197, 168, 128, 0.25)',
            boxShadow: '0 8px 30px rgba(183, 110, 121, 0.06)'
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37' }}>
                  <LuxuryGiaIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C1F20' }}>Kiểm Định GIA Quốc Tế</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>100% chứng thư giám định toàn cầu</Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: 'rgba(183, 110, 121, 0.1)', color: '#B76E79' }}>
                  <RingProductIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C1F20' }}>Bảo Hành & Xi Mạ Trọn Đời</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Miễn phí bảo dưỡng, làm mới vĩnh viễn</Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37' }}>
                  <OrderTrackingProductIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C1F20' }}>Giao Hỏa Tốc Có Bảo Hiểm</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chuyên viên giao tận tay toàn quốc</Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: 'rgba(183, 110, 121, 0.1)', color: '#B76E79' }}>
                  <LuxurySparkleIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C1F20' }}>Trợ Lý AI Stylist 24/7</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tư vấn phong cách & phong thủy</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* 3. Bento Grid Categories Showcase (Xu Hướng Bento Grid Hiện Đại) */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#B76E79',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '0.75rem'
            }}
          >
            HAUTE COLLECTIONS
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              color: '#2C1F20',
              mt: 0.8
            }}
          >
            Khám Phá Bộ Sưu Tập Tinh Tuyển
          </Typography>
        </Box>

        {/* Collections Showcase Layout - 2 Components */}
        <Grid container spacing={3}>
          {/* Item 1: Nhẫn Kim Cương Quý Phái */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              component={Link}
              to="/products?category=nhan-kim-cuong"
              sx={{
                display: 'block',
                position: 'relative',
                height: { xs: 320, md: 440 },
                borderRadius: 4,
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1px solid rgba(197, 168, 128, 0.2)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  boxShadow: '0 16px 40px rgba(183,110,121,0.18)',
                  '& .bento-img': { transform: 'scale(1.06)' }
                }
              }}
            >
              <CardMedia
                component="img"
                className="bento-img"
                image={(categories[0]?.AnhDaiDien) || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'}
                alt={(categories[0]?.TenDanhMuc) || 'Nhẫn Kim Cương'}
                sx={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  background: 'linear-gradient(to top, rgba(20, 10, 12, 0.92) 0%, rgba(20, 10, 12, 0.4) 55%, rgba(20, 10, 12, 0.05) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: { xs: 3, md: 4 }
                }}
              >
                <Chip
                  icon={<RingProductIcon sx={{ fontSize: '15px !important', color: '#2C1F20 !important' }} />}
                  label="BỘ SƯU TẬP CHỦ ĐẠO"
                  size="small"
                  sx={{ bgcolor: 'rgba(212, 175, 55, 0.9)', color: '#2C1F20', fontWeight: 700, width: 'fit-content', mb: 1, fontSize: '0.68rem' }}
                />
                <Typography variant="h4" sx={{ color: '#FFFFFF', fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>
                  {(categories[0]?.TenDanhMuc) || 'Nhẫn Kim Cương Quý Phái'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 460, mb: 2, display: { xs: 'none', sm: 'block' } }}>
                  {(categories[0]?.MoTa) || 'Tuyệt tác nhẫn đính hôn và nhẫn cưới giác cắt hoàn mỹ tôn vinh phong thái thượng lưu'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#F3E5AB', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  Khám phá toàn bộ thiết kế <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Item 2: Dây Chuyền & Mặt Dây */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              component={Link}
              to="/products?category=day-chuyen-mat-day"
              sx={{
                display: 'block',
                position: 'relative',
                height: { xs: 320, md: 440 },
                borderRadius: 4,
                overflow: 'hidden',
                textDecoration: 'none',
                border: '1px solid rgba(197, 168, 128, 0.2)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  boxShadow: '0 16px 40px rgba(183,110,121,0.18)',
                  '& .bento-img': { transform: 'scale(1.06)' }
                }
              }}
            >
              <CardMedia
                component="img"
                className="bento-img"
                image={(categories[1]?.AnhDaiDien) || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'}
                alt={(categories[1]?.TenDanhMuc) || 'Dây Chuyền Quý Phái'}
                sx={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  background: 'linear-gradient(to top, rgba(20, 10, 12, 0.92) 0%, rgba(20, 10, 12, 0.4) 55%, rgba(20, 10, 12, 0.05) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: { xs: 3, md: 4 }
                }}
              >
                <Chip
                  icon={<NecklaceProductIcon sx={{ fontSize: '15px !important', color: '#2C1F20 !important' }} />}
                  label="KIỆT TÁC ÁNH SÁNG"
                  size="small"
                  sx={{ bgcolor: 'rgba(212, 175, 55, 0.9)', color: '#2C1F20', fontWeight: 700, width: 'fit-content', mb: 1, fontSize: '0.68rem' }}
                />
                <Typography variant="h4" sx={{ color: '#FFFFFF', fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>
                  {(categories[1]?.TenDanhMuc) || 'Dây Chuyền & Mặt Dây'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 460, mb: 2, display: { xs: 'none', sm: 'block' } }}>
                  {(categories[1]?.MoTa) || 'Dây chuyền vàng 18K và bạch kim đính kim cương tôn vinh vẻ đẹp thanh lịch quý phái'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#F3E5AB', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  Khám phá toàn bộ thiết kế <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* 4. Curated Masterpieces (Sản Phẩm Tinh Tuyển Nổi Bật) */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#B76E79', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              EXQUISITE SELECTION
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mt: 0.8, color: '#2C1F20' }}>
              Tuyệt Phẩm Kim Cương Nổi Bật
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/products"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 600, color: '#8B3A48', letterSpacing: '0.04em' }}
          >
            Xem tất cả
          </Button>
        </Box>

        <Grid container spacing={3.5}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Grid key={product.MaSanPham} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard product={product} />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, bgcolor: '#FFFFFF', border: '1px dashed rgba(183,110,121,0.2)' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Bộ sưu tập mới đang được chế tác tinh xảo. Quý khách vui lòng quay lại sau!
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* 5. Special Voucher Privileges */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FFF6F7 0%, #FFFDFD 50%, #FAF6F3 100%)',
            border: '1px solid rgba(197, 168, 128, 0.25)',
            boxShadow: '0 8px 30px rgba(183, 110, 121, 0.08)'
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 4.5 }}>
              <Chip label="ĐẶC QUYỀN MUA SẮM" color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
              <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1.5 }}>
                Ưu Đãi Đặc Biệt Dành Riêng Cho Bạn
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Lưu ngay mã ưu đãi để áp dụng trực tiếp khi thanh toán đơn hàng trang sức Moissanite và Vàng 18K cao cấp.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 7.5 }}>
              <Grid container spacing={2}>
                {vouchers.map((v) => (
                  <Grid key={v.MaCode} size={{ xs: 12, sm: 4 }}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px dashed rgba(183, 110, 121, 0.45)',
                        bgcolor: '#FFFFFF',
                        textAlign: 'center',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#8B3A48' }}>
                        {v.MaCode}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', my: 1, minHeight: 36 }}>
                        {v.MoTa}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => copyCode(v.MaCode)}
                        startIcon={<CopyIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.74rem', py: 0.4, borderRadius: 20 }}
                      >
                        Lưu Mã
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
