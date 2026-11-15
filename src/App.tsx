import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { OffersView } from './components/OffersView';
import { AboutView } from './components/AboutView';
import { CheckoutView } from './components/CheckoutView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DeliveryDashboard } from './components/DeliveryDashboard';
import { ExpressBuyNowModal } from './components/ExpressBuyNowModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';

const MainLayout: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#252525]">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Header Navigation Bar */}
      <Header />

      {/* 3. Dynamic Page View Router */}
      <main className="flex-1 pb-16 sm:pb-0">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'offers' && <OffersView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'customer-dashboard' && <CustomerDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'delivery-dashboard' && <DeliveryDashboard />}
      </main>

      {/* 4. Global Modals & Drawers */}
      <ExpressBuyNowModal />
      <CartDrawer />
      <ProductDetailsModal />
      <OrderTrackingModal />

      {/* 5. Footer */}
      <Footer />

      {/* 6. Floating Widgets & Mobile Navigation */}
      <FloatingWidgets />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
