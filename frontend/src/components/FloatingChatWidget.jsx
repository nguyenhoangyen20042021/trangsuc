import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Avatar,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Badge,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import {
  LuxurySparkleIcon as RobotIcon,
  LuxurySparkleIcon as SparkleIcon,
  LuxuryBagIcon as CartIcon
} from './icons/ProductIcons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, formatCurrency } from '../services/api';

const QUICK_QUESTIONS = [
  'Nhẫn kim cầu hôn dưới 30tr',
  'Trang sức hợp mệnh Kim',
  'Dây chuyền dạ hội sang trọng'
];

export const FloatingChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const { addToCart } = useCart();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Chào Quý khách! Tôi là trợ lý AI Stylist của LUNA BELLE. Quý khách cần tư vấn chọn trang sức hay tìm quà tặng phù hợp không ạ?',
      products: [MOCK_PRODUCTS[0]]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (open) {
      setHasNewMessage(false);
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [open, messages, loading]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiResponse = '';
      let recommended = [];

      const q = query.toLowerCase();
      if (q.includes('cầu hôn') || q.includes('dưới 30') || q.includes('nhẫn')) {
        aiResponse = 'Mẫu nhẫn **Solitaire Eternal Grace** (Vàng Trắng 18K & Kim cương GIA 4.5 ly) giá 28.500.000₫ đang là kiệt tác cầu hôn số 1 được ưa chuộng nhất!';
        recommended = [MOCK_PRODUCTS[0]];
      } else if (q.includes('mệnh kim') || q.includes('phong thủy')) {
        aiResponse = 'Mệnh Kim rất tương hợp với sắc trắng sáng của Kim cương và Vàng trắng hoặc ánh vàng kim Nam Hải của Ngọc trai South Sea!';
        recommended = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3]];
      } else if (q.includes('dây chuyền') || q.includes('dạ hội')) {
        aiResponse = 'Dây chuyền mặt tim Moissanite nước D kết hợp cùng Vòng tay Tennis Bạch kim sẽ tôn vinh trọn vẹn nét quý phái của bạn!';
        recommended = [MOCK_PRODUCTS[1]];
      } else {
        aiResponse = 'LUNA BELLE có đầy đủ các bộ sưu tập kim cương thiên nhiên kiểm định GIA và Moissanite cao cấp. Bạn có thể xem ngay gợi ý bên dưới hoặc mở trang Tư vấn AI chi tiết nhé!';
        recommended = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponse,
          products: recommended
        }
      ]);
      setLoading(false);
    }, 700);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 28, right: 28, zIndex: 1300 }}>
      {/* Floating Chat Popup Card */}
      <Collapse in={open}>
        <Paper
          elevation={8}
          sx={{
            width: { xs: 330, sm: 380 },
            height: 520,
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            mb: 2,
            border: '1px solid rgba(183, 110, 121, 0.25)',
            boxShadow: '0 16px 40px rgba(183, 110, 121, 0.25)',
            bgcolor: '#FFFFFF'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #8B3A48 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                <RobotIcon sx={{ color: '#F3E5AB', fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  AI Jewelry Stylist
                </Typography>
                <Typography variant="caption" sx={{ color: '#F3E5AB', fontSize: '0.7rem' }}>
                  ● Đang trực tuyến · Tư vấn 24/7
                </Typography>
              </Box>
            </Box>

            <Box>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#FFFFFF' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Body */}
          <Box ref={chatBoxRef} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#FFFBF9' }}>
            <Stack spacing={2}>
              {messages.map((m) => {
                const isAi = m.sender === 'ai';
                return (
                  <Box
                    key={m.id}
                    sx={{
                      display: 'flex',
                      flexDirection: isAi ? 'row' : 'row-reverse',
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                  >
                    {isAi && (
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 14 }}>
                        <RobotIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    )}

                    <Box sx={{ maxWidth: '82%' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: isAi ? '#FFFFFF' : 'primary.main',
                          color: isAi ? 'text.primary' : '#FFFFFF',
                          border: isAi ? '1px solid rgba(183,110,121,0.15)' : 'none',
                          boxShadow: isAi ? '0 2px 8px rgba(183,110,121,0.06)' : 'none',
                          fontSize: '0.86rem',
                          lineHeight: 1.5
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.86rem' }}>
                          {m.text}
                        </Typography>
                      </Paper>

                      {/* Product mini cards */}
                      {m.products && m.products.length > 0 && (
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {m.products.map(p => (
                            <Card
                              key={p.MaSanPham}
                              sx={{
                                display: 'flex',
                                p: 1,
                                gap: 1,
                                borderRadius: 2,
                                border: '1px solid rgba(183,110,121,0.2)',
                                bgcolor: '#FFFFFF'
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={p.HinhAnhChinh}
                                alt={p.TenSanPham}
                                sx={{ width: 50, height: 50, borderRadius: 1.5, objectFit: 'cover' }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  component={Link}
                                  to={`/product/${p.Slug || p.MaSanPham}`}
                                  variant="caption"
                                  sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2, color: 'text.primary', textDecoration: 'none' }}
                                >
                                  {p.TenSanPham}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 700 }}>
                                  {formatCurrency(p.GiaMin || p.GiaCoSo)}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => addToCart(p, p.bienthe ? p.bienthe[0] : null, 1)}
                                    startIcon={<CartIcon sx={{ fontSize: 12 }} />}
                                    sx={{ py: 0.2, px: 1, fontSize: '0.68rem', borderRadius: 10 }}
                                  >
                                    Thêm giỏ
                                  </Button>
                                </Box>
                              </Box>
                            </Card>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                    <RobotIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Paper sx={{ p: 1.2, borderRadius: 2, bgcolor: '#FFFFFF', border: '1px solid rgba(183,110,121,0.15)' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <CircularProgress size={14} color="primary" />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        AI Stylist đang soạn câu trả lời...
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Quick chips */}
          <Box sx={{ px: 1.5, py: 1, bgcolor: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Stack direction="row" spacing={0.8} sx={{ overflowX: 'auto', pb: 0.2 }}>
              {QUICK_QUESTIONS.map(q => (
                <Chip
                  key={q}
                  label={q}
                  size="small"
                  onClick={() => handleSend(q)}
                  clickable
                  sx={{ fontSize: '0.72rem', bgcolor: 'rgba(183,110,121,0.08)' }}
                />
              ))}
            </Stack>
          </Box>

          {/* Footer Input */}
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            sx={{
              p: 1.5,
              borderTop: '1px solid rgba(183,110,121,0.15)',
              display: 'flex',
              gap: 1,
              bgcolor: '#FFFFFF'
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Hỏi AI chọn size, mệnh, phong cách..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 20, fontSize: '0.84rem' } }}
            />
            <IconButton type="submit" color="primary" disabled={loading || !input.trim()}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      {/* Luxury AI Stylist Dock Pill Button */}
      <Paper
        elevation={open ? 2 : 6}
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          px: { xs: 1.8, sm: 2.2 },
          py: 0.9,
          borderRadius: 30,
          bgcolor: open ? '#8B3A48' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid',
          borderColor: open ? '#8B3A48' : 'rgba(212, 175, 55, 0.45)',
          boxShadow: '0 8px 30px rgba(139, 58, 72, 0.18)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          userSelect: 'none',
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: '#D4AF37',
            boxShadow: '0 12px 36px rgba(139, 58, 72, 0.28)'
          }
        }}
      >
        {/* Avatar with pulsing online dot */}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: open
                ? 'rgba(255, 255, 255, 0.2)'
                : 'linear-gradient(135deg, #C9956C 0%, #B76E79 40%, #8B3A48 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 55, 0.4)'
            }}
          >
            {open ? <CloseIcon sx={{ fontSize: 18 }} /> : <RobotIcon sx={{ fontSize: 20, color: '#F3E5AB' }} />}
          </Avatar>
          {!open && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#4caf50',
                border: '2px solid #FFFFFF'
              }}
            />
          )}
        </Box>

        {/* Text Pill Info */}
        <Box sx={{ textAlign: 'left', display: { xs: open ? 'none' : 'block', sm: 'block' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.86rem',
                color: open ? '#FFFFFF' : '#2C1F20',
                letterSpacing: '0.02em',
                lineHeight: 1.2
              }}
            >
              AI Stylist Tư Vấn
            </Typography>
            <SparkleIcon sx={{ fontSize: 13, color: '#D4AF37' }} />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: open ? '#F3E5AB' : '#B76E79',
              fontSize: '0.7rem',
              fontWeight: 600,
              display: 'block'
            }}
          >
            {open ? 'Nhấn để thu gọn' : '● Trực tuyến · Tư vấn 24/7'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
