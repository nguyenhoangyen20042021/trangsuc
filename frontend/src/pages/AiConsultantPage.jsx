import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
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
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import {
  LuxurySparkleIcon,
  LuxuryUserIcon,
  LuxuryBagIcon,
  AllJewelryProductIcon
} from '../components/icons/ProductIcons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, getStoredProducts, formatCurrency } from '../services/api';

const QUICK_PROMPTS = [
  'Tư vấn nhẫn cầu hôn dưới 30 triệu tinh xảo',
  'Gợi ý trang sức phong thủy cho người mệnh Kim',
  'Dây chuyền dạ hội lộng lẫy phối đầm dạ tiệc',
  'Nhẫn cưới vàng 18K phong cách hoàng gia tinh tế'
];

export const AiConsultantPage = () => {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Kính chào Quý khách! Tôi là AI Stylist – Chuyên gia tư vấn trang sức cao cấp của LUNA BELLE. Tôi có thể hỗ trợ Quý khách chọn mẫu nhẫn đính hôn, trang sức dự tiệc, hoặc gợi ý đá quý hợp bản mệnh và ngân sách. Quý khách đang tìm kiếm phong cách trang sức nào hôm nay?',
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Only scroll internal chat box when user/AI sends a new message; never scroll window on mount
    if (messages.length > 1 && chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI consultation logic
    setTimeout(() => {
      const allProducts = getStoredProducts();
      let aiResponse = '';
      let recommended = [];

      const q = query.toLowerCase();
      if (q.includes('cầu hôn') || q.includes('dưới 30') || q.includes('nhẫn')) {
        aiResponse = 'Dựa trên mong muốn của Quý khách, tôi xin trân trọng đề xuất tuyệt phẩm **Nhẫn Kim Cương Solitaire Eternal Grace**. Mẫu nhẫn được đúc từ Vàng Trắng 18K với viên kim cương chuẩn GIA 4.5 ly nước F, độ sạch VVS1 trên chấu 6 trấu thanh thoát biểu tượng cho tình yêu vĩnh cửu. Đây là sự lựa chọn hoàn hảo nhất trong tầm giá dưới 30 triệu đồng!';
        recommended = [allProducts[0], allProducts[5] || allProducts[0]];
      } else if (q.includes('mệnh kim') || q.includes('phong thủy')) {
        aiResponse = 'Theo thuyết ngũ hành tương sinh, người mệnh Kim rất hợp với ánh sáng lấp lánh của Kim Cương tự nhiên, Vàng Trắng 750 (18K) hoặc Ngọc Trai biển South Sea ánh bạc. Những gam màu trắng sáng và ánh kim này sẽ kích hoạt cung tài lộc, mang đến vượng khí và may mắn cho chủ nhân!';
        recommended = [allProducts[0], allProducts[3] || allProducts[0]];
      } else if (q.includes('dạ tiệc') || q.includes('dây chuyền') || q.includes('đầm')) {
        aiResponse = 'Để tỏa sáng quý phái trong các buổi tiệc đêm sang trọng, **Dây Chuyền Mặt Tim Royal Romance Moissanite** phối cùng **Vòng Tay Tennis Diamond** là bộ đôi hoàn hảo. Ánh lửa rực rỡ từ giác cắt chuẩn quốc tế sẽ thu hút trọn vẹn mọi ánh nhìn dưới ánh đèn pha lê tiệc tối!';
        recommended = [allProducts[1] || allProducts[0], allProducts[2] || allProducts[0]];
      } else {
        aiResponse = `LUNA BELLE hân hạnh gợi ý cho Quý khách những kiệt tác kim hoàn đang được các quý cô và quý ông thượng lưu yêu thích nhất mùa này. Quý khách có thể xem chi tiết từng mẫu hoặc yêu cầu tư vấn kỹ hơn về size nhẫn và phương án khắc laser kỷ niệm nhé!`;
        recommended = [allProducts[0], allProducts[2] || allProducts[0], allProducts[4] || allProducts[0]];
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
    }, 1000);
  };

  return (
    <Box sx={{ py: 4, pb: 12 }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            icon={<LuxurySparkleIcon sx={{ color: '#D4AF37 !important', fontSize: 18 }} />}
            label="LUNA BELLE DEEPSEEK AI STYLIST"
            sx={{
              bgcolor: 'rgba(212, 175, 55, 0.12)',
              color: 'primary.dark',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              mb: 1.5
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}
          >
            Chuyên Gia Tư Vấn Kim Hoàn AI
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', mt: 1 }}>
            Hỏi bất kỳ điều gì về chọn kích thước kim cương, nhẫn cầu hôn, phối trang phục dạ tiệc hay phong thủy tài lộc.
          </Typography>
        </Box>

        {/* Chat Container */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(183, 110, 121, 0.2)',
            bgcolor: '#FFFFFF',
            boxShadow: '0 10px 40px rgba(183, 110, 121, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '75vh',
            minHeight: 540
          }}
        >
          {/* Messages Area */}
          <Box ref={chatBoxRef} sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, overflowY: 'auto', bgcolor: '#FFFBF9' }}>
            <Stack spacing={3}>
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: isAi ? 'row' : 'row-reverse',
                      alignItems: 'flex-start',
                      gap: 1.5
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: isAi ? 'primary.main' : '#2C1F20',
                        color: isAi ? '#FFFFFF' : '#D4AF37',
                        border: '2px solid rgba(212, 175, 55, 0.3)'
                      }}
                    >
                      {isAi ? <LuxurySparkleIcon sx={{ fontSize: 20 }} /> : <LuxuryUserIcon sx={{ fontSize: 20 }} />}
                    </Avatar>

                    <Box sx={{ maxWidth: { xs: '85%', sm: '75%' } }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.2,
                          borderRadius: 3,
                          bgcolor: isAi ? '#FFFFFF' : 'primary.main',
                          color: isAi ? 'text.primary' : '#FFFFFF',
                          border: isAi ? '1px solid rgba(183, 110, 121, 0.15)' : 'none',
                          boxShadow: isAi ? '0 4px 16px rgba(183,110,121,0.06)' : 'none',
                          lineHeight: 1.7,
                          fontSize: '0.94rem'
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.92rem' }}>
                          {msg.text}
                        </Typography>
                      </Paper>

                      {/* Attached Product Recommendations */}
                      {msg.products && msg.products.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                            <LuxurySparkleIcon sx={{ fontSize: 16, color: 'primary.dark' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark', letterSpacing: '0.05em' }}>
                              GỢI Ý TUYỆT PHẨM DÀNH RIÊNG CHO BẠN:
                            </Typography>
                          </Box>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            {msg.products.map((prod) => (
                              <Card
                                key={prod.MaSanPham}
                                sx={{
                                  display: 'flex',
                                  width: { xs: '100%', sm: 260 },
                                  borderRadius: 3,
                                  border: '1px solid rgba(183,110,121,0.2)',
                                  overflow: 'hidden'
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  sx={{ width: 85, height: '100%', objectFit: 'cover' }}
                                  image={prod.HinhAnhChinh}
                                  alt={prod.TenSanPham}
                                />
                                <CardContent sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                  <Typography
                                    component={Link}
                                    to={`/product/${prod.Slug || prod.MaSanPham}`}
                                    variant="caption"
                                    sx={{
                                      fontWeight: 700,
                                      color: 'text.primary',
                                      textDecoration: 'none',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      lineHeight: 1.3
                                    }}
                                  >
                                    {prod.TenSanPham}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 700, mt: 0.5, display: 'block' }}>
                                    {formatCurrency(prod.GiaMin || prod.GiaCoSo)}
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => addToCart(prod, prod.bienthe ? prod.bienthe[0] : null, 1)}
                                    startIcon={<LuxuryBagIcon sx={{ fontSize: 14 }} />}
                                    sx={{ mt: 'auto', pt: 0.2, pb: 0.2, fontSize: '0.7rem', borderRadius: 12 }}
                                  >
                                    Chọn mua
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', color: '#FFFFFF' }}>
                    <LuxurySparkleIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(183,110,121,0.15)' }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <CircularProgress size={18} color="primary" />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
                        AI Stylist đang phân tích thông số giác cắt và tìm kiếm kiệt tác phù hợp...
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Quick Prompt Suggestions */}
          <Box sx={{ px: 2, py: 1.2, borderTop: '1px solid rgba(183,110,121,0.1)', bgcolor: '#FFFFFF' }}>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
              {QUICK_PROMPTS.map((prompt) => (
                <Chip
                  key={prompt}
                  label={prompt}
                  onClick={() => handleSend(prompt)}
                  clickable
                  size="small"
                  sx={{
                    bgcolor: 'rgba(183,110,121,0.08)',
                    color: 'text.primary',
                    fontSize: '0.78rem',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: 'rgba(183,110,121,0.18)' }
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Input Box Bottom */}
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            sx={{
              p: 2,
              borderTop: '1px solid rgba(183,110,121,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: '#FFFFFF'
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập câu hỏi của bạn (Ví dụ: Tìm nhẫn vàng 18K giá 20 triệu cho bạn gái)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 30 }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !input.trim()}
              endIcon={<SendIcon />}
              sx={{
                borderRadius: 30,
                px: 3,
                py: 1,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(183,110,121,0.25)'
              }}
            >
              Gửi
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
