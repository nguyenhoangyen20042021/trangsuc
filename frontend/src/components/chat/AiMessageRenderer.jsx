import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  OpenInNew as OpenIcon,
  Diamond as DiamondIcon,
  LocalOffer as VoucherIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { LuxurySparkleIcon } from '../icons/ProductIcons';
import { getStoredProducts, formatCurrency } from '../../services/api';

/**
 * Helper to render inline markdown: **bold**, *italic*, `code`, and promo vouchers
 */
const renderInlineContent = (text, onCopyVoucher, copiedVoucher) => {
  if (!text) return null;

  // Pattern matches:
  // 1. **bold**
  // 2. [Link text](url)
  // 3. Voucher code like AURA2026
  const parts = [];
  let remaining = text;
  let keyIndex = 0;

  // Regex to split by bold or voucher
  const tokenRegex = /(\*\*[^*]+\*\*|AURA2026)/g;
  let match;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${keyIndex++}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    const token = match[0];
    if (token === 'AURA2026') {
      const isCopied = copiedVoucher === 'AURA2026';
      parts.push(
        <Tooltip key={`voucher-${keyIndex++}`} title={isCopied ? 'Đã sao chép!' : 'Bấm để chép mã voucher'}>
          <Chip
            size="small"
            icon={isCopied ? <CheckIcon sx={{ fontSize: '13px !important' }} /> : <VoucherIcon sx={{ fontSize: '13px !important' }} />}
            label="AURA2026"
            clickable
            onClick={(e) => {
              e.stopPropagation();
              onCopyVoucher('AURA2026');
            }}
            sx={{
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              color: '#8B6508',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              border: '1px dashed #D4AF37',
              mx: 0.5,
              height: 24,
              '&:hover': {
                bgcolor: 'rgba(212, 175, 55, 0.25)'
              }
            }}
          />
        </Tooltip>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      parts.push(
        <Box
          component="strong"
          key={`bold-${keyIndex++}`}
          sx={{
            fontWeight: 700,
            color: '#2C1F20'
          }}
        >
          {inner}
        </Box>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${keyIndex++}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts;
};

/**
 * Embedded Luxury Product Card rendered when AI recommends specific products
 */
const LuxuryAiProductItem = ({ productRef, fullProducts }) => {
  const { emoji, name, productId, price, description } = productRef;

  // Try to find full product details from stored catalog by ID or Name
  const found = fullProducts.find(
    (p) =>
      (productId && String(p.MaSanPham) === String(productId)) ||
      (name && p.TenSanPham && p.TenSanPham.toLowerCase().includes(name.toLowerCase().trim()))
  );

  const displayId = productId || (found && found.MaSanPham) || '';
  const displayName = (found && found.TenSanPham) || name;
  const displayImage =
    (found && found.HinhAnhChinh) ||
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800';
  const displayPrice = found
    ? formatCurrency(found.GiaMin || found.GiaCoSo || price)
    : price || 'Liên hệ LUNA BELLE';
  const displayMaterial = found ? found.ChatLieu : '';

  return (
    <Card
      elevation={0}
      sx={{
        my: 1.2,
        borderRadius: 3,
        border: '1px solid rgba(212, 175, 55, 0.25)',
        bgcolor: '#FFFDF9',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 16px rgba(44, 31, 32, 0.04)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.15)',
          borderColor: '#D4AF37'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 1.5, gap: 1.5, alignItems: { xs: 'stretch', sm: 'center' } }}>
        {/* Product Image Thumbnail */}
        <Box
          sx={{
            width: { xs: '100%', sm: 80 },
            height: { xs: 120, sm: 80 },
            borderRadius: 2,
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
            border: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <CardMedia
            component="img"
            image={displayImage}
            alt={displayName}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {emoji && (
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                bgcolor: 'rgba(255,255,255,0.92)',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {emoji}
            </Box>
          )}
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            {displayId && (
              <Chip
                label={`Mã SP: #${displayId}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(212, 175, 55, 0.12)',
                  color: '#8B6508'
                }}
              />
            )}
            {displayMaterial && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {displayMaterial}
              </Typography>
            )}
          </Stack>

          <Typography
            component={Link}
            to={displayId ? `/product/${displayId}` : '#'}
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#2C1F20',
              textDecoration: 'none',
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.98rem',
              display: 'block',
              lineHeight: 1.35,
              '&:hover': {
                color: '#B76E79',
                textDecoration: 'underline'
              }
            }}
          >
            {displayName}
          </Typography>

          {description && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', mt: 0.4, lineHeight: 1.45 }}>
              {description}
            </Typography>
          )}
        </Box>

        {/* Price & Action Button */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'space-between', flexShrink: 0, gap: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: '#B76E79',
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            {displayPrice}
          </Typography>

          {displayId && (
            <Button
              component={Link}
              to={`/product/${displayId}`}
              variant="outlined"
              size="small"
              endIcon={<OpenIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 20,
                fontSize: '0.78rem',
                textTransform: 'none',
                py: 0.4,
                px: 1.5,
                borderColor: '#D4AF37',
                color: '#8B6508',
                '&:hover': {
                  borderColor: '#B76E79',
                  bgcolor: 'rgba(183, 110, 121, 0.08)'
                }
              }}
            >
              Xem mẫu
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};

/**
 * Advisory callout block for notes, precautions, or specialized care
 */
const LuxuryAdvisoryBox = ({ text, onCopyVoucher, copiedVoucher }) => {
  return (
    <Box
      sx={{
        my: 1.5,
        p: 2,
        borderRadius: 2.5,
        bgcolor: 'rgba(212, 175, 55, 0.07)',
        border: '1px solid rgba(212, 175, 55, 0.28)',
        borderLeft: '4px solid #D4AF37',
        position: 'relative'
      }}
    >
      <Stack direction="row" spacing={1.2} sx={{ alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'rgba(212, 175, 55, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B6508',
            flexShrink: 0,
            mt: 0.2
          }}
        >
          <InfoIcon sx={{ fontSize: 17 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#8B6508', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', mb: 0.4 }}>
            Lời Khuyên Từ Chuyên Gia Kim Hoàn
          </Typography>
          <Typography variant="body2" sx={{ color: '#2C1F20', lineHeight: 1.65, fontSize: '0.91rem' }}>
            {renderInlineContent(text, onCopyVoucher, copiedVoucher)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

/**
 * VIP Privileges & Vouchers banner
 */
const LuxuryVipOfferBox = ({ text, onCopyVoucher, copiedVoucher }) => {
  return (
    <Box
      sx={{
        my: 1.5,
        p: 2,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(183, 110, 121, 0.1) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        position: 'relative'
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#D4AF37',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.35)'
          }}
        >
          👑
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#8B6508', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.4 }}>
            Đặc Quyền Khách Hàng VIP LUNA BELLE
          </Typography>
          <Typography variant="body2" sx={{ color: '#2C1F20', lineHeight: 1.65, fontSize: '0.91rem' }}>
            {renderInlineContent(text, onCopyVoucher, copiedVoucher)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

/**
 * Main AI Message Box Renderer
 */
export const AiMessageRenderer = ({
  message,
  onAddToCart,
  compact = false
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(null);

  const fullProducts = getStoredProducts();
  const rawText = message?.text || '';

  const handleCopyAll = () => {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000);
  };

  // Parse lines and paragraphs
  const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: compact ? 3 : 3.5,
        borderTopLeftRadius: 4,
        p: { xs: 2, sm: compact ? 2 : 2.8 },
        bgcolor: '#FFFFFF',
        color: '#2C1F20',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        boxShadow: '0 8px 30px rgba(44, 31, 32, 0.05)',
        position: 'relative',
        maxWidth: '100%',
        lineHeight: 1.7
      }}
    >
      {/* Stylist Header Badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8, pb: 1.2, borderBottom: '1px solid rgba(212, 175, 55, 0.12)' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#2E7D32',
              boxShadow: '0 0 6px rgba(46, 125, 50, 0.6)'
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#2C1F20',
              fontSize: '0.85rem'
            }}
          >
            LUNA BELLE Stylist
          </Typography>
          <Chip
            size="small"
            label="Chuyên Gia AI"
            sx={{
              height: 18,
              fontSize: '0.68rem',
              fontWeight: 700,
              bgcolor: 'rgba(212, 175, 55, 0.12)',
              color: '#8B6508'
            }}
          />
        </Stack>

        <Tooltip title={copiedAll ? 'Đã sao chép nội dung!' : 'Sao chép câu trả lời'}>
          <IconButton
            size="small"
            onClick={handleCopyAll}
            sx={{
              color: copiedAll ? '#2E7D32' : 'text.secondary',
              p: 0.5,
              '&:hover': { color: '#D4AF37', bgcolor: 'rgba(212, 175, 55, 0.08)' }
            }}
          >
            {copiedAll ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Structured Content Area */}
      <Box sx={{ fontSize: compact ? '0.88rem' : '0.94rem' }}>
        {paragraphs.map((para, pIdx) => {
          // Check for bullet list block
          const lines = para.split('\n').map(l => l.trim()).filter(Boolean);
          const isBulletList = lines.length > 0 && lines.every(l => /^[-*•]\s+/.test(l) || /^\d+\.\s+/.test(l));

          if (isBulletList) {
            return (
              <Stack key={`para-${pIdx}`} spacing={1} sx={{ my: 1.5 }}>
                {lines.map((line, lIdx) => {
                  // Check if line matches product recommendation pattern:
                  // e.g. - 💍 **[Lắc Tay Bạc Ý S925 Tinh Khôi Sparkling Wish]** (Mã SP: 8) – Bạc Ý... giá từ 1.250.000 ₫
                  const cleanLine = line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
                  const productMatch = cleanLine.match(/^([^\s\w\d\[*]*)\s*(?:\*\*)?\[?([^\]*]+)\]?(?:\*\*)?\s*(?:\(Mã SP:\s*(\d+)\))?\s*[–—-]\s*(.*)$/i);

                  if (productMatch) {
                    const emoji = productMatch[1]?.trim();
                    const name = productMatch[2]?.trim();
                    const productId = productMatch[3]?.trim();
                    const rest = productMatch[4]?.trim();

                    // Extract price if available in rest
                    const priceMatch = rest?.match(/(?:giá từ|giá:?)\s*([\d\.\,]+\s*[₫đ])/i);
                    const price = priceMatch ? priceMatch[1] : '';

                    return (
                      <LuxuryAiProductItem
                        key={`prod-${pIdx}-${lIdx}`}
                        productRef={{
                          emoji,
                          name,
                          productId,
                          price,
                          description: rest
                        }}
                        fullProducts={fullProducts}
                      />
                    );
                  }

                  // Standard Bullet Item with Diamond Icon
                  return (
                    <Box
                      key={`bullet-${pIdx}-${lIdx}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.2,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(212, 175, 55, 0.04)',
                        border: '1px solid rgba(212, 175, 55, 0.12)'
                      }}
                    >
                      <Box sx={{ color: '#D4AF37', mt: 0.3, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <DiamondIcon sx={{ fontSize: 13 }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#2C1F20', lineHeight: 1.6, fontSize: compact ? '0.86rem' : '0.91rem' }}>
                        {renderInlineContent(cleanLine, handleCopyVoucher, copiedVoucher)}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            );
          }

          // Check if paragraph is VIP Offer / Voucher
          const isVipOffer = para.includes('AURA2026') || (para.toLowerCase().includes('ưu đãi:') && para.toLowerCase().includes('miễn phí vận chuyển'));
          if (isVipOffer) {
            return (
              <LuxuryVipOfferBox
                key={`para-${pIdx}`}
                text={para}
                onCopyVoucher={handleCopyVoucher}
                copiedVoucher={copiedVoucher}
              />
            );
          }

          // Check if paragraph is Advisory / Safety Warning
          const lower = para.toLowerCase();
          const isAdvisory =
            lower.includes('khuyến nghị') ||
            lower.includes('tuyệt đối không') ||
            lower.includes('an toàn tuyệt đối') ||
            lower.includes('vướng víu') ||
            lower.includes('nguy hiểm') ||
            para.includes('🐾') ||
            para.includes('⚠️');

          if (isAdvisory) {
            return (
              <LuxuryAdvisoryBox
                key={`para-${pIdx}`}
                text={para}
                onCopyVoucher={handleCopyVoucher}
                copiedVoucher={copiedVoucher}
              />
            );
          }

          // Standard paragraph
          return (
            <Typography
              key={`para-${pIdx}`}
              variant="body2"
              sx={{
                mb: 1.3,
                lineHeight: 1.75,
                color: '#2C1F20',
                fontSize: compact ? '0.88rem' : '0.93rem',
                '&:last-child': { mb: 0 }
              }}
            >
              {renderInlineContent(para, handleCopyVoucher, copiedVoucher)}
            </Typography>
          );
        })}
      </Box>

      {/* Footer Meta Note */}
      <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.74rem', fontStyle: 'italic' }}>
          ✨ LUNA BELLE AI Jewelry Stylist • Tiêu chuẩn giám định GIA quốc tế
        </Typography>

        {message?.model && (
          <Chip
            size="small"
            label={message.model}
            sx={{
              height: 18,
              fontSize: '0.68rem',
              bgcolor: 'rgba(0,0,0,0.04)',
              color: 'text.secondary'
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

