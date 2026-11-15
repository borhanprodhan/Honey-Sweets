import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Gift, Zap, Truck, Check, Copy, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const OffersView: React.FC = () => {
  const {
    products,
    coupons,
    applyCoupon,
    appliedCoupon,
    language,
    setCurrentView,
    openBuyNow,
  } = useStore();

  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleApply = (code: string) => {
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const offerProducts = products.filter((p) => p.isFlashSale || (p.discountPercentage && p.discountPercentage > 0));
  const comboProducts = products.filter((p) => p.categoryId === 'cat-gift-boxes');

  return (
    <div className="py-8 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Banner for Offers */}
        <div className="bg-gradient-to-r from-[#4A2E16] via-[#633E1D] to-[#4A2E16] rounded-3xl p-8 text-[#FFF9EC] shadow-xl border border-[#E5A000]/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5A000] text-[#4A2E16] text-xs font-extrabold rounded-full">
              <Zap className="w-3.5 h-3.5 fill-[#4A2E16]" />
              {language === 'bn' ? 'বিশেষ ডিসকাউন্ট ক্যাম্পেইন' : 'Exclusive Savings'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif-title">
              {language === 'bn' ? 'মধুর উৎসব ও মিষ্টির সেরা অফার' : 'Honey Festival & Sweet Deals'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg">
              {language === 'bn'
                ? 'গাইবান্ধায় ১ ঘণ্টার এক্সপ্রেস ডেলিভারি এবং সকল অর্ডারে মেগা ডিসকাউন্ট কুপন কোড ব্যবহার করুন।'
                : 'Enjoy express 1-hour delivery in Gaibandha and apply verified discount coupons for maximum savings.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center z-10 shrink-0">
            <p className="text-xs text-[#E5A000] font-semibold uppercase tracking-wider">
              {language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Maximum Discount'}
            </p>
            <p className="text-3xl font-extrabold font-mono text-white mt-1">25% OFF</p>
            <p className="text-[11px] text-white/70 mt-1">
              {language === 'bn' ? 'সীমিত স্টক থাকা পর্যন্ত' : 'While stocks last'}
            </p>
          </div>
        </div>

        {/* Coupons Showcase */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#E5A000]" />
            <h2 className="text-xl font-bold font-serif-title text-[#4A2E16]">
              {language === 'bn' ? 'আজকের সেরা ভাউচার ও কুপন কোড' : 'Available Discount Coupons'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isApplied
                      ? 'bg-[#E5A000]/15 border-[#E5A000] shadow-sm'
                      : 'bg-white border-stone-200 hover:border-[#E5A000]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm bg-stone-100 text-[#4A2E16] px-2.5 py-1 rounded-lg border border-stone-200">
                        {coupon.code}
                      </span>
                      <span className="text-xs font-bold text-[#E5A000]">
                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '৳'} OFF
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-stone-800">
                      {language === 'bn' ? coupon.titleBn : coupon.titleEn}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {language === 'bn'
                        ? `সর্বনিম্ন ৳${coupon.minOrder} টাকার অর্ডারে প্রযোজ্য`
                        : `Valid on orders above ৳${coupon.minOrder}`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleApply(coupon.code)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#4A2E16] text-[#FFF9EC] hover:bg-[#382210]'
                    }`}
                  >
                    {copiedCode === coupon.code || isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'কুপন সক্রিয় আছে' : 'Coupon Applied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'ব্যবহার করুন' : 'Claim Coupon'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discount Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'ডিসকাউন্টের মধু ও মিষ্টি' : 'Special Discounted Items'}
              </h2>
              <p className="text-xs text-stone-500">Instant "Buy Now" enabled on all items</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Combos & Gift Boxes Banner */}
        {comboProducts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-stone-200">
            <div>
              <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
                Festive Collection
              </span>
              <h2 className="text-xl font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'উপহার ও উৎসব কম্বো প্যাকেজ' : 'Festive Gift Combos'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comboProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
