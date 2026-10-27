import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial Data (Đồng bộ sạch sẽ với DB wed_trang_suc sau khi xóa data mẫu)
export const MOCK_CATEGORIES = [];

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
  USERS: 'AURA_USERS_DATA_V4'
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
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /api/categories offline, using persistent local storage.', err.message);
  }
  return getStoredCategories();
};

export const createCategory = async (catData) => {
  const current = getStoredCategories();
  const newCat = {
    ...catData,
    MaDanhMuc: catData.MaDanhMuc || Date.now(),
    children: [],
    SoLuongSP: 0
  };
  const updated = [...current, newCat];
  setLocal(STORAGE_KEYS.CATEGORIES, updated);

  try {
    await apiClient.post('/categories', newCat);
  } catch (e) {
    console.warn('Could not post to /api/categories:', e.message);
  }
  return newCat;
};

export const updateCategory = async (catId, catData) => {
  const current = getStoredCategories();
  const updated = current.map(c => (c.MaDanhMuc === catId ? { ...c, ...catData } : c));
  setLocal(STORAGE_KEYS.CATEGORIES, updated);

  try {
    await apiClient.put(`/categories/${catId}`, catData);
  } catch (e) {
    console.warn(`Could not put to /api/categories/${catId}:`, e.message);
  }
  return updated.find(c => c.MaDanhMuc === catId);
};

export const deleteCategory = async (catId) => {
  const current = getStoredCategories();
  const updated = current.filter(c => c.MaDanhMuc !== catId);
  setLocal(STORAGE_KEYS.CATEGORIES, updated);

  try {
    await apiClient.delete(`/categories/${catId}`);
  } catch (e) {
    console.warn(`Could not delete /api/categories/${catId}:`, e.message);
  }
  return true;
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

