import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial Data (Đồng bộ sạch sẽ với DB wed_trang_suc)
export const MOCK_CATEGORIES = [
  { MaDanhMuc: 1, TenDanhMuc: 'Nhẫn Kim Cương & Nhẫn Cưới', children: [] },
  { MaDanhMuc: 2, TenDanhMuc: 'Dây Chuyền & Mặt Dây', children: [] },
  { MaDanhMuc: 3, TenDanhMuc: 'Vòng Tay & Lắc', children: [] },
  { MaDanhMuc: 4, TenDanhMuc: 'Bông Tai Quý Phái', children: [] },
  { MaDanhMuc: 5, TenDanhMuc: 'Bộ Sưu Tập Hoàng Gia', children: [] }
];

export const MOCK_PRODUCTS = [];

export const MOCK_VOUCHERS = [];

export const formatCurrency = (val) => {
  if (val == null) return '0 ₫';
  return Number(val).toLocaleString('vi-VN') + ' ₫';
};

// ==========================================
// PERSISTENCE ENGINE & FULLSTACK CRUD APIs
// ==========================================
export const STORAGE_KEYS = {
  PRODUCTS: 'AURA_PRODUCTS_DATA_V4',
  CATEGORIES: 'AURA_CATEGORIES_DATA_V4',
  ORDERS: 'AURA_ORDERS_DATA_V4',
  VOUCHERS: 'AURA_VOUCHERS_DATA_V4',
  USERS: 'AURA_USERS_DATA_V4',
  AI_SETTINGS: 'AURA_AI_SETTINGS_DATA_V4'
};

// --- Initial Mock Orders & Users ---
export const MOCK_ORDERS = [];

export const MOCK_USERS = [
  { id: 1, username: 'admin', fullName: 'Quản Trị Viên Cao Cấp', email: 'admin@lunabelle.vn', phone: '0901234567', role: 'ADMIN', active: true },
  { id: 2, username: 'nhanvien', fullName: 'Nguyễn Văn Nhân Viên', email: 'staff@lunabelle.vn', phone: '0912345678', role: 'STAFF', active: true },
  { id: 3, username: 'khachhang', fullName: 'Lê Hoàng Yến Nhi', email: 'yennhi@gmail.com', phone: '0987654321', role: 'CUSTOMER', active: true },
  { id: 4, username: 'minhtri', fullName: 'Trần Minh Trí', email: 'minhtri@gmail.com', phone: '0978999888', role: 'CUSTOMER', active: true }
];

// Helper to safely get from localStorage
const getLocal = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return defaultVal;
};

