import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Clock, Zap, ShoppingBag, Eye, Heart, Copy, Check } from 'lucide-react';
import { Product } from '../types';

export const FlashSaleSection: React.FC = () => {
  const {
    products,
    language,
    flashSaleEndsAt,
    addToCart,
    openBuyNow,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist,
    coupons,
    applyCoupon,
    appliedCoupon,
  } = useStore();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = flashSaleEndsAt.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleEndsAt]);

  const flashSaleProducts = products.filter((p) => p.isFlashSale);

  const handleCopyApply = (code: string) => {
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-10 bg-[#FFF9EC]/40 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Flash Sale Header Banner */}
        <div className="bg-gradient-to-r from-[#4A2E16] via-[#5C381A] to-[#4A2E16] rounded-2xl p-5 sm:p-6 text-[#FFF9EC] shadow-md border border-[#E5A000]/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#E5A000]">
              <Zap className="w-4 h-4 fill-[#E5A000]" />
              <span>{language === 'bn' ? 'সীমিত সময়ের অফার' : 'Limited Time Offer'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-title">
              {language === 'bn' ? '🔥 মেগা ফ্ল্যাশ সেল ও ডিসকাউন্ট' : '🔥 Mega Flash Sale Deals'}
            </h2>
            <p className="text-xs text-white/80 max-w-md">
              {language === 'bn'
                ? 'খাঁটি সুন্দরবন মধু ও মিষ্টিতে সর্বোচ্চ ২৫% পর্যন্ত বিশেষ মূল্যছাড়! দ্রুত স্টক শেষ হওয়ার আগেই অর্ডার করুন।'
                : 'Up to 25% OFF on pure forest honey and authentic Bengali sweets. Stock is limited!'}
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 text-center shrink-0">
            <span className="text-xs font-medium text-white/70 mr-2 hidden sm:inline flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E5A000]" />
              {language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Ends in:'}
            </span>

            <div className="flex items-center gap-2">
              <div className="bg-[#2E1A0B] border border-[#E5A000]/40 px-3 py-2 rounded-xl min-w-[52px]">
                <span className="font-mono text-lg font-bold text-[#E5A000]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">
                  {language === 'bn' ? 'ঘণ্টা' : 'Hrs'}
                </span>
              </div>
              <span className="text-lg font-bold text-[#E5A000]">:</span>
              <div className="bg-[#2E1A0B] border border-[#E5A000]/40 px-3 py-2 rounded-xl min-w-[52px]">
                <span className="font-mono text-lg font-bold text-[#E5A000]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">
                  {language === 'bn' ? 'মিনিট' : 'Mins'}
                </span>
              </div>
              <span className="text-lg font-bold text-[#E5A000]">:</span>
              <div className="bg-[#2E1A0B] border border-[#E5A000]/40 px-3 py-2 rounded-xl min-w-[52px]">
                <span className="font-mono text-lg font-bold text-[#E5A000]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">
                  {language === 'bn' ? 'সেকেন্ড' : 'Secs'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Strip (Instant 1-Click Apply) */}
        <div className="mb-8">
          <p className="text-xs font-bold text-[#4A2E16] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A000]" />
            <span>{language === 'bn' ? 'বিশেষ ডিসকাউন্ট কুপন কোড (ক্লিক করে ব্যবহার করুন):' : 'Active Promo Coupons (Click to Apply):'}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {coupons.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isApplied
                      ? 'bg-[#E5A000]/15 border-[#E5A000] shadow-sm'
                      : 'bg-white border-stone-200/80 hover:border-[#E5A000]/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs bg-stone-100 text-[#4A2E16] px-2 py-0.5 rounded border border-stone-200">
                        {coupon.code}
                      </span>
                      {isApplied && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {language === 'bn' ? 'প্রযুক্ত' : 'Applied'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 truncate mt-1">
                      {language === 'bn' ? coupon.titleBn : coupon.titleEn}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyApply(coupon.code)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#4A2E16] text-[#FFF9EC] hover:bg-[#382210]'
                    }`}
                  >
                    {copiedCode === coupon.code || isApplied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{language === 'bn' ? 'প্রযুক্ত' : 'Applied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{language === 'bn' ? 'ক্লেম' : 'Apply'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flash Sale Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => {
            const isWish = isInWishlist(product.id);
            const stockPercent = Math.min(100, Math.round((product.stock / 30) * 100));

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Discount percentage tag */}
                  {product.discountPercentage && (
                    <span className="absolute top-2.5 left-2.5 bg-[#E5A000] text-[#4A2E16] text-[11px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                      {product.discountPercentage}% OFF
                    </span>
                  )}

                  {/* Actions overlay (Quick View & Wishlist) */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors ${
                        isWish ? 'text-rose-500' : 'text-stone-600 hover:text-rose-500'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-stone-600 hover:text-[#4A2E16] transition-colors"
                      aria-label="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] text-[#A66E38] font-semibold uppercase tracking-wider block">
                      {language === 'bn' ? product.categoryNameBn : product.categoryName}
                    </span>
                    <h3 className="text-sm font-bold text-[#4A2E16] hover:text-[#E5A000] transition-colors line-clamp-1 mt-0.5">
                      {language === 'bn' ? product.nameBn : product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-extrabold text-[#E5A000] font-mono">
                        ৳{product.salePrice}
                      </span>
                      {product.regularPrice > product.salePrice && (
                        <span className="text-xs text-stone-400 line-through font-mono">
                          ৳{product.regularPrice}
                        </span>
                      )}
                      <span className="text-[11px] text-stone-500 ml-auto">
                        ({product.weight})
                      </span>
                    </div>

                    {/* Stock Urgency Indicator */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex justify-between text-[10px] text-stone-500">
                        <span>
                          {language === 'bn'
                            ? `স্টক অবশিষ্ট: ${product.stock} টি`
                            : `Stock: ${product.stock} units`}
                        </span>
                        <span className="text-amber-700 font-semibold">
                          {product.stock <= 5 ? (language === 'bn' ? 'দ্রুত ফুরিয়ে যাচ্ছে' : 'Low Stock') : ''}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#E5A000] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(15, stockPercent))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons: Buy Now & Add to Cart */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => openBuyNow(product)}
                      className="w-full py-2 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-[#4A2E16]" />
                      <span>{language === 'bn' ? 'সরাসরি কিনুন' : 'Buy Now'}</span>
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 bg-[#4A2E16] hover:bg-[#382210] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#E5A000]" />
                      <span>{language === 'bn' ? 'কার্টে যোগ' : 'Add Cart'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
