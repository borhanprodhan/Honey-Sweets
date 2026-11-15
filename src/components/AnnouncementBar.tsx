import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, ShieldCheck, MapPin, Globe, UserCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { language, setLanguage, currentUser, switchRole, settings } = useStore();

  return (
    <div className="bg-[#4A2E16] text-[#FFF9EC] text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Location & Delivery Guarantee */}
        <div className="flex items-center gap-3 overflow-hidden text-center md:text-left">
          <span className="flex items-center gap-1.5 font-medium text-[#E5A000] shrink-0">
            <MapPin className="w-3.5 h-3.5" />
            <span>গাইবান্ধা / Gaibandha</span>
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="truncate text-white/90">
            {language === 'bn' ? settings.announcementBn : settings.announcementEn}
          </span>
        </div>

        {/* Right: Phone, Role Switcher (Customer/Admin/Rider) & Language Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={`tel:${settings.phone}`}
            className="hidden lg:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-[#E5A000]" />
            <span>{settings.phone}</span>
          </a>

          {/* Quick Role Switcher for seamless preview and testing */}
          <div className="flex items-center gap-1 bg-[#2E1A0B] px-2 py-0.5 rounded border border-[#6B4626]">
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#E5A000]" />
              {language === 'bn' ? 'মোড:' : 'Role:'}
            </span>
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as any)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="customer" className="bg-[#4A2E16] text-white">
                {language === 'bn' ? 'ক্রেতা (Customer)' : 'Customer'}
              </option>
              <option value="admin" className="bg-[#4A2E16] text-white">
                {language === 'bn' ? 'অ্যাডমিন (Admin)' : 'Admin'}
              </option>
              <option value="delivery" className="bg-[#4A2E16] text-white">
                {language === 'bn' ? 'ডেলিভারি রাইডার (Rider)' : 'Delivery Staff'}
              </option>
            </select>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 text-white/90 hover:text-[#E5A000] transition-colors font-medium border-l border-white/20 pl-3"
            title="Switch Language"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