// Helper to safely set to localStorage
const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// ==================== PRODUCTS CRUD ====================
export const getStoredProducts = () => {
  return getLocal(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
};

export const fetchProducts = async () => {
  try {
    const res = await apiClient.get('/products');
    if (res.data?.success && Array.isArray(res.data.data)) {
      setLocal(STORAGE_KEYS.PRODUCTS, res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /api/products offline or unreachable, using persistent local storage.', err.message);
  }
  return getStoredProducts();
};

export const fetchProductById = async (productId) => {
  try {
    const res = await apiClient.get(`/products/${productId}`);
    if (res.data?.success && res.data.data) {
      const current = getStoredProducts();
      const idx = current.findIndex(p => String(p.MaSanPham) === String(res.data.data.MaSanPham));
      if (idx >= 0) {
        current[idx] = res.data.data;
      } else {
        current.push(res.data.data);
      }
      setLocal(STORAGE_KEYS.PRODUCTS, current);
      return res.data.data;
    }
  } catch (err) {
    console.warn(`Could not fetch product ${productId} from backend:`, err.message);
  }
  const all = getStoredProducts();
  return all.find(p => String(p.MaSanPham) === String(productId)) || null;
};

export const createProduct = async (productData) => {
  const current = getStoredProducts();
  let newProduct = {
    ...productData,
    MaSanPham: productData.MaSanPham || Date.now(),
    TongBan: 0,
    TongTonKho: (productData.bienthe || []).reduce((acc, v) => acc + (Number(v.SoLuongTonKho) || 0), 0) || 15
  };

  try {
    const res = await apiClient.post('/products', newProduct);
    if (res.data?.success && res.data.id) {
      newProduct.MaSanPham = res.data.id;
    }
  } catch (e) {
    console.warn('Could not post to /api/products:', e.message);
  }

  const updated = [newProduct, ...current.filter(p => p.MaSanPham !== newProduct.MaSanPham)];
  setLocal(STORAGE_KEYS.PRODUCTS, updated);
  return newProduct;
};

export const updateProduct = async (productId, productData) => {
  const current = getStoredProducts();
  const updated = current.map(p => (p.MaSanPham === productId ? { ...p, ...productData } : p));
  setLocal(STORAGE_KEYS.PRODUCTS, updated);

  try {
    await apiClient.put(`/products/${productId}`, productData);
  } catch (e) {
    console.warn(`Could not put to /api/products/${productId}:`, e.message);
  }
  return updated.find(p => p.MaSanPham === productId);
};

export const deleteProduct = async (productId) => {
  const current = getStoredProducts();
  const updated = current.filter(p => p.MaSanPham !== productId);
  setLocal(STORAGE_KEYS.PRODUCTS, updated);

  try {
    await apiClient.delete(`/products/${productId}`);
  } catch (e) {
    console.warn(`Could not delete /api/products/${productId}:`, e.message);
  }
  return true;
};

// ==================== CATEGORIES CRUD ====================
export const getStoredCategories = () => {
  return getLocal(STORAGE_KEYS.CATEGORIES, MOCK_CATEGORIES);
};

export const fetchCategories = async () => {
  try {
    const res = await apiClient.get('/categories');
    if (res.data?.success && Array.isArray(res.data.data)) {
      setLocal(STORAGE_KEYS.CATEGORIES, res.data.data);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('categories-updated', { detail: res.data.data }));
      }
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /api/categories offline, using persistent local storage.', err.message);
  }
  return getStoredCategories();
};

export const createCategory = async (catData) => {
  try {
    const res = await apiClient.post('/categories', catData);
    if (res.data?.success) {
      const fresh = await fetchCategories();
      return fresh;
    }
  } catch (e) {
    console.warn('Could not post to /api/categories:', e.message);
  }

  // Local storage fallback
  const current = getStoredCategories();
  const newCat = {
    ...catData,
    MaDanhMuc: catData.MaDanhMuc || Date.now(),
    children: [],
    SoLuongSP: 0
  };

  let updated;
  if (catData.MaDanhMucCha) {
    const parentId = Number(catData.MaDanhMucCha);
    updated = current.map(c => {
      if (c.MaDanhMuc === parentId) {
        return {
          ...c,
          children: [...(c.children || []), newCat]
        };
      }
      return c;
    });
  } else {
    updated = [...current, newCat];
  }

  setLocal(STORAGE_KEYS.CATEGORIES, updated);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('categories-updated', { detail: updated }));
  return newCat;
};

export const updateCategory = async (catId, catData) => {
  try {
    const res = await apiClient.put(`/categories/${catId}`, catData);
    if (res.data?.success) {
      const fresh = await fetchCategories();
      return fresh;
    }
  } catch (e) {
    console.warn(`Could not put to /api/categories/${catId}:`, e.message);
  }

  // Local storage fallback
  const current = getStoredCategories();
  const updated = current.map(c => {
    if (c.MaDanhMuc === catId) {
      return { ...c, ...catData };
    }
    if (c.children && c.children.some(ch => ch.MaDanhMuc === catId)) {
      return {
        ...c,
        children: c.children.map(ch => (ch.MaDanhMuc === catId ? { ...ch, ...catData } : ch))
      };
    }
    return c;
  });
  setLocal(STORAGE_KEYS.CATEGORIES, updated);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('categories-updated', { detail: updated }));
  return updated.find(c => c.MaDanhMuc === catId);
};

