import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setCurrentView, settings, setIsTrackingModalOpen } = useStore();

  const handleNav = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2E1A0B] text-[#FFF9EC] border-t border-[#4A2E16] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E5A000] to-[#C98200] flex items-center justify-center text-white font-bold font-serif text-sm">
                HS
              </div>
              <span className="text-xl font-bold font-serif-title tracking-tight text-white">
                Honey-Sweets
              </span>
            </div>

            <p className="text-white/70 text-xs leading-relaxed max-w-sm">
              {language === 'bn'
                ? 'সুন্দরবনের ১০০% খাঁটি বুনো মধু এবং দেশি গরুর খাঁটি দুধের ছানায় প্রস্তুত ঐতিহ্যবাহী তাজা রসগোল্লা ও রাজকীয় মিষ্টির বিশ্বস্ত ঠিকানা।'
                : 'Authentic 100% pure raw Sundarbans forest honey and traditional fresh Bengali sweets delivered to your door from College Road, Gaibandha.'}
            </p>

            <div className="pt-2 text-[11px] text-[#E5A000] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? '১০০% বিশুদ্ধ ও নিরাপদ ডেলিভারি নিশ্চয়তা' : '100% Pure & Safe Delivery'}</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#E5A000] transition-colors">
                  {language === 'bn' ? 'হোম পেইজ' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-[#E5A000] transition-colors">
                  {language === 'bn' ? 'সব পণ্য ক্যাটালগ' : 'Shop All Products'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('offers')} className="hover:text-[#E5A000] transition-colors">
                  {language === 'bn' ? 'ফ্ল্যাশ সেল ও অফার' : 'Offers & Deals'}
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackingModalOpen(true)} className="hover:text-[#E5A000] transition-colors">
                  {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#E5A000] transition-colors">
                  {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'bn' ? 'গ্রাহক সেবা ও নীতি' : 'Customer Care'}
            </h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <button onClick={() => handleNav('customer-dashboard')} className="hover:text-[#E5A000] transition-colors">
                  {language === 'bn' ? 'কাস্টমার প্রোফাইল ও হিস্টোরি' : 'My Account & Orders'}
                </button>
              </li>
              <li>
                <span className="hover:text-[#E5A000] cursor-pointer">
                  {language === 'bn' ? 'রিটার্ন ও রিফান্ড পলিসি' : 'Return & Refund Policy'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#E5A000] cursor-pointer">
                  {language === 'bn' ? 'প্রাইভেসি ও শর্তাবলী' : 'Privacy & Terms'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#E5A000] cursor-pointer">
                  {language === 'bn' ? 'পেমেন্ট ও ডেলিভারি নির্দেশিকা' : 'Payment & Delivery Info'}
                </span>
              </li>
            </ul>
          </div>

          {/* Gaibandha Address & Hotline (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'bn' ? 'ঠিকানা ও হেল্পলাইন' : 'Contact & Address'}
            </h3>
            <div className="space-y-2 text-white/70 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5A000] shrink-0 mt-0.5" />
                <span>{settings.businessAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E5A000] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#E5A000]">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E5A000] shrink-0" />
                <span>support@honeysweets.com.bd</span>
              </p>
            </div>

            {/* Payment Method Badges */}
            <div className="pt-2">
              <span className="text-[10px] text-white/50 block mb-1.5 uppercase">
                {language === 'bn' ? 'স্বীকৃত পেমেন্ট মাধ্যম:' : 'Payment Methods:'}
              </span>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="px-2 py-1 bg-white/10 rounded border border-white/15 text-[#E2136E]">
                  bKash
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/15 text-orange-400">
                  Nagad
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/15 text-emerald-400">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/50">
          <p>© 2026 Honey-Sweets · College Road, Gaibandha, Bangladesh. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('admin-dashboard')} className="hover:text-white/80">
              Admin Portal
            </button>
            <span>·</span>
            <button onClick={() => handleNav('delivery-dashboard')} className="hover:text-white/80">
              Rider Dispatch
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
