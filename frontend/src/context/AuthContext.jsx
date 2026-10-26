import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lb_user');
    return saved ? JSON.parse(saved) : {
      MaNguoiDung: 3,
      TenDangNhap: 'khachhang',
      HoTen: 'Lê Hoàng Yến Nhi',
      Email: 'yennhi@gmail.com',
      SoDienThoai: '0987654321',
      TenVaiTro: 'CUSTOMER',
      DiaChi: '123 Đồng Khởi, Quận 1, TP. Hồ Chí Minh'
    };
  });

  const [notification, setNotification] = useState(null);

  const notify = (message, severity = 'info') => {
    setNotification({ message, severity, key: Date.now() });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('lb_user', JSON.stringify(user));
    notify(`Chào mừng trở lại, ${user.HoTen}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lb_user');
    notify('Đã đăng xuất thành công.', 'info');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      notification,
      notify,
      closeNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
