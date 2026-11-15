import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Truck,
  ArrowRight,
  Zap,
  Phone,
  Mail,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    language,
    setCurrentView,
    setTrackedOrder,
    setIsTrackingModalOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  const customerOrders = orders.filter((o) => o.customerId === currentUser.id || o.customerId === 'cust-demo-1');
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleTrack = (ord: any) => {
    setTrackedOrder(ord);
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="py-8 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E5A000] to-[#4A2E16] text-white flex items-center justify-center font-bold text-xl shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif-title text-[#4A2E16]">
                {currentUser.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#E5A000]" />
                  <span>{currentUser.phone}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#E5A000]" />
                  <span>{currentUser.email}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('shop')}
              className="px-4 py-2 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              {language === 'bn' ? 'কেনাকাটা করুন' : 'Shop Now'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-[#4A2E16] text-[#FFF9EC]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            📦 {language === 'bn' ? `আমার অর্ডারসমূহ (${customerOrders.length})` : `My Orders (${customerOrders.length})`}
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#4A2E16] text-[#FFF9EC]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            ❤️ {language === 'bn' ? `উইশলিস্ট (${wishlistedProducts.length})` : `Wishlist (${wishlistedProducts.length})`}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-[#4A2E16] text-[#FFF9EC]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            📍 {language === 'bn' ? 'ঠিকানা ও প্রোফাইল' : 'Address & Profile'}
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {customerOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
                <p>{language === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই।' : 'No orders found yet.'}</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="mt-3 px-4 py-2 bg-[#E5A000] text-[#4A2E16] font-bold rounded-lg"
                >
                  {language === 'bn' ? 'পণ্য কিনুন' : 'Explore Products'}
                </button>
              </div>
            ) : (
              customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#4A2E16]">
                          {ord.trackingId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A000]/20 text-[#4A2E16]">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD', { dateStyle: 'long' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#E5A000]">
                        ৳{ord.total}
                      </span>
                      <button
                        onClick={() => handleTrack(ord)}
                        className="px-3 py-1.5 bg-[#4A2E16] text-[#FFF9EC] text-xs font-semibold rounded-lg hover:bg-[#382210] flex items-center gap-1.5 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#E5A000]" />
                        <span>{language === 'bn' ? 'ট্র্যাক করুন' : 'Track'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-2 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-stone-700">
                        <div className="flex items-center gap-2">
                          <img
                            src={it.product.images[0]}
                            alt={it.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <p className="font-bold">{language === 'bn' ? it.product.nameBn : it.product.name}</p>
                            <span className="text-[11px] text-stone-400">
                              {it.quantity}x {it.selectedWeight}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[#4A2E16]">
                          ৳{it.unitPrice * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    📍 ডেলিভারি ঠিকানা: {ord.customerDetails.fullAddress}, {ord.customerDetails.upazila}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
                <p>{language === 'bn' ? 'উইশলিস্টে কোনো পণ্য নেই।' : 'No wishlisted products.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-xl shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-bold font-serif-title text-[#4A2E16]">
              {language === 'bn' ? 'ডেলিভারি ঠিকানা ও প্রোফাইল' : 'Saved Shipping Profile'}
            </h3>
            <div className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">নাম:</span>
                <span className="font-bold text-stone-800">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ফোন:</span>
                <span className="font-bold text-stone-800">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ইমেইল:</span>
                <span className="font-bold text-stone-800">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ঠিকানা:</span>
                <span className="font-bold text-stone-800 text-right">{currentUser.address}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
