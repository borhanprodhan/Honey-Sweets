import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Truck,
  CheckCircle,
  Clock,
  Sparkles,
  Settings,
  ChevronRight,
  X,
  Search,
} from 'lucide-react';
import { OrderStatus, Product, Coupon } from '../types';
import { ASSETS } from '../assets/images';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    assignDeliveryStaff,
    deliveryStaff,
    coupons,
    addCoupon,
    deleteCoupon,
    settings,
    updateSettings,
    language,
    setCurrentView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'delivery' | 'settings'>('overview');
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    nameBn: '',
    slug: '',
    categoryId: 'cat-pure-honey',
    categoryName: 'Pure Honey',
    categoryNameBn: 'খাঁটি মধু',
    description: '',
    descriptionBn: '',
    regularPrice: 800,
    salePrice: 650,
    stock: 20,
    sku: 'HS-NEW-01',
    weight: '500g',
    origin: 'Gaibandha, Bangladesh',
    originBn: 'গাইবান্ধা, বাংলাদেশ',
    purityGuarantee: '100% Lab Tested',
    purityGuaranteeBn: 'ল্যাব টেস্টে শতভাগ খাঁটি',
    images: [ASSETS.honeySundarbanPure],
    isFeatured: true,
    isFlashSale: false,
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 1,
  });

  // Coupon Modal State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(500);

  // Settings State
  const [chargeGaibandha, setChargeGaibandha] = useState(settings.deliveryChargeGaibandha);
  const [chargeOutside, setChargeOutside] = useState(settings.deliveryChargeOutside);
  const [freeThreshold, setFreeThreshold] = useState(settings.freeDeliveryThreshold);
  const [announcementText, setAnnouncementText] = useState(settings.announcementBn);

  // Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' || o.orderStatus === 'Delivered' ? o.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Processing');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      nameBn: '',
      slug: `product-${Date.now()}`,
      categoryId: 'cat-pure-honey',
      categoryName: 'Pure Honey',
      categoryNameBn: 'খাঁটি মধু',
      description: '',
      descriptionBn: '',
      regularPrice: 700,
      salePrice: 600,
      stock: 25,
      sku: `HS-${Math.floor(100 + Math.random() * 900)}`,
      weight: '500g',
      origin: 'Gaibandha, Bangladesh',
      originBn: 'গাইবান্ধা, বাংলাদেশ',
      purityGuarantee: '100% Pure',
      purityGuaranteeBn: '১০০% খাঁটি ও নির্ভেজাল',
      images: [ASSETS.honeySundarbanPure],
      isFeatured: true,
      isFlashSale: false,
      isBestSeller: false,
      rating: 5.0,
      reviewsCount: 0,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      nameBn: prod.nameBn,
      slug: prod.slug,
      categoryId: prod.categoryId,
      categoryName: prod.categoryName,
      categoryNameBn: prod.categoryNameBn,
      description: prod.description,
      descriptionBn: prod.descriptionBn,
      regularPrice: prod.regularPrice,
      salePrice: prod.salePrice,
      stock: prod.stock,
      sku: prod.sku,
      weight: prod.weight,
      origin: prod.origin,
      originBn: prod.originBn,
      purityGuarantee: prod.purityGuarantee,
      purityGuaranteeBn: prod.purityGuaranteeBn,
      images: prod.images,
      isFeatured: !!prod.isFeatured,
      isFlashSale: !!prod.isFlashSale,
      isBestSeller: !!prod.isBestSeller,
      rating: prod.rating,
      reviewsCount: prod.reviewsCount,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      editProduct(editingProductId, productForm);
    } else {
      addProduct(productForm);
    }
    setIsProductModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(newCouponDiscount),
      minOrder: Number(newCouponMin),
      titleBn: `${newCouponDiscount}% স্পেশাল ছাড় (সর্বনিম্ন ৳${newCouponMin})`,
      titleEn: `${newCouponDiscount}% OFF on orders over ৳${newCouponMin}`,
      expiryDate: '2026-12-31',
      status: 'active',
    };
    addCoupon(newC);
    setNewCouponCode('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      deliveryChargeGaibandha: Number(chargeGaibandha),
      deliveryChargeOutside: Number(chargeOutside),
      freeDeliveryThreshold: Number(freeThreshold),
      announcementBn: announcementText,
    });
  };

  return (
    <div className="py-8 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Admin Control Room
              </span>
            </div>
            <h1 className="text-2xl font-bold font-serif-title text-[#4A2E16] mt-1">
              {language === 'bn' ? 'ম্যানেজমেন্ট ড্যাশবোর্ড' : 'Honey-Sweets Administration'}
            </h1>
            <p className="text-xs text-stone-500">
              College Road, Gaibandha Store Operations & E-commerce System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              {language === 'bn' ? 'স্টোরে ফিরুন' : 'Back to Store'}
            </button>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন পণ্য যোগ' : 'Add Product'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            📊 {language === 'bn' ? 'ওভারভিউ' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            📦 <span>{language === 'bn' ? 'অর্ডারসমূহ' : 'Orders'}</span>
            <span className="font-mono bg-[#E5A000] text-[#4A2E16] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            🍯 <span>{language === 'bn' ? 'পণ্য ক্যাটালগ' : 'Products'}</span>
            <span className="font-mono bg-stone-200 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'coupons'
                ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            🏷️ {language === 'bn' ? 'কুপন ও অফার' : 'Coupons & Offers'}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'delivery'
                ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            🚴 {language === 'bn' ? 'ডেলিভারি রাইডার' : 'Delivery Riders'}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            ⚙️ {language === 'bn' ? 'স্টোর সেটিংস' : 'Store Settings'}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {language === 'bn' ? 'মোট বিক্রয় (রেভিনিউ)' : 'Total Revenue'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#E5A000] flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-[#4A2E16]">
                  ৳{totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  +18% from last week
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-[#4A2E16]">
                  {orders.length}
                </div>
                <p className="text-[11px] text-stone-500">
                  {pendingOrders.length} {language === 'bn' ? 'টি অর্ডার পেন্ডিং' : 'pending'}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {language === 'bn' ? 'সফল ডেলিভারি' : 'Delivered Orders'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700">
                  {deliveredOrders.length}
                </div>
                <p className="text-[11px] text-stone-500">
                  {language === 'bn' ? 'গাইবান্ধা ও দেশজুড়ে' : 'Gaibandha & Nationwide'}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {language === 'bn' ? 'লো-স্টক সতর্কতা' : 'Low Stock Warning'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-rose-600">
                  {lowStockProducts.length}
                </div>
                <p className="text-[11px] text-stone-500">
                  {language === 'bn' ? 'পণ্য স্টক রিফিল প্রয়োজন' : 'Products need restocking'}
                </p>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                    {language === 'bn' ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Customer Orders'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live stream of newly placed orders across Bangladesh
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#E5A000] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-3 font-semibold">Tracking ID</th>
                      <th className="p-3 font-semibold">Customer</th>
                      <th className="p-3 font-semibold">Items</th>
                      <th className="p-3 font-semibold">Amount</th>
                      <th className="p-3 font-semibold">Payment</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-mono font-bold text-[#4A2E16]">
                          {ord.trackingId}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-stone-800">{ord.customerDetails.fullName}</p>
                          <p className="text-[10px] text-stone-400">{ord.customerDetails.phone}</p>
                        </td>
                        <td className="p-3 text-stone-600">
                          {ord.items.length} {language === 'bn' ? 'টি পণ্য' : 'item(s)'}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#E5A000]">
                          ৳{ord.total}
                        </td>
                        <td className="p-3 uppercase font-semibold text-[11px] text-stone-600">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A000]/15 text-[#4A2E16]">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-[#E5A000] hover:text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'অর্ডার ও ডেলিভারি ব্যবস্থাপনা' : 'Order & Shipment Dispatch'}
              </h3>
              <p className="text-xs text-stone-500">
                Update status stages and assign riders in Gaibandha
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#4A2E16]">
                          {ord.trackingId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A000]/20 text-[#4A2E16]">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {new Date(ord.createdAt).toLocaleString('bn-BD')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#E5A000]">
                        ৳{ord.total}
                      </span>
                      <span className="uppercase text-[11px] font-semibold text-stone-600 bg-white px-2 py-1 rounded border border-stone-200">
                        {ord.paymentMethod} · {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Customer:</span>
                      <p className="font-bold text-stone-800">{ord.customerDetails.fullName} ({ord.customerDetails.phone})</p>
                      <p className="text-stone-600 text-[11px]">
                        {ord.customerDetails.fullAddress}, {ord.customerDetails.upazila}
                      </p>
                    </div>

                    {/* Rider Assign Dropdown */}
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Assigned Delivery Rider:</span>
                      <select
                        value={ord.assignedDeliveryStaffId || ''}
                        onChange={(e) => assignDeliveryStaff(ord.id, e.target.value)}
                        className="mt-1 w-full text-xs bg-white rounded-lg px-2.5 py-1.5 border border-stone-200 font-medium"
                      >
                        <option value="">{language === 'bn' ? '-- রাইডার নির্বাচন করুন --' : '-- Assign Rider --'}</option>
                        {deliveryStaff.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name} ({staff.area})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Status Actions Strip */}
                  <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-400 text-[11px] mr-1">Change Status:</span>
                    {(
                      [
                        'Order Confirmed',
                        'Processing',
                        'Ready for Shipment',
                        'Out for Delivery',
                        'Delivered',
                        'Cancelled',
                      ] as OrderStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(ord.id, st)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          ord.orderStatus === st
                            ? 'bg-[#4A2E16] text-white'
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                  {language === 'bn' ? 'পণ্য ক্যাটালগ ও স্টক' : 'Product Inventory'}
                </h3>
                <p className="text-xs text-stone-500">Manage prices, discounts, and inventory stocks</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-[#E5A000] text-[#4A2E16] text-xs font-bold rounded-xl hover:bg-[#D48F00] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'পণ্য যোগ' : 'Add Item'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3 font-semibold">Image</th>
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Regular</th>
                    <th className="p-3 font-semibold">Sale Price</th>
                    <th className="p-3 font-semibold">Stock</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="p-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-[#4A2E16]">{prod.nameBn}</p>
                        <p className="text-[10px] text-stone-400">{prod.name}</p>
                      </td>
                      <td className="p-3 text-stone-600">{prod.categoryNameBn}</td>
                      <td className="p-3 font-mono text-stone-400 line-through">৳{prod.regularPrice}</td>
                      <td className="p-3 font-mono font-bold text-[#E5A000]">৳{prod.salePrice}</td>
                      <td className="p-3 font-mono">
                        <span
                          className={`font-bold ${
                            prod.stock <= 5 ? 'text-rose-600' : 'text-stone-800'
                          }`}
                        >
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-stone-600 hover:text-[#4A2E16] hover:bg-stone-100 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & DISCOUNTS */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Create Coupon Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'নতুন কুপন তৈরি করুন' : 'Create New Coupon'}
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPECIAL25"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full uppercase font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Discount (%) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Min Order (৳) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(Number(e.target.value))}
                      className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4A2E16] text-[#FFF9EC] font-bold rounded-lg hover:bg-[#382210] transition-colors"
                >
                  {language === 'bn' ? 'কুপন যোগ করুন' : 'Add Coupon'}
                </button>
              </form>
            </div>

            {/* Coupons List (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'সক্রিয় কুপনসমূহ' : 'Active Promo Coupons'}
              </h3>

              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-stone-200 text-[#4A2E16]">
                        {c.code}
                      </span>
                      <p className="text-[11px] text-stone-600 mt-1">
                        {c.discountValue}{c.discountType === 'percentage' ? '%' : '৳'} Discount (Min ৳{c.minOrder})
                      </p>
                    </div>

                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DELIVERY RIDERS */}
        {activeTab === 'delivery' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'গাইবান্ধা ডেলিভারি রাইডার টিম' : 'Gaibandha Delivery Fleet'}
              </h3>
              <p className="text-xs text-stone-500">Field riders assigned for express delivery</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {deliveryStaff.map((staff) => (
                <div key={staff.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A2E16] text-[#E5A000] flex items-center justify-center font-bold text-sm">
                      🚴
                    </div>
                    <div>
                      <p className="font-bold text-[#4A2E16]">{staff.name}</p>
                      <p className="text-stone-500">{staff.phone}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-600">
                    <p>📍 Area: {staff.area}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {staff.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 max-w-2xl space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'স্টোর কনফিগারেশন ও ডেলিভারি ফি' : 'Store Configuration'}
              </h3>
              <p className="text-xs text-stone-500">Configure delivery thresholds and top banner message</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Gaibandha Delivery (৳)
                  </label>
                  <input
                    type="number"
                    value={chargeGaibandha}
                    onChange={(e) => setChargeGaibandha(Number(e.target.value))}
                    className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Outside Gaibandha (৳)
                  </label>
                  <input
                    type="number"
                    value={chargeOutside}
                    onChange={(e) => setChargeOutside(Number(e.target.value))}
                    className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Free Delivery Above (৳)
                  </label>
                  <input
                    type="number"
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(Number(e.target.value))}
                    className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Announcement Text (Bengali)
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E5A000] text-[#4A2E16] font-bold rounded-xl hover:bg-[#D48F00] transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-[#4A2E16]">
                {editingProductId ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameBn}
                    onChange={(e) => setProductForm({ ...productForm, nameBn: e.target.value })}
                    className="w-full bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={productForm.regularPrice}
                    onChange={(e) => setProductForm({ ...productForm, regularPrice: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Sale Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={productForm.descriptionBn}
                  onChange={(e) => setProductForm({ ...productForm, descriptionBn: e.target.value })}
                  className="w-full bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFlashSale}
                    onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                    className="accent-[#E5A000]"
                  />
                  <span>Flash Sale Offer</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="accent-[#E5A000]"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E5A000] text-[#4A2E16] font-bold rounded-lg hover:bg-[#D48F00]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
