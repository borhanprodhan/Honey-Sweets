import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, Sparkles, ArrowRight, Award } from 'lucide-react';
import { ASSETS } from '../assets/images';

export const HeroSection: React.FC = () => {
  const { language, setCurrentView } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EC] to-[#FFFDF9] pt-6 pb-12 lg:py-16 border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quiet text kicker with typographic dot separator */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66E38]">
              <span>{language === 'bn' ? 'গাইবান্ধার ঐতিহ্য ও বিশুদ্ধতা' : 'Gaibandha Heritage & Purity'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#E5A000] font-bold">100% Natural Guaranteed</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#4A2E16] font-serif-title leading-[1.15] text-balance">
              {language === 'bn' ? (
                <>
                  প্রকৃতির খাঁটি মিষ্টতা, <br className="hidden sm:inline" />
                  <span className="text-[#E5A000]">আপনার দ্বারে সরাসরি</span>
                </>
              ) : (
                <>
                  Discover the Sweetness <br className="hidden sm:inline" />
                  <span className="text-[#E5A000]">of Pure Raw Nature</span>
                </>
              )}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              {language === 'bn'
                ? 'সুন্দরবনের ১০০% খাঁটি বুনো মধু এবং দেশি গরুর খাঁটি দুধের ছানায় তৈরি ঐতিহ্যবাহী টাটকা রসগোল্লা ও রাজকীয় মিষ্টি। গাইবান্ধায় দ্রুততম হোম ডেলিভারি ও সারাদেশে কুরিয়ার সার্ভিস।'
                : 'Experience artisanal raw forest honey, authentic cow milk chhana sweets, and commemorative gift boxes delivered straight from College Road, Gaibandha to your doorstep.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('shop')}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#4A2E16] hover:bg-[#382210] rounded-xl shadow-md shadow-[#4A2E16]/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{language === 'bn' ? 'মিষ্টি ও মধু কিনুন' : 'Explore Catalog'}</span>
                <ArrowRight className="w-4 h-4 text-[#E5A000] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('offers')}
                className="px-6 py-3.5 text-sm font-semibold text-[#4A2E16] bg-[#E5A000]/15 hover:bg-[#E5A000]/25 border border-[#E5A000]/40 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E5A000]" />
                <span>{language === 'bn' ? 'আজকের মেগা অফার' : 'Flash Sale Deals'}</span>
              </button>
            </div>

            {/* 3 Trust Markers Strip */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0D4] flex items-center justify-center shrink-0 text-[#E5A000]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[#4A2E16] text-xs">
                    {language === 'bn' ? 'ল্যাব টেস্টে শতভাগ খাঁটি' : '100% Lab Tested'}
                  </h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {language === 'bn' ? 'চিনি বা প্রিজারভেটিভমুক্ত' : 'Zero added sugar'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0D4] flex items-center justify-center shrink-0 text-[#E5A000]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[#4A2E16] text-xs">
                    {language === 'bn' ? 'এক্সপ্রেস হোম ডেলিভারি' : 'Express Delivery'}
                  </h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {language === 'bn' ? 'গাইবান্ধায় ১ ঘণ্টায় ডেলিভারি' : 'Fast 1-hour in Gaibandha'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0D4] flex items-center justify-center shrink-0 text-[#E5A000]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-[#4A2E16] text-xs">
                    {language === 'bn' ? 'প্রতিদিন ফ্রেশ মিষ্টি' : 'Daily Fresh Chhana'}
                  </h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {language === 'bn' ? 'খাঁটি গাওয়া ঘি ও ছানা' : 'Authentic taste'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] group">
              <img
                src={ASSETS.heroHoneySweets}
                alt="Honey-Sweets Pure Honey & Artisanal Sweets"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Float badge bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200/60 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                    {language === 'bn' ? 'আজকের স্পেশাল বান্ডেল' : 'Featured Combo Box'}
                  </p>
                  <p className="text-xs font-bold text-[#4A2E16]">
                    {language === 'bn' ? 'সুন্দরবন মধু + খাঁটি রসগোল্লা' : 'Sundarbans Honey + Roshogolla'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 line-through mr-1 font-mono">৳১,৫৫০</span>
                  <span className="text-sm font-bold text-[#E5A000] font-mono">৳১,২৫০</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