export const deleteCategory = async (catId) => {
  try {
    const res = await apiClient.delete(`/categories/${catId}`);
    if (res.data?.success) {
      await fetchCategories();
      return { success: true };
    } else {
      return { success: false, message: res.data?.message || 'Không thể xóa danh mục.' };
    }
  } catch (e) {
    const msg = e.response?.data?.message;
    if (msg) {
      return { success: false, message: msg };
    }
    console.warn(`Could not delete /api/categories/${catId}:`, e.message);
  }

  // Local storage fallback
  const current = getStoredCategories();
  const updated = current
    .filter(c => c.MaDanhMuc !== catId)
    .map(c => ({
      ...c,
      children: (c.children || []).filter(ch => ch.MaDanhMuc !== catId)
    }));
  setLocal(STORAGE_KEYS.CATEGORIES, updated);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('categories-updated', { detail: updated }));
  return { success: true };
};

// ==================== ORDERS CRUD ====================
export const getStoredOrders = () => {
  return getLocal(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
};

export const fetchOrders = async () => {
  try {
    const res = await apiClient.get('/orders');
    if (res.data?.success && Array.isArray(res.data.data)) {
      setLocal(STORAGE_KEYS.ORDERS, res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /api/orders offline, using persistent local storage.', err.message);
  }
  return getStoredOrders();
};

export const createOrder = async (orderData) => {
  const current = getStoredOrders();
  const orderCode = `LB${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    ...orderData,
    id: orderCode,
    date: new Date().toLocaleString('vi-VN'),
    status: 'ChoXacNhan',
    statusText: 'Chờ Xác Nhận'
  };
  const updated = [newOrder, ...current];
  setLocal(STORAGE_KEYS.ORDERS, updated);

  try {
    await apiClient.post('/orders', orderData);
  } catch (e) {
    console.warn('Could not post to /api/orders:', e.message);
  }
  return newOrder;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const current = getStoredOrders();
  const updated = current.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
  setLocal(STORAGE_KEYS.ORDERS, updated);

  try {
    await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
  } catch (e) {
    console.warn(`Could not put /api/orders/${orderId}/status:`, e.message);
  }
  return updated.find(o => o.id === orderId);
};

// ==================== VOUCHERS CRUD ====================
export const getStoredVouchers = () => {
  return getLocal(STORAGE_KEYS.VOUCHERS, MOCK_VOUCHERS);
};

export const fetchVouchers = async () => {
  try {
    const res = await apiClient.get('/vouchers');
    if (res.data?.success && Array.isArray(res.data.data)) {
      setLocal(STORAGE_KEYS.VOUCHERS, res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /api/vouchers offline, using persistent local storage.', err.message);
  }
  return getStoredVouchers();
};

export const createVoucher = async (voucherData) => {
  const current = getStoredVouchers();
  const newVoucher = {
    ...voucherData,
    MaGiamGia: Date.now(),
    active: true
  };
  const updated = [newVoucher, ...current];
  setLocal(STORAGE_KEYS.VOUCHERS, updated);

  try {
    await apiClient.post('/vouchers', newVoucher);
  } catch (e) {
    console.warn('Could not post to /api/vouchers:', e.message);
  }
  return newVoucher;
};

export const deleteVoucher = async (voucherId) => {
  const current = getStoredVouchers();
  const updated = current.filter(v => v.MaGiamGia !== voucherId && v.MaCode !== voucherId);
  setLocal(STORAGE_KEYS.VOUCHERS, updated);

  try {
    await apiClient.delete(`/vouchers/${voucherId}`);
  } catch (e) {
    console.warn(`Could not delete /api/vouchers/${voucherId}:`, e.message);
  }
  return true;
};

// ==================== USERS CRUD ====================
export const getStoredUsers = () => {
  return getLocal(STORAGE_KEYS.USERS, MOCK_USERS);
};

export const fetchUsers = async () => {
  try {
    const res = await apiClient.get('/users');
    if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      setLocal(STORAGE_KEYS.USERS, res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /api/users offline, using persistent local storage.', err.message);
  }
  return getStoredUsers();
};

export const createUser = async (userData) => {
  const current = getStoredUsers();
  const newUser = {
    ...userData,
    id: Date.now(),
    active: true
  };
  const updated = [...current, newUser];
  setLocal(STORAGE_KEYS.USERS, updated);

  try {
    await apiClient.post('/users', newUser);
  } catch (e) {
    console.warn('Could not post to /api/users:', e.message);
  }
  return newUser;
};

// ==================== IMAGE UPLOAD HELPER ====================
export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.data?.success && res.data.url) {
      return res.data.url;
    }
  } catch (e) {
    console.warn('Backend upload failed, converting to DataURL:', e.message);
  }

  // Fallback to Base64 Data URL so preview and storage works offline!
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ==================== AI SETTINGS & CONSULTANT APIs ====================
export const DEFAULT_AI_PROMPT = `Bạn là AI Jewelry Stylist cao cấp độc quyền của thương hiệu trang sức kim hoàn LUNA BELLE.
Nhiệm vụ của bạn là tư vấn tận tâm, thanh lịch, am hiểu sâu về:
1. Giác cắt kim cương chuẩn kiểm định GIA quốc tế (3X Excellent, nước D-F, độ sạch FL/IF/VVS).
2. Trang sức vàng 18K (750), bạch kim Pt950, Moissanite nước D kiêu sa.
3. Phong thủy bản mệnh (Kim, Mộc, Thủy, Hỏa, Thổ) tương sinh chiêu tài hút lộc.
4. Gợi ý nhẫn cầu hôn Solitaire, nhẫn cưới đôi, dây chuyền dạ hội tiệc cưới.
Luôn giữ giọng điệu lịch thiệp, sang trọng, xưng "Tôi" hoặc "LUNA BELLE" và gọi khách hàng là "Quý khách".`;

export const getStoredAiSettings = () => {
  return getLocal(STORAGE_KEYS.AI_SETTINGS, {
    apiKey: '',
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com',
    confidenceThreshold: 0.38,
    systemPrompt: DEFAULT_AI_PROMPT
  });
};

export const fetchAiSettings = async () => {
  try {
    const res = await apiClient.get('/ai/settings');
    if (res.data?.success && res.data.config) {
      const cfg = {
        apiKey: res.data.config.apiKey || '',
        model: res.data.config.model || 'deepseek-chat',
        baseUrl: res.data.config.baseUrl || 'https://api.deepseek.com',
        confidenceThreshold: res.data.config.confidenceThreshold ?? 0.38,
        systemPrompt: res.data.config.systemPrompt || DEFAULT_AI_PROMPT,
        hasApiKey: Boolean(res.data.config.hasApiKey),
        api_key_masked: res.data.config.api_key_masked || ''
      };
      setLocal(STORAGE_KEYS.AI_SETTINGS, cfg);
      return cfg;
    }
  } catch (err) {
    console.warn('Backend /api/ai/settings offline, using local storage:', err.message);
  }
  return getStoredAiSettings();
};

export const saveAiSettings = async (settingsData) => {
  setLocal(STORAGE_KEYS.AI_SETTINGS, settingsData);
  try {
    const res = await apiClient.post('/ai/settings', settingsData);
    if (res.data?.success && res.data.config) {
      const savedConfig = {
        apiKey: res.data.config.apiKey ?? settingsData.apiKey,
        model: res.data.config.model ?? settingsData.model,
        baseUrl: res.data.config.baseUrl ?? settingsData.baseUrl,
        confidenceThreshold: res.data.config.confidenceThreshold ?? settingsData.confidenceThreshold,
        systemPrompt: res.data.config.systemPrompt ?? settingsData.systemPrompt,
        hasApiKey: Boolean(res.data.config.hasApiKey),
        api_key_masked: res.data.config.api_key_masked || ''
      };
      setLocal(STORAGE_KEYS.AI_SETTINGS, savedConfig);
      return res.data;
    }
  } catch (err) {
    console.warn('Could not post to /api/ai/settings, persisted locally:', err.message);
  }
  return { success: true, message: 'Đã lưu cấu hình AI thành công (lưu trữ cục bộ)!' };
};

export const testAiConnection = async (payload) => {
  try {
    const res = await apiClient.post('/ai/test-connection', payload);
    return res.data;
  } catch (err) {
    return {
      success: false,
      is_live_ai: false,
      status: 'error',
      message: err.response?.data?.message || err.message || 'Lỗi khi kết nối đến máy chủ AI'
    };
  }
};

export const consultAi = async (payload) => {
  try {
    const res = await apiClient.post('/ai/consult', payload);
    if (res.data?.success) {
      return res.data;
    }
  } catch (err) {
    console.warn('Could not call /api/ai/consult:', err.message);
  }
  return null;
};

