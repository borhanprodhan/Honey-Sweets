import React, { createContext, useContext, useEffect, useState } from 'react';
import { resolveAssetUrl } from '../assets/images';
import {
  BANGLADESH_DISTRICTS,
  GAIBANDHA_UPAZILAS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_DELIVERY_STAFF,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import {
  CartItem,
  Category,
  Coupon,
  DeliveryStaff,
  Language,
  Order,
  OrderStatus,
  Product,
  Review,
  StoreSettings,
  UserProfile,
  UserRole,
} from '../types';

export type ActivePageView =
  | 'home'
  | 'shop'
  | 'offers'
  | 'about'
  | 'contact'
  | 'checkout'
  | 'track'
  | 'customer-dashboard'
  | 'admin-dashboard'
  | 'delivery-dashboard'
  | 'faq'
  | 'terms'
  | 'privacy';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedWeight?: string) => void;
  removeFromCart: (productId: string, selectedWeight: string) => void;
  updateCartQuantity: (productId: string, selectedWeight: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Dedicated Express Buy Now
  buyNowItem: CartItem | null;
  openBuyNow: (product: Product, quantity?: number, selectedWeight?: string) => void;
  closeBuyNow: () => void;
  
  // Modals & Navigation
  activeQuickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackedOrder: Order | null;
  setTrackedOrder: (order: Order | null) => void;
  trackOrderByIdOrCode: (query: string) => Order | null;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupons & Pricing
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateCartSummary: () => {
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    total: number;
    qualifiesForFreeDelivery: boolean;
    remainingForFreeDelivery: number;
  };
  
  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerDetails: Order['customerDetails'];
    paymentMethod: 'cod' | 'bkash' | 'nagad';
    itemsOverride?: CartItem[];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignDeliveryStaff: (orderId: string, staffId: string) => void;
  
  // Admin Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  deliveryStaff: DeliveryStaff[];
  addDeliveryStaff: (staff: Omit<DeliveryStaff, 'id' | 'assignedOrdersCount'>) => void;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  
  // Filter & Views
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  currentView: ActivePageView;
  setCurrentView: (view: ActivePageView) => void;
  
  // Flash Sale
  flashSaleEndsAt: Date;
  
  // Notifications
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'honey_sweets_products_v1',
  CART: 'honey_sweets_cart_v1',
  ORDERS: 'honey_sweets_orders_v1',
  WISHLIST: 'honey_sweets_wishlist_v1',
  COUPONS: 'honey_sweets_coupons_v1',
  SETTINGS: 'honey_sweets_settings_v1',
  REVIEWS: 'honey_sweets_reviews_v1',
  STAFF: 'honey_sweets_staff_v1',
  ROLE: 'honey_sweets_user_role_v1',
  LANG: 'honey_sweets_lang_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-browsing errors
  }
}

