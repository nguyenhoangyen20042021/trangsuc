import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Rating
} from '@mui/material';
import {
  ShoppingBag as AddCartIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../services/api';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.bienthe && product.bienthe.length > 0 ? product.bienthe[0] : null;
    addToCart(product, defaultVariant, 1);
  };

  return (
    <Card
      component={Link}
      to={`/product/${product.Slug || product.MaSanPham}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        position: 'relative',
        borderRadius: 3,
        border: '1px solid rgba(197, 168, 128, 0.18)',
        bgcolor: '#FFFFFF',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 18px 40px rgba(183, 110, 121, 0.12)',
          borderColor: 'rgba(183, 110, 121, 0.4)',
          '& .product-img': {
            transform: 'scale(1.05)'
          },
          '& .quick-add-btn': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      {/* Luxury Minimalist Badge */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
        {product.LaNoiBat === 1 && (
          <Chip
            label="GIA SELECTED"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#8B3A48',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              backdropFilter: 'blur(6px)',
              height: 22
            }}
          />
        )}
        {product.TongBan > 20 && !product.LaNoiBat && (
          <Chip
            label="BESTSELLER"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#B76E79',
              border: '1px solid rgba(183, 110, 121, 0.3)',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              height: 22
            }}
          />
        )}
      </Box>

      {/* Image Media Box */}
      <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#FAF8F5' }}>
        <CardMedia
          component="img"
          className="product-img"
          image={product.HinhAnhChinh || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'}
          alt={product.TenSanPham}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        {/* Minimalist Floating Quick Add */}
        <Box
          className="quick-add-btn"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            opacity: { xs: 1, md: 0 },
            transform: { xs: 'none', md: 'translateY(8px)' },
            transition: 'all 0.3s ease',
            zIndex: 3
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={handleQuickAdd}
            startIcon={<AddCartIcon sx={{ fontSize: 16 }} />}
            sx={{
              py: { xs: 0.6, sm: 0.9 },
              px: { xs: 1, sm: 2 },
              fontSize: { xs: '0.72rem', sm: '0.8rem' },
              whiteSpace: 'nowrap',
              fontWeight: 700,
              borderRadius: 30,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#2C1F20',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              '&:hover': {
                bgcolor: '#B76E79',
                color: '#FFFFFF',
                borderColor: '#B76E79'
              }
            }}
          >
            Thêm vào giỏ
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#B76E79',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.68rem',
            mb: 0.6
          }}
        >
          {product.TenDanhMuc || 'Trang Sức Cao Cấp'}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: '#2C1F20',
            fontSize: '0.98rem',
            lineHeight: 1.35,
            mb: 0.8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.7rem'
          }}
        >
          {product.TenSanPham}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <Rating value={5} readOnly size="small" sx={{ fontSize: '0.78rem', color: '#D4AF37' }} />
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>
            ({product.TongBan || 18} lượt mua)
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#8B3A48',
              fontWeight: 700,
              fontSize: '1.08rem',
              letterSpacing: '-0.01em'
            }}
          >
            {formatCurrency(product.GiaMin || product.GiaCoSo)}
          </Typography>

          {product.GiaMax && product.GiaMax > (product.GiaMin || product.GiaCoSo) && (
            <Typography variant="caption" sx={{ color: 'text.disabled', textDecoration: 'line-through', fontSize: '0.8rem' }}>
              {formatCurrency(product.GiaMax)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
