import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  Package,
  Clock,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const DeliveryDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deliveryStaff,
    currentUser,
    language,
    setCurrentView,
  } = useStore();

  // Find assigned orders for current delivery staff (or fallback to staff-1 Rahim Mia)
  const staffId = currentUser.role === 'delivery' ? currentUser.id : 'staff-1';
  const currentRider = deliveryStaff.find((s) => s.id === staffId) || deliveryStaff[0];

  const assignedOrders = orders.filter(
    (o) => o.assignedDeliveryStaffId === currentRider?.id || o.orderStatus === 'Out for Delivery'
  );

  const deliveredCount = assignedOrders.filter((o) => o.orderStatus === 'Delivered').length;
  const pendingCount = assignedOrders.filter((o) => o.orderStatus !== 'Delivered').length;

  return (
    <div className="py-8 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Rider Profile Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#4A2E16] text-[#E5A000] flex items-center justify-center font-bold text-2xl shadow-md">
              🚴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Active Field Rider
                </span>
              </div>
              <h1 className="text-xl font-bold font-serif-title text-[#4A2E16]">
                {currentRider?.name || 'Rahim Mia'}
              </h1>
              <p className="text-xs text-stone-500">
                📍 {currentRider?.area || 'Gaibandha Sadar & College Road'} · {currentRider?.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্টোরে ফিরুন' : 'Back to Store'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
            <span className="text-xs text-stone-500 block mb-1">
              {language === 'bn' ? 'পেন্ডিং ডেলিভারি' : 'Pending Delivery'}
            </span>
            <span className="text-2xl font-bold font-mono text-[#E5A000]">
              {pendingCount}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 text-center">
            <span className="text-xs text-stone-500 block mb-1">
              {language === 'bn' ? 'সম্পন্ন ডেলিভারি' : 'Delivered Orders'}
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-600">
              {deliveredCount}
            </span>
          </div>
        </div>

        {/* Assigned Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-serif-title text-[#4A2E16]">
              {language === 'bn' ? 'অ্যাসাইনকৃত ডেলিভারি তালিকা' : 'Assigned Deliveries'}
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {assignedOrders.length} {language === 'bn' ? 'টি পার্সেল' : 'parcels'}
            </span>
          </div>

          {assignedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
              <p>{language === 'bn' ? 'বর্তমানে কোনো নতুন ডেলিভারি অ্যাসাইন করা নেই।' : 'No active orders assigned currently.'}</p>
            </div>
          ) : (
            assignedOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#4A2E16]">
                      {ord.trackingId}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A000]/20 text-[#4A2E16]">
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E5A000] text-sm">
                      ৳{ord.total}
                    </span>
                    <span className="uppercase text-[10px] font-semibold bg-stone-100 px-2 py-0.5 rounded">
                      {ord.paymentMethod === 'cod' ? 'Cash on Delivery (নগদ সংগ্রহ)' : 'Prepaid (পরিশোধিত)'}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Call Shortcut */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                    <span className="font-semibold text-stone-700 block">
                      {ord.customerDetails.fullName}
                    </span>
                    <p className="text-stone-500 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E5A000] shrink-0 mt-0.5" />
                      <span>{ord.customerDetails.fullAddress}, {ord.customerDetails.upazila}</span>
                    </p>
                    {ord.customerDetails.orderNotes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1">
                        নোট: {ord.customerDetails.orderNotes}
                      </p>
                    )}
                  </div>

                  {/* Phone Call Shortcut */}
                  <div className="flex items-center justify-center p-3 bg-[#FFF9EC] rounded-xl border border-[#E5A000]/30">
                    <a
                      href={`tel:${ord.customerDetails.phone}`}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-colors shadow-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{language === 'bn' ? 'গ্রাহককে কল দিন' : 'Call Customer'} ({ord.customerDetails.phone})</span>
                    </a>
                  </div>
                </div>

                {/* Action Buttons for Rider */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Out for Delivery', 'Rider is on the way to address')}
                    className="px-3 py-1.5 bg-[#4A2E16] text-[#FFF9EC] rounded-lg font-semibold hover:bg-[#382210] transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#E5A000]" />
                    <span>{language === 'bn' ? 'ডেলিভারিতে বের হয়েছি' : 'Mark Out for Delivery'}</span>
                  </button>

                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Delivered', 'Delivered safely to customer hands and cash collected')}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ডেলিভারি সম্পন্ন (Delivered)' : 'Mark as Delivered'}</span>
                  </button>

                  <button
                    onClick={() => updateOrderStatus(ord.id, 'Returned', 'Customer was unreachable or requested return')}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-medium transition-colors ml-auto"
                  >
                    {language === 'bn' ? 'রিটার্ন / ক্যানসেল' : 'Return / Cancel'}
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
