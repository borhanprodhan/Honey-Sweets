export type Language = 'bn' | 'en';

export type UserRole = 'customer' | 'admin' | 'delivery';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  district?: string;
  upazila?: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categoryNameBn: string;
  description: string;
  descriptionBn: string;
  images: string[];
  regularPrice: number;
  salePrice: number;
  discountPercentage?: number;
  stock: number;
  sku: string;
  weight: string; // e.g. "500g", "1kg"
  availableWeights?: { label: string; priceMultiplier: number }[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  origin: string;
  originBn: string;
  purityGuarantee: string;
  purityGuaranteeBn: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  image: string;
  description: string;
  descriptionBn: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
  unitPrice: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  titleBn: string;
  titleEn: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Ready for Shipment'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface OrderHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  upazila: string;
  fullAddress: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  trackingId: string;
  customerId: string;
  customerDetails: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: 'pending' | 'paid';
  orderStatus: OrderStatus;
  assignedDeliveryStaffId?: string;
  history: OrderHistoryItem[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface DeliveryStaff {
  id: string;
  name: string;
  phone: string;
  area: string;
  status: 'available' | 'on_delivery' | 'offline';
  assignedOrdersCount: number;
}

export interface StoreSettings {
  storeName: string;
  businessAddress: string;
  phone: string;
  whatsapp: string;
  deliveryChargeGaibandha: number;
  deliveryChargeOutside: number;
  freeDeliveryThreshold: number;
  announcementBn: string;
  announcementEn: string;
}
