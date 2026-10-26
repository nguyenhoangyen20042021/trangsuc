import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Slider,
  MenuItem,
  Stack,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  SmartToy as AiIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const AdminAiSettingsPage = () => {
  const { notify } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: 'sk-deepseek-luna-belle-live-key-998877',
    model: 'deepseek-chat',
    confidenceThreshold: 0.38,
    systemPrompt: `Bạn là AI Jewelry Stylist cao cấp độc quyền của thương hiệu trang sức kim hoàn LUNA BELLE.
Nhiệm vụ của bạn là tư vấn tận tâm, thanh lịch, am hiểu sâu về:
1. Giác cắt kim cương chuẩn kiểm định GIA quốc tế.
2. Trang sức vàng 18K, bạch kim Pt950, Moissanite nước D.
3. Phong thủy bản mệnh (Kim, Mộc, Thủy, Hỏa, Thổ) tương sinh chiêu tài.
4. Gợi ý nhẫn cầu hôn, nhẫn cưới đôi, dây chuyền dạ hội tiệc cưới.
Luôn giữ giọng điệu lịch thiệp, sang trọng, xưng "Tôi" hoặc "LUNA BELLE" và gọi khách hàng là "Quý khách".`
  });

  const handleSave = (e) => {
    e.preventDefault();
    notify('Đã lưu cấu hình AI DeepSeek Stylist thành công!', 'success');
  };

  const handleResetDefault = () => {
    setFormData({
      apiKey: 'sk-deepseek-luna-belle-live-key-998877',
      model: 'deepseek-chat',
      confidenceThreshold: 0.38,
      systemPrompt: `Bạn là AI Jewelry Stylist cao cấp độc quyền của thương hiệu trang sức kim hoàn LUNA BELLE.`
    });
    notify('Đã khôi phục cài đặt AI mặc định!', 'info');
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
          Cấu Hình Chuyên Gia AI Stylist (DeepSeek)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Điều chỉnh tham số Machine Learning (Logistic Regression) và mô hình DeepSeek LLM tư vấn trang sức.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Mô hình lai kết hợp: <strong>Logistic Regression</strong> (phân loại ý định siêu tốc) và <strong>DeepSeek LLM API</strong> (tư vấn chuyên sâu câu hỏi mở).
              </Alert>
            </Grid>

            {/* API Key */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                required
                fullWidth
                label="DeepSeek API Key"
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="button" onClick={() => setShowApiKey(!showApiKey)} edge="end">
                          {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Model Select */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Mô hình LLM kích hoạt"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              >
                <MenuItem value="deepseek-chat">deepseek-chat (Tối ưu phản hồi nhanh & tự nhiên)</MenuItem>
                <MenuItem value="deepseek-reasoner">deepseek-reasoner (Suy luận chuyên sâu R1)</MenuItem>
                <MenuItem value="deepseek-coder">deepseek-coder (Thử nghiệm)</MenuItem>
              </TextField>
            </Grid>

            {/* Confidence Slider */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Ngưỡng Tin Cậy Phân Loại Intent (Confidence Threshold): {formData.confidenceThreshold}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Khi độ tự tin &ge; {formData.confidenceThreshold}, hệ thống kích hoạt Form kịch bản sẵn. Nếu thấp hơn sẽ gọi DeepSeek LLM.
              </Typography>
              <Slider
                value={formData.confidenceThreshold}
                min={0.1}
                max={0.9}
                step={0.02}
                valueLabelDisplay="auto"
                color="primary"
                onChange={(e, val) => setFormData({ ...formData, confidenceThreshold: val })}
                sx={{ maxWidth: 500 }}
              />
            </Grid>

            {/* System Prompt */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                multiline
                rows={7}
                label="System Prompt (Kịch bản tính cách chuyên gia kim hoàn)"
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{ borderRadius: 20, px: 4, fontWeight: 700 }}
                >
                  Lưu Cấu Hình AI
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResetDefault}
                  startIcon={<ResetIcon />}
                  sx={{ borderRadius: 20, px: 3 }}
                >
                  Mặc Định
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
