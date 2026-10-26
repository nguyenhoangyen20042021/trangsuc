import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_VOUCHERS } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { notify } = useAuth();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('lb_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        cartId: '1-101',
        MaSanPham: 1,
        TenSanPham: 'Nhẫn Kim Cương Solitaire Eternal Grace',
        HinhAnh: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
        MaBienThe: 101,
        TenBienThe: 'Size 10 - Vàng Trắng 18K',
        GiaBan: 28500000,
        SoLuong: 1
      }
    ];
  });

  const [appliedVoucher, setAppliedVoucher] = useState(null);

  useEffect(() => {
    localStorage.setItem('lb_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    const variantId = variant?.MaBienThe || 'default';
    const cartId = `${product.MaSanPham}-${variantId}`;
    const price = variant?.GiaBan || product.GiaCoSo || product.GiaMin;
    const variantName = variant?.TenBienThe || 'Tiêu chuẩn';

    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item =>
          item.cartId === cartId
            ? { ...item, SoLuong: item.SoLuong + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartId,
            MaSanPham: product.MaSanPham,
            TenSanPham: product.TenSanPham,
            HinhAnh: product.HinhAnhChinh,
            MaBienThe: variant?.MaBienThe,
            TenBienThe: variantName,
            GiaBan: price,
            SoLuong: quantity,
          }
        ];
      }
    });

    notify(`Đã thêm "${product.TenSanPham}" vào giỏ hàng`, 'success');
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartId === cartId ? { ...item, SoLuong: quantity } : item))
    );
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    notify('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  const applyVoucherCode = (code) => {
    const voucher = MOCK_VOUCHERS.find(
      v => v.MaCode.toUpperCase() === code.trim().toUpperCase()
    );
    if (!voucher) {
      notify('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
      return false;
    }
    if (subtotal < voucher.GiaTriDonToiThieu) {
      notify(`Đơn hàng phải tối thiểu ${voucher.GiaTriDonToiThieu.toLocaleString()}₫ để áp dụng mã này!`, 'warning');
      return false;
    }
    setAppliedVoucher(voucher);
    notify(`Áp dụng thành công mã ${voucher.MaCode}!`, 'success');
    return true;
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    notify('Đã hủy áp dụng mã giảm giá', 'info');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.SoLuong, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.GiaBan * item.SoLuong, 0);
  const discountAmount = appliedVoucher ? appliedVoucher.GiaTriGiam : 0;
  const shippingFee = subtotal >= 2000000 || subtotal === 0 ? 0 : 50000;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      subtotal,
      discountAmount,
      shippingFee,
      finalTotal,
      appliedVoucher,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyVoucherCode,
      removeVoucher
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
