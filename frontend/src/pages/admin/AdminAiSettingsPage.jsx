import React, { useState, useEffect } from 'react';
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
  IconButton,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  SmartToy as AiIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as ResetIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import {
  fetchAiSettings,
  saveAiSettings,
  testAiConnection,
  DEFAULT_AI_PROMPT
} from '../../services/api';

export const AdminAiSettingsPage = () => {
  const { notify } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [formData, setFormData] = useState({
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    confidenceThreshold: 0.38,
    systemPrompt: DEFAULT_AI_PROMPT
  });

  // Tải cấu hình từ backend API khi mở trang
  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        setLoading(true);
        const cfg = await fetchAiSettings();
        if (isMounted && cfg) {
          setFormData({
            apiKey: cfg.apiKey || '',
            baseUrl: cfg.baseUrl || 'https://api.deepseek.com',
            model: cfg.model || 'deepseek-chat',
            confidenceThreshold: typeof cfg.confidenceThreshold === 'number' ? cfg.confidenceThreshold : 0.38,
            systemPrompt: cfg.systemPrompt || DEFAULT_AI_PROMPT
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải cấu hình AI:', err);
        notify('Không thể tải cấu hình AI từ máy chủ, đang dùng cấu hình cục bộ.', 'warning');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý lưu cấu hình xuống backend
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setTestResult(null);

    try {
      const res = await saveAiSettings(formData);
      if (res?.success) {
        notify(res.message || 'Đã lưu cấu hình AI DeepSeek Stylist thành công!', 'success');
      } else {
        notify(res?.message || 'Có lỗi khi lưu cấu hình', 'error');
      }
    } catch (err) {
      console.error('Lỗi lưu cấu hình AI:', err);
      notify(err.message || 'Lỗi khi lưu cấu hình AI Stylist', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Kiểm tra kết nối tới DeepSeek API
  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await testAiConnection({
        apiKey: formData.apiKey,
        baseUrl: formData.baseUrl,
        model: formData.model
      });
      setTestResult(res);

      if (res?.success && res.is_live_ai) {
        notify(`Kết nối DeepSeek API thành công! Phản hồi sau ${res.latency_ms}ms`, 'success');
      } else if (res?.status === 'simulator') {
        notify('Chưa có API Key: Đang kích hoạt chế độ Giả lập nội bộ (Local Simulator).', 'info');
      } else {
        notify(res?.message || 'Kiểm tra kết nối không thành công', 'warning');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Không thể kết nối đến máy chủ AI';
      setTestResult({
        success: false,
        status: 'error',
        message: errorMsg
      });
      notify('Lỗi kiểm tra kết nối: ' + errorMsg, 'error');
    } finally {
      setTesting(false);
    }
  };

  // Khôi phục cài đặt mặc định
  const handleResetDefault = () => {
    setFormData(prev => ({
      ...prev,
      baseUrl: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      confidenceThreshold: 0.38,
      systemPrompt: DEFAULT_AI_PROMPT
    }));
    setTestResult(null);
    notify('Đã khôi phục các tham số AI về mặc định (nhấn "Lưu Cấu Hình AI" để áp dụng)!', 'info');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
        <CircularProgress size={44} color="primary" />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Đang tải thông số cấu hình AI Stylist...
        </Typography>
      </Box>
    );
  }

  const hasKey = Boolean(formData.apiKey && formData.apiKey.trim().length > 0);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Cấu Hình Chuyên Gia AI Stylist (DeepSeek)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Điều chỉnh tham số Machine Learning (Logistic Regression) và mô hình DeepSeek LLM tư vấn trang sức.
          </Typography>
        </Box>

        <Chip
          icon={hasKey ? <CheckIcon sx={{ fontSize: 18 }} /> : <AiIcon sx={{ fontSize: 18 }} />}
          label={hasKey ? 'DeepSeek API: Đã Kích Hoạt' : 'Chế Độ Giả Lập Local (Chưa có API Key)'}
          color={hasKey ? 'success' : 'default'}
          variant={hasKey ? 'filled' : 'outlined'}
          sx={{ fontWeight: 600, py: 0.5 }}
        />
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            {/* System Info Banner */}
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Mô hình lai kết hợp: <strong>Logistic Regression</strong> (phân loại ý định siêu tốc với độ trễ &lt;10ms) và <strong>DeepSeek LLM API</strong> (tư vấn cá nhân hóa chuyên sâu các câu hỏi mở).
              </Alert>
            </Grid>

            {/* Test Result Alert (if any) */}
            {testResult && (
              <Grid size={{ xs: 12 }}>
                <Alert
                  severity={testResult.success ? (testResult.is_live_ai ? 'success' : 'info') : 'error'}
                  sx={{ borderRadius: 2 }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {testResult.success
                      ? (testResult.is_live_ai ? '✅ Kết Nối DeepSeek API Thành Công!' : 'ℹ️ Chế Độ Giả Lập (Local Simulator)')
                      : '❌ Lỗi Kết Nối DeepSeek API'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {testResult.message}
                  </Typography>
                  {testResult.latency_ms != null && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.85 }}>
                      Độ trễ phản hồi (Latency): <strong>{testResult.latency_ms} ms</strong> | Model: <strong>{testResult.model}</strong>
                    </Typography>
                  )}
                </Alert>
              </Grid>
            )}

            {/* DeepSeek API Key */}
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                label="DeepSeek API Key"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                helperText="Khóa API cá nhân của DeepSeek (bắt đầu bằng 'sk-'). Lấy tại platform.deepseek.com."
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          edge="end"
                          title={showApiKey ? 'Ẩn API key' : 'Hiện API key'}
                        >
                          {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Base URL */}
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                label="DeepSeek API Base URL"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="https://api.deepseek.com"
                helperText="Mặc định: https://api.deepseek.com (hoặc reverse proxy)"
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
                <MenuItem value="deepseek-chat">deepseek-chat (DeepSeek-V3 - Tối ưu phản hồi nhanh & tự nhiên)</MenuItem>
                <MenuItem value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1 - Suy luận chuỗi tư duy cao cấp)</MenuItem>
                <MenuItem value="deepseek-coder">deepseek-coder (Thử nghiệm)</MenuItem>
              </TextField>
            </Grid>

            {/* Confidence Slider */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ px: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Ngưỡng Tin Cậy Phân Loại Intent (Confidence Threshold): {formData.confidenceThreshold}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                  Khi độ tự tin &ge; {formData.confidenceThreshold}, hệ thống kích hoạt kịch bản chuẩn. Nếu thấp hơn sẽ gọi DeepSeek LLM.
                </Typography>
                <Slider
                  value={Number(formData.confidenceThreshold)}
                  min={0.1}
                  max={0.9}
                  step={0.02}
                  valueLabelDisplay="auto"
                  color="primary"
                  onChange={(e, val) => setFormData({ ...formData, confidenceThreshold: val })}
                />
              </Box>
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
                helperText="Định hình phong cách, tác phong, quy tắc tư vấn giác cắt kim cương và phong thủy của Stylist."
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ borderRadius: 20, px: 4, fontWeight: 700 }}
                >
                  {saving ? 'Đang Lưu...' : 'Lưu Cấu Hình AI'}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  disabled={testing}
                  onClick={handleTestConnection}
                  startIcon={testing ? <CircularProgress size={20} color="inherit" /> : <BoltIcon />}
                  sx={{ borderRadius: 20, px: 3, fontWeight: 600 }}
                >
                  {testing ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối'}
                </Button>

                <Button
                  type="button"
                  variant="text"
                  onClick={handleResetDefault}
                  startIcon={<ResetIcon />}
                  sx={{ borderRadius: 20, px: 3, color: 'text.secondary' }}
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