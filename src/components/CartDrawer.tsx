import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Truck,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    calculateCartSummary,
    language,
    setCurrentView,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const {
    subtotal,
    discount,
    deliveryCharge,
    total,
    qualifiesForFreeDelivery,
    remainingForFreeDelivery,
  } = calculateCartSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeDeliveryPercent = Math.min(
    100,
    Math.round((subtotal / settings.freeDeliveryThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#4A2E16] text-[#FFF9EC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E5A000]" />
              <h2 className="text-base font-bold font-serif-title">
                {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
              </h2>
              <span className="text-xs bg-[#E5A000] text-[#4A2E16] font-mono font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FFF9EC] p-3 border-b border-[#E5A000]/20 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-stone-700">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#E5A000]" />
                {qualifiesForFreeDelivery ? (
                  <span className="text-emerald-700 font-bold">
                    {language === 'bn'
                      ? '🎉 অভিনন্দন! আপনার ডেলিভারি চার্জ একদম ফ্রি!'
                      : '🎉 Congratulations! You unlocked FREE Delivery!'}
                  </span>
                ) : (
                  <span>
                    {language === 'bn'
                      ? `আর মাত্র ৳${remainingForFreeDelivery} টাকার অর্ডারে ফ্রি ডেলিভারি!`
                      : `Add ৳${remainingForFreeDelivery} more for FREE Delivery!`}
                  </span>
                )}
              </span>
              <span className="font-mono font-bold text-stone-500">{freeDeliveryPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E5A000] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-stone-700">
                  {language === 'bn' ? 'আপনার কার্ট এখন খালি!' : 'Your cart is empty!'}
                </p>
                <p className="text-xs text-stone-400 max-w-xs">
                  {language === 'bn'
                    ? 'আমাদের খাঁটি সুন্দরবন মধু ও মিষ্টি সংগ্রহ থেকে পছন্দের আইটেম বেছে নিন।'
                    : 'Explore our pure honey and traditional sweets to add items.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-4 py-2 bg-[#E5A000] text-[#4A2E16] text-xs font-bold rounded-lg hover:bg-[#D48F00] transition-colors"
                >
                  {language === 'bn' ? 'পণ্য দেখুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="flex gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 items-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#4A2E16] truncate">
                      {language === 'bn' ? item.product.nameBn : item.product.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 block">
                      {item.selectedWeight} · <span className="font-mono font-semibold text-[#E5A000]">৳{item.unitPrice}</span>
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedWeight, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedWeight, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-[#4A2E16]">
                      ৳{item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Total */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-4">
              
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono font-bold">{appliedCoupon.code}</span>
                      <span>({appliedCoupon.discountValue}{appliedCoupon.discountType === 'percentage' ? '%' : '৳'} ছাড়)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:text-rose-700 font-semibold text-[11px]"
                    >
                      {language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={language === 'bn' ? 'কুপন কোড (যেমন: HONEY10)' : 'Coupon Code (e.g. HONEY10)'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 uppercase font-mono focus:outline-none focus:border-[#E5A000]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#4A2E16] text-[#FFF9EC] rounded-lg text-xs font-semibold hover:bg-[#382210] transition-colors shrink-0"
                    >
                      {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{language === 'bn' ? 'উপ-মোট:' : 'Subtotal:'}</span>
                  <span className="font-mono font-semibold text-stone-800">৳{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট:' : 'Discount:'}</span>
                    <span className="font-mono font-semibold">-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ (গাইবান্ধা):' : 'Estimated Delivery:'}</span>
                  <span className="font-mono font-semibold text-stone-800">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `৳${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-[#4A2E16]">
                  <span>{language === 'bn' ? 'সর্বমোট বিল:' : 'Total Payable:'}</span>
                  <span className="font-mono text-[#E5A000]">৳{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'bn' ? 'চেকআউটে এগিয়ে যান' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
