import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Truck,
  User,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    cart,
    wishlist,
    setIsCartOpen,
    setIsTrackingModalOpen,
    currentView,
    setCurrentView,
    currentUser,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    categories,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNav = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5A000]/20 py-3'
            : 'bg-white/85 backdrop-blur-sm border-b border-stone-200/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar Contract: 3 Zones */}
          <div className="flex items-center justify-between gap-6 md:gap-8">
            
            {/* Zone 1: Single Brand Wordmark & Emblem */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-stone-700 hover:text-[#4A2E16]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-2 group text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E5A000] to-[#C98200] flex items-center justify-center text-white shadow-sm shadow-[#E5A000]/30 group-hover:scale-105 transition-transform">
                  <span className="font-bold text-lg font-serif">HS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-[#4A2E16] font-serif-title leading-tight whitespace-nowrap">
                    Honey-Sweets
                  </span>
                  <span className="text-[10px] text-[#A66E38] font-medium tracking-wider uppercase -mt-0.5">
                    Gaibandha · Bangladesh
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
              <button
                onClick={() => handleNav('home')}
                className={`transition-colors whitespace-nowrap hover:text-[#E5A000] ${
                  currentView === 'home' ? 'text-[#E5A000] font-semibold' : ''
                }`}
              >
                {language === 'bn' ? 'হোম' : 'Home'}
              </button>

              <div className="relative group">
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  className="flex items-center gap-1 transition-colors whitespace-nowrap hover:text-[#E5A000]"
                >
                  <span>{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#E5A000] transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200/80 py-2 hidden group-hover:block transition-all">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-[#FFF9EC] text-stone-800 hover:text-[#4A2E16] flex items-center justify-between"
                    >
                      <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                      <span className="text-[11px] text-stone-400 font-mono">({cat.count})</span>
                    </button>
                  ))}
                  <div className="border-t border-stone-100 my-1"></div>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      handleNav('shop');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#E5A000] hover:bg-[#FFF9EC]"
                  >
                    {language === 'bn' ? 'সকল পণ্য দেখুন →' : 'View All Products →'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleNav('shop')}
                className={`transition-colors whitespace-nowrap hover:text-[#E5A000] ${
                  currentView === 'shop' ? 'text-[#E5A000] font-semibold' : ''
                }`}
              >
                {language === 'bn' ? 'সব পণ্য' : 'Shop'}
              </button>

              <button
                onClick={() => handleNav('offers')}
                className={`flex items-center gap-1 transition-colors whitespace-nowrap hover:text-[#E5A000] ${
                  currentView === 'offers' ? 'text-[#E5A000] font-semibold' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5A000]" />
                <span>{language === 'bn' ? 'অফার ও ডিল' : 'Special Offers'}</span>
              </button>

              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className="flex items-center gap-1.5 transition-colors whitespace-nowrap text-stone-600 hover:text-[#E5A000]"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}</span>
              </button>

              <button
                onClick={() => handleNav('about')}
                className={`transition-colors whitespace-nowrap hover:text-[#E5A000] ${
                  currentView === 'about' ? 'text-[#E5A000] font-semibold' : ''
                }`}
              >
                {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
              </button>
            </nav>

            {/* Zone 3: Search, Actions, Wishlist & Cart */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Desktop Search input */}
              <div className="hidden xl:flex items-center relative w-56">
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'মধু বা মিষ্টি খুঁজুন...' : 'Search honey, sweets...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'shop') setCurrentView('shop');
                  }}
                  className="w-full bg-[#FFF9EC] text-stone-800 text-xs rounded-full pl-9 pr-3 py-2 border border-[#E5A000]/30 focus:outline-none focus:border-[#E5A000] focus:ring-1 focus:ring-[#E5A000]"
                />
                <Search className="w-3.5 h-3.5 text-[#A66E38] absolute left-3 pointer-events-none" />
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="xl:hidden p-2 text-stone-700 hover:text-[#E5A000] hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  if (currentUser.role === 'customer') {
                    handleNav('customer-dashboard');
                  } else {
                    handleNav('shop');
                  }
                }}
                className="relative p-2 text-stone-700 hover:text-[#E5A000] hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Wishlist"
                title={language === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#E5A000] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#4A2E16] text-[#FFF9EC] hover:bg-[#382210] rounded-lg transition-colors font-medium text-xs shadow-sm shadow-[#4A2E16]/20 whitespace-nowrap"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#E5A000]" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#E5A000] text-[#4A2E16] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {language === 'bn' ? 'কার্ট' : 'Cart'}
                </span>
              </button>

              {/* User Account / Dashboard Link */}
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') handleNav('admin-dashboard');
                  else if (currentUser.role === 'delivery') handleNav('delivery-dashboard');
                  else handleNav('customer-dashboard');
                }}
                className="p-2 text-stone-700 hover:text-[#4A2E16] hover:bg-stone-100 rounded-full transition-colors border border-stone-200"
                title={
                  currentUser.role === 'admin'
                    ? 'Admin Dashboard'
                    : currentUser.role === 'delivery'
                    ? 'Delivery Dashboard'
                    : 'Customer Profile'
                }
              >
                <User className="w-4 h-4 text-[#4A2E16]" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 mt-3 space-y-3 shadow-md animate-fadeIn">
            {/* Search Input for Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={language === 'bn' ? 'মধু বা মিষ্টি খুঁজুন...' : 'Search honey, sweets...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                className="w-full bg-[#FFF9EC] text-stone-800 text-xs rounded-lg pl-9 pr-3 py-2.5 border border-[#E5A000]/40 focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#A66E38] absolute left-3 top-3 pointer-events-none" />
            </div>

            <div className="flex flex-col space-y-1 text-sm font-medium text-stone-800">
              <button
                onClick={() => handleNav('home')}
                className="w-full text-left py-2 px-3 rounded hover:bg-[#FFF9EC]"
              >
                {language === 'bn' ? 'হোম' : 'Home'}
              </button>
              <button
                onClick={() => handleNav('shop')}
                className="w-full text-left py-2 px-3 rounded hover:bg-[#FFF9EC]"
              >
                {language === 'bn' ? 'সকল মিষ্টি ও মধু' : 'All Products'}
              </button>
              <button
                onClick={() => handleNav('offers')}
                className="w-full text-left py-2 px-3 rounded hover:bg-[#FFF9EC] text-[#E5A000] font-semibold flex items-center justify-between"
              >
                <span>{language === 'bn' ? 'অফার ও মেগা ডিল' : 'Flash Sale & Offers'}</span>
                <span className="text-[10px] bg-[#E5A000]/15 text-[#4A2E16] px-2 py-0.5 rounded">NEW</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsTrackingModalOpen(true);
                }}
                className="w-full text-left py-2 px-3 rounded hover:bg-[#FFF9EC] flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#E5A000]" />
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
              </button>
              <button
                onClick={() => handleNav('about')}
                className="w-full text-left py-2 px-3 rounded hover:bg-[#FFF9EC]"
              >
                {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Honey-Sweets'}
              </button>

              {/* Roles in mobile */}
              <div className="pt-2 border-t border-stone-100 flex flex-col gap-1">
                <span className="text-xs text-stone-400 px-3">ড্যাশবোর্ড / Dashboards:</span>
                <button
                  onClick={() => handleNav('customer-dashboard')}
                  className="w-full text-left py-1.5 px-3 text-xs text-stone-700 hover:bg-[#FFF9EC] rounded"
                >
                  👤 {language === 'bn' ? 'কাস্টমার প্রোফাইল ও অর্ডারসমূহ' : 'Customer Account'}
                </button>
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className="w-full text-left py-1.5 px-3 text-xs text-stone-700 hover:bg-[#FFF9EC] rounded"
                >
                  ⚙️ {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
                </button>
                <button
                  onClick={() => handleNav('delivery-dashboard')}
                  className="w-full text-left py-1.5 px-3 text-xs text-stone-700 hover:bg-[#FFF9EC] rounded"
                >
                  🚴 {language === 'bn' ? 'ডেলিভারি রাইডার প্যানেল' : 'Delivery Staff Panel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-sm font-semibold text-[#4A2E16]">
                {language === 'bn' ? 'পণ্য সন্ধান করুন' : 'Search Honey-Sweets'}
              </span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 relative">
              <input
                type="text"
                autoFocus
                placeholder={language === 'bn' ? 'মধু, রসগোল্লা, চমচম, গিফট বক্স...' : 'Search honey, sweets, gift boxes...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSearchModal(false);
                    setCurrentView('shop');
                  }
                }}
                className="w-full bg-[#FFF9EC] text-sm text-stone-800 rounded-xl pl-10 pr-4 py-3 border border-[#E5A000]/40 focus:outline-none focus:border-[#E5A000]"
              />
              <Search className="w-4 h-4 text-[#A66E38] absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-3 py-1.5 text-xs text-stone-600"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setCurrentView('shop');
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#E5A000] text-white rounded-lg hover:bg-[#D48F00]"
              >
                {language === 'bn' ? 'অনুসন্ধান করুন' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
