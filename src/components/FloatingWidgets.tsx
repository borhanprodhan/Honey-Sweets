import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, ArrowUp, ShoppingBag, Home, Sparkles, User, Truck } from 'lucide-react';

export const FloatingWidgets: React.FC = () => {
  const {
    settings,
    notification,
    cart,
    setIsCartOpen,
    currentView,
    setCurrentView,
    setIsTrackingModalOpen,
    language,
  } = useStore();

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-18 right-4 z-50 max-w-sm animate-slideDown">
          <div
            className={`p-3.5 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 ${
              notification.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : notification.type === 'info'
                ? 'bg-[#4A2E16] text-[#FFF9EC] border-[#633E1D]'
                : 'bg-[#E5A000] text-[#4A2E16] border-[#D48F00]'
            }`}
          >
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Floating Buttons Right Bottom */}
      <div className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-2.5 items-end">
        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white text-[#4A2E16] shadow-lg border border-stone-200 flex items-center justify-center hover:bg-[#FFF9EC] transition-all hover:scale-105"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* WhatsApp Support Button */}
        <a
          href={`https://wa.me/8801711000000?text=${encodeURIComponent(
            language === 'bn'
              ? 'আসসালামু আলাইকুম, আমি Honey-Sweets থেকে পণ্য অর্ডার করতে সহায়তা চাই।'
              : 'Hello, I need help ordering from Honey-Sweets.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20BD5A] transition-all hover:scale-105 text-xs font-bold"
          title="WhatsApp Support"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'হোয়াটসঅ্যাপ সাপোর্ট' : 'WhatsApp'}
          </span>
        </a>
      </div>

      {/* Mobile Bottom Sticky Navigation Bar (15% Cap compliant) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentView === 'home' ? 'text-[#E5A000] font-bold' : 'text-stone-600'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentView === 'shop' ? 'text-[#E5A000] font-bold' : 'text-stone-600'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{language === 'bn' ? 'শপ' : 'Shop'}</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('offers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentView === 'offers' ? 'text-[#E5A000] font-bold' : 'text-stone-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'bn' ? 'অফার' : 'Offers'}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] text-stone-600 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#E5A000] text-[#4A2E16] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                {totalCartCount}
              </span>
            )}
          </div>
          <span>{language === 'bn' ? 'কার্ট' : 'Cart'}</span>
        </button>

        <button
          onClick={() => setIsTrackingModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] text-stone-600"
        >
          <Truck className="w-4 h-4" />
          <span>{language === 'bn' ? 'ট্র্যাক' : 'Track'}</span>
        </button>
      </div>
    </>
  );
};
