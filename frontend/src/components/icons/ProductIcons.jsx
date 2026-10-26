import React from 'react';
import {
  DiamondOutlined,
  ShoppingBagOutlined,
  Search as SearchIcon,
  PersonOutlined,
  AutoAwesomeOutlined,
  WorkspacePremiumOutlined,
  LocalShippingOutlined,
  LinearScaleOutlined,
  AdjustOutlined,
  FlareOutlined,
  StarsOutlined
} from '@mui/icons-material';

/**
 * LUNA BELLE Elite Jewelry – Standard Material-UI Luxury Product Icons
 * 100% standard Material-UI vector icons with zero clipping, perfect viewBox, and crisp high-DPI rendering.
 */

// 1. Nhẫn Kim Cương & Nhẫn Cưới
export const RingProductIcon = (props) => <DiamondOutlined {...props} />;

// 2. Dây Chuyền & Mặt Dây
export const NecklaceProductIcon = (props) => <LinearScaleOutlined {...props} />;

// 3. Vòng Tay & Lắc
export const BraceletProductIcon = (props) => <AdjustOutlined {...props} />;

// 4. Bông Tai Quý Phái
export const EarringsProductIcon = (props) => <FlareOutlined {...props} />;

// 5. Bộ Sưu Tập Hoàng Gia / Vương Miện
export const RoyalCrownProductIcon = (props) => <StarsOutlined {...props} />;

// 6. Kiệt Tác Kim Cương Tổng Thể
export const AllJewelryProductIcon = (props) => <DiamondOutlined {...props} />;

// 7. Tra Cứu Đơn Hàng / Vận Chuyển Kim Hoàn
export const OrderTrackingProductIcon = (props) => <LocalShippingOutlined {...props} />;

// 8. Túi Mua Sắm Boutique
export const LuxuryBagIcon = (props) => <ShoppingBagOutlined {...props} />;

// 9. Kính Lúp Thợ Kim Hoàn
export const LuxurySearchIcon = (props) => <SearchIcon {...props} />;

// 10. Khách Hàng VIP / Chân Dung
export const LuxuryUserIcon = (props) => <PersonOutlined {...props} />;

// 11. Ánh Sáng Thiên Thể / AI Stylist
export const LuxurySparkleIcon = (props) => <AutoAwesomeOutlined {...props} />;

// 12. Chứng Thư Giám Định Quốc Tế GIA
export const LuxuryGiaIcon = (props) => <WorkspacePremiumOutlined {...props} />;

/**
 * Helper to dynamically return the standard product icon based on category slug
 */
export const getCategoryProductIcon = (slug, props = {}) => {
  if (!slug) return <AllJewelryProductIcon {...props} />;
  const s = slug.toLowerCase();
  if (s.includes('nhan')) return <RingProductIcon {...props} />;
  if (s.includes('day-chuyen') || s.includes('mat-day')) return <NecklaceProductIcon {...props} />;
  if (s.includes('vong') || s.includes('lac-tay')) return <BraceletProductIcon {...props} />;
  if (s.includes('bong-tai') || s.includes('hoa-tai')) return <EarringsProductIcon {...props} />;
  if (s.includes('hoang-gia') || s.includes('vuong-mien') || s.includes('crown')) return <RoyalCrownProductIcon {...props} />;
  return <AllJewelryProductIcon {...props} />;
};
