import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroSection } from './HeroSection';
import { FlashSaleSection } from './FlashSaleSection';
import { CategoryShowcase } from './CategoryShowcase';
import { ProductCard } from './ProductCard';
import {
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  ArrowRight,
  Star,
  Quote,
  CheckCircle,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, reviews, language, setCurrentView, openBuyNow } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);

  // Pick first featured combo for mid-page spotlight
  const comboSpotlight = products.find((p) => p.id === 'prod-honey-sweets-combo') || products[0] || null;

  return (
    <div className="space-y-4">
      {/* 1. Large Hero Section */}
      <HeroSection />

      {/* 2. Flash Sale Section with Countdown & Coupons */}
      <FlashSaleSection />

      {/* 3. Category Showcase Grid */}
      <CategoryShowcase />

      {/* 4. Featured Best Sellers Grid */}
      <section className="py-12 bg-white border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
                {language === 'bn' ? 'গ্রাহকদের পছন্দের তালিকায় শীর্ষ' : 'Top Customer Favorites'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#4A2E16] mt-1">
                {language === 'bn' ? 'বেস্ট সেলিং মধু ও মিষ্টি' : 'Best Selling Products'}
              </h2>
            </div>

            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-[#E5A000] hover:text-[#C98200] flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
            >
              <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'View Full Catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Signature Combo Promotional Spotlight Banner */}
      {comboSpotlight && (
      <section className="py-10 bg-[#FFF9EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E5A000]/40 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-6 p-8 sm:p-10 space-y-4">
              <span className="inline-block px-3 py-1 bg-[#E5A000]/20 text-[#4A2E16] text-xs font-extrabold rounded-md">
                {language === 'bn' ? '👑 বিশেষ উৎসবের সেরা কম্বো' : '👑 Signature Celebration Box'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#4A2E16] leading-tight">
                {language === 'bn' ? comboSpotlight.nameBn : comboSpotlight.name}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {language === 'bn'
                  ? 'সুন্দরবনের খাঁটি বুনো মধু এবং গাইবান্ধার কারিগরদের তৈরি ঐতিহ্যবাহী নরম রসগোল্লা ও কালোজাম নিয়ে তৈরি এই রাজকীয় কম্বো বক্স। পারিবারিক আয়োজন ও উপহারের জন্য সেরা পছন্দ।'
                  : 'An opulent pairing of pure raw Sundarbans forest honey and freshly crafted cow milk chhana sweets packaged in a luxury gift box.'}
              </p>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-bold text-[#E5A000] font-mono">
                  ৳{comboSpotlight.salePrice}
                </span>
                <span className="text-sm text-stone-400 line-through font-mono">
                  ৳{comboSpotlight.regularPrice}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Shipping'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openBuyNow(comboSpotlight)}
                  className="px-6 py-3 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-[#4A2E16]" />
                  <span>{language === 'bn' ? 'সরাসরি কিনুন (Buy Now)' : 'Buy Now'}</span>
                </button>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  {language === 'bn' ? 'বিস্তারিত দেখুন' : 'Learn More'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-full min-h-[300px] relative bg-stone-100">
              <img
                src={comboSpotlight.images[0]}
                alt={comboSpotlight.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>
      </section>
      )}

      {/* 6. Why Choose Honey-Sweets */}
      <section className="py-12 bg-white border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
              {language === 'bn' ? 'কেন আমরাই সেরা' : 'Why Honey-Sweets'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#4A2E16]">
              {language === 'bn' ? 'বিশুদ্ধতা ও বিশ্বাসের নিশ্চয়তা' : 'Purity, Trust & Speed'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E16]">
                {language === 'bn' ? '১০০% ল্যাব টেস্টেড' : '100% Lab Tested'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'bn'
                  ? 'চিনি বা ভেজালমুক্ত প্রাকৃতিক মধুর শতভাগ নিশ্চয়তা।'
                  : 'Certified pure raw honey without added syrup or chemicals.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E16]">
                {language === 'bn' ? 'গাইবান্ধায় ১ ঘণ্টায় ডেলিভারি' : '1-Hour Gaibandha Delivery'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'bn'
                  ? 'কলেজ রোড ও সদর এলাকায় দ্রুততম হোম ডেলিভারি রাইডার।'
                  : 'Fast doorstep delivery by our dedicated local fleet.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E16]">
                {language === 'bn' ? 'খাঁটি গরুর দুধের ছানা' : 'Pure Cow Chhana'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'bn'
                  ? 'প্রতিদিন সকালে তাজা ছানা ও গাওয়া ঘিয়ে প্রস্তুত মিষ্টি।'
                  : 'Crafted fresh daily using authentic village cow milk.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#4A2E16]">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'bn'
                  ? 'পণ্য যাচাই করে মূল্য পরিশোধের ১০০% নিরাপদ সুবিধা।'
                  : 'Inspect package upon delivery and pay with confidence.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="py-12 bg-stone-50/60 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
              {language === 'bn' ? 'গ্রাহকদের রিভিউ' : 'Verified Reviews'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#4A2E16]">
              {language === 'bn' ? 'গ্রাহকদের অভিজ্ঞতা ও ভালোবাসা' : 'What Our Customers Say'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#4A2E16]">{rev.userName}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified Buyer</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
