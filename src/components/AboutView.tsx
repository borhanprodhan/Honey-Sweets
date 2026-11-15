import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Award } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { language, settings, setCurrentView } = useStore();

  return (
    <div className="py-10 bg-[#FFFDF9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A66E38]">
            {language === 'bn' ? 'আমাদের গল্প ও ঐতিহ্য' : 'Our Story & Heritage'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-title text-[#4A2E16]">
            Honey-Sweets
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'গাইবান্ধার কলেজ রোড থেকে শুরু হওয়া প্রকৃতির খাঁটি বুনো মধু এবং শতাব্দী প্রাচীন বাঙালি মিষ্টির নির্ভরযোগ্য ঠিকানা।'
              : 'Born on College Road, Gaibandha, dedicated to delivering 100% pure raw forest honey and freshly crafted authentic Bengali sweets.'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#4A2E16]">
              {language === 'bn' ? 'সুন্দরবনের খাঁটি মধু' : 'Forest Raw Honey'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'bn'
                ? 'মৌয়ালদের হাত থেকে সরাসরি সংগৃহীত। কোনো প্রকার কৃত্রিম চিনি বা তাপ প্রয়োগ ছাড়া প্রাকৃতিকভাবে বোতলজাত।'
                : 'Directly sourced from Sundarbans forest beekeepers without pasteurization or added sugar syrup.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#4A2E16]">
              {language === 'bn' ? 'শতভাগ দেশি ছানার মিষ্টি' : 'Authentic Cow Chhana'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'bn'
                ? 'প্রতিদিন প্রত্যুষে স্থানীয় খামারের খাঁটি গরুর দুধ থেকে ছানা তৈরি করে অভিজ্ঞ কারিগরদের দ্বারা মিষ্টান্ন প্রস্তুত করা হয়।'
                : 'Handmade daily from fresh dairy cow milk chhana, pure cow ghee, and aromatic green cardamom.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9EC] text-[#E5A000] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#4A2E16]">
              {language === 'bn' ? 'গাইবান্ধায় ১ ঘণ্টায় ডেলিভারি' : 'Express Delivery'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'bn'
                ? 'গাইবান্ধা সদর ও কলেজ রোডে ১ ঘণ্টার মধ্যে ফ্রেশ হোম ডেলিভারি এবং দেশের ৬৪ জেলায় দ্রুততম কুরিয়ার সেবা।'
                : 'Fast 1-hour home delivery inside Gaibandha Sadar and reliable courier packaging across Bangladesh.'}
            </p>
          </div>
        </div>

        {/* Contact Information & Store Location */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
                {language === 'bn' ? 'যোগাযোগ ও বিক্রয়কেন্দ্র' : 'Store Location & Contact'}
              </span>
              <h2 className="text-2xl font-bold font-serif-title text-[#4A2E16]">
                {settings.storeName}
              </h2>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E5A000] shrink-0 mt-0.5" />
                  <span>{settings.businessAddress}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#E5A000] shrink-0" />
                  <span>{settings.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#E5A000] shrink-0" />
                  <span>support@honeysweets.com.bd</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#E5A000] shrink-0" />
                  <span>{language === 'bn' ? 'প্রতিদিন সকাল ৮:০০ - রাত ১০:০০' : 'Daily: 8:00 AM - 10:00 PM'}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-2.5 bg-[#4A2E16] text-[#FFF9EC] text-xs font-semibold rounded-xl hover:bg-[#382210] transition-colors"
                >
                  {language === 'bn' ? 'পণ্যসমূহ ব্রাউজ করুন' : 'Browse Store Products'}
                </button>
              </div>
            </div>

            {/* Visual Storefront Card */}
            <div className="p-6 bg-[#FFF9EC] rounded-2xl border border-[#E5A000]/30 space-y-3 text-xs text-stone-700">
              <h3 className="font-bold text-sm text-[#4A2E16]">
                {language === 'bn' ? 'আমাদের অঙ্গীকার ও নিশ্চয়তা' : 'Our Quality Commitment'}
              </h3>
              <p className="leading-relaxed">
                {language === 'bn'
                  ? 'আমরা বিশ্বাস করি ভালো খাদ্যই সুস্বাস্থ্য ও তৃপ্তির মূল। Honey-Sweets কখনো পণ্যের গুণমানে ছাড় দেয় না। প্রতিটি মধু খাঁটি কি না পরীক্ষা করে নেওয়া হয় এবং কোনো রাসায়নিক উপাদান ব্যবহার করা হয় না।'
                  : 'We never compromise on purity. Our honey is tested for raw botanical enzymes, and our sweets are cooked fresh every single morning.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-[#4A2E16] font-semibold">
                <span>📍 College Road, Gaibandha, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
