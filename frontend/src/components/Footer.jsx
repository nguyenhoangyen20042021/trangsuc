import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, TextField, Button, Divider, Stack } from '@mui/material';
import { Diamond as DiamondIcon, Phone as PhoneIcon, Email as EmailIcon, LocationOn as LocationIcon, Security as SecurityIcon, WorkspacePremium as PremiumIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#6B3A3A', color: '#FFFFFF', pt: 8, pb: 4, mt: 'auto', borderTop: '2px solid rgba(212, 175, 55, 0.4)' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          
          {/* Col 1: Brand & Story */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <DiamondIcon sx={{ color: '#D4AF37', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '0.1em' }}>
                LUNA BELLE
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8, mb: 3, pr: { md: 4 } }}>
              Thương hiệu trang sức Moissanite và Vàng 18K cao cấp. Từng giác cắt được hoàn thiện tỉ mỉ bởi các nghệ nhân kim hoàn bậc thầy, khẳng định thần thái vương giả và thanh lịch của bạn.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PremiumIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: '#F3E5AB' }}>Kiểm định GIA 100%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ color: '#D4AF37', fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: '#F3E5AB' }}>Bảo hành trọn đời</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Col 2: Categories */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#F3E5AB', mb: 2 }}>
              DÒNG TRANG SỨC
            </Typography>
            <Stack spacing={1.2}>
              <MuiLink component={Link} to="/products?category=nhan-kim-cuong" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Nhẫn Kim Cương
              </MuiLink>
              <MuiLink component={Link} to="/products?category=day-chuyen-mat-day" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Dây Chuyền Quý Phái
              </MuiLink>
              <MuiLink component={Link} to="/products?category=vong-tay-lac" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Vòng Tay Tennis
              </MuiLink>
              <MuiLink component={Link} to="/products?category=bong-tai" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Bông Tai Nữ Hoàng
              </MuiLink>
              <MuiLink component={Link} to="/products?category=bo-suu-tap-hoang-gia" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                BST Hoàng Gia Đá Quý
              </MuiLink>
            </Stack>
          </Grid>

          {/* Col 3: Customer Care */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#F3E5AB', mb: 2 }}>
              HỖ TRỢ KHÁCH HÀNG
            </Typography>
            <Stack spacing={1.2}>
              <MuiLink component={Link} to="/order-tracking" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Tra Cứu Đơn Hàng
              </MuiLink>
              <MuiLink component={Link} to="/ai-consultant" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Tư Vấn Stylist AI
              </MuiLink>
              <MuiLink href="#" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Hướng Dẫn Đo Size Nhẫn
              </MuiLink>
              <MuiLink href="#" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Chính Sách Đổi Trả & Thu Đổi
              </MuiLink>
              <MuiLink href="#" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', '&:hover': { color: '#D4AF37' } }}>
                Kiểm Định Chất Lượng
              </MuiLink>
            </Stack>
          </Grid>

          {/* Col 4: Newsletter & Contact */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#F3E5AB', mb: 2 }}>
              KẾT NỐI VỚI LUNA BELLE
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
              Đăng ký để nhận thông tin ưu đãi đặc quyền và bộ sưu tập kim cương mới nhất.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Nhập email của bạn..."
                fullWidth
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  input: { color: '#FFFFFF', fontSize: '0.88rem' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' }
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#D4AF37',
                  color: '#2C1F20',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#F3E5AB' }
                }}
              >
                Gửi
              </Button>
            </Box>

            <Stack spacing={1} sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: '#D4AF37', fontSize: 18 }} />
                <span>Flagship: 88 Đồng Khởi, Bến Nghé, Quận 1, TP. HCM</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#D4AF37', fontSize: 18 }} />
                <span>Hotline VIP: 1900 8888 (8:30 - 21:30)</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#D4AF37', fontSize: 18 }} />
                <span>concierge@lunabelle.vn</span>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © {new Date().getFullYear()} LUNA BELLE ELITE JEWELRY. Mọi quyền được bảo lưu.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Hỗ trợ thanh toán: VNPay · Visa · Mastercard · Chuyển khoản · COD
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