function readStringStorage(key: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function normalizeProductAssets(prod: Product): Product {
  if (!prod || typeof prod !== 'object') {
    return INITIAL_PRODUCTS[0];
  }
  return {
    ...prod,
    images: Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images.map(resolveAssetUrl)
      : INITIAL_PRODUCTS[0].images,
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = readStringStorage(STORAGE_KEYS.LANG, 'bn');
    return saved === 'en' ? 'en' : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeStorage(STORAGE_KEYS.LANG, lang);
  };

  const [currentView, setCurrentView] = useState<ActivePageView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // User state
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = readStringStorage(STORAGE_KEYS.ROLE, 'customer');
    return saved === 'admin' || saved === 'delivery' ? saved : 'customer';
  });

  const currentUser: UserProfile = {
    id: currentRole === 'admin' ? 'admin-1' : currentRole === 'delivery' ? 'staff-1' : 'cust-1',
    name:
      currentRole === 'admin'
        ? 'Admin Manager (Honey-Sweets)'
        : currentRole === 'delivery'
        ? 'Rahim Mia (Rider)'
        : 'Borhan Prodhan',
    email:
      currentRole === 'admin'
        ? 'admin@honeysweets.com.bd'
        : currentRole === 'delivery'
        ? 'rahim.delivery@honeysweets.com.bd'
        : 'mdborhprodhan@gmail.com',
    phone: '01711-889900',
    role: currentRole,
    district: 'Gaibandha (গাইবান্ধা - হোম ডেলিভারি)',
    upazila: 'College Road (Express 1-hour Delivery)',
    address: 'College Road, Gaibandha Sadar, Bangladesh',
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    writeStorage(STORAGE_KEYS.ROLE, role);
    if (role === 'admin') {
      setCurrentView('admin-dashboard');
      showNotification(language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করা হয়েছে' : 'Switched to Admin Dashboard', 'info');
    } else if (role === 'delivery') {
      setCurrentView('delivery-dashboard');
      showNotification(language === 'bn' ? 'ডেলিভারি রাইডার ড্যাশবোর্ডে প্রবেশ করা হয়েছে' : 'Switched to Delivery Dashboard', 'info');
    } else {
      showNotification(language === 'bn' ? 'কাস্টমার মোডে ফিরে আসা হয়েছে' : 'Switched to Customer Mode', 'info');
    }
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const parsed = readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.filter((p) => p && typeof p === 'object').map(normalizeProductAssets)
      : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  // Categories
  const categories = INITIAL_CATEGORIES;

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const parsed = readStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    return Array.isArray(parsed)
      ? parsed
          .filter((item) => item && typeof item === 'object' && item.product)
          .map((item) => ({
            ...item,
            product: normalizeProductAssets(item.product),
          }))
      : [];
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.CART, cart);
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Buy Now item state for instant express checkout
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  const openBuyNow = (product: Product, quantity: number = 1, selectedWeight?: string) => {
    const weight = selectedWeight || product.weight;
    let multiplier = 1.0;
    if (product.availableWeights) {
      const match = product.availableWeights.find((w) => w.label === weight);
      if (match) multiplier = match.priceMultiplier;
    }
    const unitPrice = Math.round(product.salePrice * multiplier);

    setBuyNowItem({
      product,
      quantity,
      selectedWeight: weight,
      unitPrice,
    });
  };

  const closeBuyNow = () => {
    setBuyNowItem(null);
  };

  const addToCart = (product: Product, quantity: number = 1, selectedWeight?: string) => {
    const weight = selectedWeight || product.weight;
    let multiplier = 1.0;
    if (product.availableWeights) {
      const match = product.availableWeights.find((w) => w.label === weight);
      if (match) multiplier = match.priceMultiplier;
    }
    const unitPrice = Math.round(product.salePrice * multiplier);

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedWeight: weight, unitPrice }];
      }
    });

    showNotification(
      language === 'bn'
        ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে!`
        : `"${product.name}" added to cart!`,
      'success'
    );
  };

  const removeFromCart = (productId: string, selectedWeight: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedWeight === selectedWeight))
    );
  };

  const updateCartQuantity = (productId: string, selectedWeight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedWeight);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedWeight === selectedWeight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const parsed = readStorage<string[]>(STORAGE_KEYS.WISHLIST, ['prod-sundarban-honey']);
    return Array.isArray(parsed) ? parsed : ['prod-sundarban-honey'];
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showNotification(
        exists
          ? language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from Wishlist'
          : language === 'bn' ? 'উইশলিস্টে যুক্ত করা হয়েছে!' : 'Added to Wishlist!',
        'info'
      );
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Quick View Modal
  const [activeQuickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Order Tracking
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const parsed = readStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    return Array.isArray(parsed) ? parsed : INITIAL_COUPONS;
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.COUPONS, coupons);
  }, [coupons]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.status === 'active');
    if (!coupon) {
      return {
        success: false,
        message: language === 'bn' ? 'কুপন কোডটি সঠিক নয় বা মেয়াদ উত্তীর্ণ!' : 'Invalid or expired coupon code!',
      };
    }

    const { subtotal } = calculateCartSummary();
    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message:
          language === 'bn'
            ? `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${coupon.minOrder} টাকার পণ্য কার্টে থাকতে হবে`
            : `Minimum order of ৳${coupon.minOrder} required for this coupon`,
      };
    }

    setAppliedCoupon(coupon);
    showNotification(
      language === 'bn' ? `কুপন "${coupon.code}" সফলভাবে প্রয়োগ করা হয়েছে!` : `Coupon "${coupon.code}" applied!`,
      'success'
    );
    return {
      success: true,
      message: language === 'bn' ? 'কুপন ডিসকাউন্ট যোগ করা হয়েছে' : 'Coupon discount applied successfully',
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const parsed = readStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return Array.isArray(parsed)
      ? parsed.map((ord) => ({
          ...ord,
          items: Array.isArray(ord.items)
            ? ord.items.map((it) => ({ ...it, product: normalizeProductAssets(it.product) }))
            : [],
        }))
      : INITIAL_ORDERS;
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  // Delivery Staff
  const [deliveryStaff, setDeliveryStaff] = useState<DeliveryStaff[]>(() => {
    const parsed = readStorage<DeliveryStaff[]>(STORAGE_KEYS.STAFF, INITIAL_DELIVERY_STAFF);
    return Array.isArray(parsed) ? parsed : INITIAL_DELIVERY_STAFF;
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.STAFF, deliveryStaff);
  }, [deliveryStaff]);

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    return readStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showNotification(language === 'bn' ? 'সেটিংস আপডেট করা হয়েছে' : 'Settings updated successfully', 'success');
  };

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const parsed = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return Array.isArray(parsed) ? parsed : INITIAL_REVIEWS;
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => [newRev, ...prev]);
    showNotification(language === 'bn' ? 'আপনার রিভিউটি যোগ করা হয়েছে, ধন্যবাদ!' : 'Thank you! Your review has been added.', 'success');
  };

  // Flash Sale Timer (Target: 24h from now)
  const [flashSaleEndsAt] = useState<Date>(() => {
    const t = new Date();
    t.setHours(t.getHours() + 18);
    t.setMinutes(45);
    return t;
  });

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(
    null
  );

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Calculation Helper
  const calculateCartSummary = (itemsOverride?: CartItem[]) => {
    const targetItems = itemsOverride || cart;
    const subtotal = targetItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
    }

    const qualifiesForFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
    const remainingForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - subtotal);

    // Default Gaibandha delivery charge
    let deliveryCharge = qualifiesForFreeDelivery ? 0 : settings.deliveryChargeGaibandha;

    // If coupon is GAIBANDHA_FREE and inside gaibandha
    if (appliedCoupon?.code === 'GAIBANDHA_FREE') {
      deliveryCharge = 0;
    }

    const total = Math.max(0, subtotal - discount + deliveryCharge);

    return {
      subtotal,
      discount,
      deliveryCharge,
      total,
      qualifiesForFreeDelivery,
      remainingForFreeDelivery,
    };
  };

  // Place Order
  const placeOrder = ({
    customerDetails,
    paymentMethod,
    itemsOverride,
  }: {
    customerDetails: Order['customerDetails'];
    paymentMethod: 'cod' | 'bkash' | 'nagad';
    itemsOverride?: CartItem[];
  }): Order => {
    const targetItems = itemsOverride || cart;
    const { subtotal, discount, deliveryCharge, total } = calculateCartSummary(targetItems);

    const isGaibandha = customerDetails.district.toLowerCase().includes('gaibandha');
    const adjustedDeliveryCharge =
      subtotal >= settings.freeDeliveryThreshold
        ? 0
        : appliedCoupon?.code === 'GAIBANDHA_FREE'
        ? 0
        : isGaibandha
        ? settings.deliveryChargeGaibandha
        : settings.deliveryChargeOutside;

    const finalTotal = Math.max(0, subtotal - discount + adjustedDeliveryCharge);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `HS-${randomSuffix}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      trackingId,
      customerId: currentUser.id,
      customerDetails,
      items: targetItems,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      deliveryCharge: adjustedDeliveryCharge,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'Order Placed',
      history: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note:
            paymentMethod === 'cod'
              ? 'Order placed with Cash on Delivery.'
              : `Order placed and verified via ${paymentMethod.toUpperCase()}.`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = targetItems.find((ci) => ci.product.id === prod.id);
        if (cartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartItem.quantity),
          };
        }
        return prod;
      })
    );

    if (!itemsOverride) {
      clearCart();
    }
    setAppliedCoupon(null);
    closeBuyNow();

    showNotification(
      language === 'bn'
        ? `অর্ডার সফলভাবে সম্পন্ন হয়েছে! ট্র্যাকিং আইডি: ${trackingId}`
        : `Order placed successfully! Tracking ID: ${trackingId}`,
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newHistory = [
            ...ord.history,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Status updated to ${status}.`,
            },
          ];
          return {
            ...ord,
            orderStatus: status,
            history: newHistory,
          };
        }
        return ord;
      })
    );
    showNotification(
      language === 'bn' ? `অর্ডার স্ট্যাটাস "${status}" এ আপডেট হয়েছে` : `Order status updated to "${status}"`,
      'info'
    );
  };

  const assignDeliveryStaff = (orderId: string, staffId: string) => {
    const staff = deliveryStaff.find((s) => s.id === staffId);
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, assignedDeliveryStaffId: staffId } : ord))
    );
    showNotification(
      language === 'bn'
        ? `রাইডার ${staff?.name || ''} কে অ্যাসাইন করা হয়েছে`
        : `Assigned to rider ${staff?.name || ''}`,
      'success'
    );
  };

  const trackOrderByIdOrCode = (query: string): Order | null => {
    const clean = query.trim().toUpperCase();
    const found = orders.find(
      (o) => o.trackingId.toUpperCase() === clean || o.id.toUpperCase() === clean
    );
    setTrackedOrder(found || null);
    return found || null;
  };

  // Product CRUD
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(
      language === 'bn' ? 'নতুন পণ্য সফলভাবে তালিকায় যোগ করা হয়েছে!' : 'Product added successfully!',
      'success'
    );
  };

  const editProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showNotification(language === 'bn' ? 'পণ্য আপডেট করা হয়েছে' : 'Product updated', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification(language === 'bn' ? 'পণ্যটি তালিকা থেকে মুছে ফেলা হয়েছে' : 'Product deleted', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showNotification(language === 'bn' ? 'কুপন যোগ করা হয়েছে' : 'Coupon created', 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showNotification(language === 'bn' ? 'কুপন মুছে ফেলা হয়েছে' : 'Coupon removed', 'info');
  };

  const addDeliveryStaff = (staff: Omit<DeliveryStaff, 'id' | 'assignedOrdersCount'>) => {
    const newStaff: DeliveryStaff = {
      ...staff,
      id: `staff-${Date.now()}`,
      assignedOrdersCount: 0,
    };
    setDeliveryStaff((prev) => [...prev, newStaff]);
    showNotification(language === 'bn' ? 'নতুন ডেলিভারি রাইডার যুক্ত হয়েছে' : 'Delivery rider added', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        switchRole,
        products,
        categories,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        buyNowItem,
        openBuyNow,
        closeBuyNow,
        activeQuickViewProduct,
        setQuickViewProduct,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackedOrder,
        setTrackedOrder,
        trackOrderByIdOrCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateCartSummary,
        orders,
        placeOrder,
        updateOrderStatus,
        assignDeliveryStaff,
        addProduct,
        editProduct,
        deleteProduct,
        addCoupon,
        deleteCoupon,
        deliveryStaff,
        addDeliveryStaff,
        settings,
        updateSettings,
        reviews,
        addReview,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        currentView,
        setCurrentView,
        flashSaleEndsAt,
        notification,
        showNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
