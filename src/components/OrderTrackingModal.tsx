import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { OrderStatus } from '../types';

const ORDER_STEPS: OrderStatus[] = [
  'Order Placed',
  'Order Confirmed',
  'Processing',
  'Ready for Shipment',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackedOrder,
    setTrackedOrder,
    trackOrderByIdOrCode,
    language,
    deliveryStaff,
  } = useStore();

  const [query, setQuery] = useState(trackedOrder?.trackingId || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isTrackingModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!query.trim()) return;

    const res = trackOrderByIdOrCode(query);
    if (!res) {
      setErrorMessage(
        language === 'bn'
          ? 'এই ট্র্যাকিং আইডির কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি দিন (যেমন: HS-829104)'
          : 'No order found with this Tracking ID. Please verify (e.g. HS-829104)'
      );
    }
  };

  const currentStepIdx = trackedOrder
    ? ORDER_STEPS.indexOf(trackedOrder.orderStatus as OrderStatus)
    : -1;

  const assignedRider = trackedOrder?.assignedDeliveryStaffId
    ? deliveryStaff.find((s) => s.id === trackedOrder.assignedDeliveryStaffId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#4A2E16] text-[#FFF9EC] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#E5A000]" />
            <div>
              <h2 className="text-base font-bold font-serif-title">
                {language === 'bn' ? 'অর্ডার ট্র্যাকিং সিস্টেম' : 'Live Order Tracking'}
              </h2>
              <p className="text-[11px] text-[#E5A000]">
                {language === 'bn' ? 'রিয়েল-টাইম লাইভ ডেলিভারি স্ট্যাটাস' : 'Track your Honey-Sweets delivery'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setTrackedOrder(null);
            }}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={language === 'bn' ? 'ট্র্যাকিং আইডি দিন (যেমন: HS-829104)' : 'Enter Tracking ID (e.g. HS-829104)'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-xs font-mono uppercase bg-[#FFF9EC] rounded-xl pl-9 pr-3 py-3 border border-[#E5A000]/40 focus:outline-none focus:border-[#E5A000]"
              />
              <Search className="w-4 h-4 text-[#A66E38] absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
            >
              {language === 'bn' ? 'ট্র্যাক করুন' : 'Track'}
            </button>
          </form>

          {/* Quick Demo ID helper chips */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <span>{language === 'bn' ? 'ডেমো ট্র্যাকিং আইডি:' : 'Try Demo ID:'}</span>
            <button
              onClick={() => {
                setQuery('HS-829104');
                trackOrderByIdOrCode('HS-829104');
              }}
              className="font-mono text-[#E5A000] underline font-semibold hover:text-[#C98200]"
            >
              HS-829104
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setQuery('HS-573821');
                trackOrderByIdOrCode('HS-573821');
              }}
              className="font-mono text-[#E5A000] underline font-semibold hover:text-[#C98200]"
            >
              HS-573821
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tracked Order Details Card */}
          {trackedOrder && (
            <div className="space-y-6 pt-2">
              
              {/* Order Quick Summary Header */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">
                    {language === 'bn' ? 'ট্র্যাকিং কোড' : 'Tracking Code'}
                  </span>
                  <span className="font-mono font-bold text-base text-[#4A2E16]">
                    {trackedOrder.trackingId}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {new Date(trackedOrder.createdAt).toLocaleDateString('bn-BD', {
                      dateStyle: 'medium',
                    })}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">
                    {language === 'bn' ? 'বর্তমান স্ট্যাটাস' : 'Current Status'}
                  </span>
                  <span className="inline-block px-3 py-1 bg-[#E5A000]/20 text-[#4A2E16] font-bold rounded-full text-xs">
                    {trackedOrder.orderStatus}
                  </span>
                  <p className="text-[11px] font-mono font-bold text-[#E5A000] mt-0.5">
                    বিল: ৳{trackedOrder.total} ({trackedOrder.paymentMethod.toUpperCase()})
                  </p>
                </div>
              </div>

              {/* Multi-Stage Visual Stepper Timeline */}
              <div className="py-2">
                <span className="text-xs font-bold text-[#4A2E16] uppercase tracking-wider block mb-4">
                  {language === 'bn' ? 'ডেলিভারি অগ্রগতি' : 'Delivery Progress'}
                </span>
                <div className="relative flex items-center justify-between">
                  {/* Background progress bar line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 -z-0"></div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E5A000] transition-all duration-500 -z-0"
                    style={{
                      width: `${
                        currentStepIdx >= 0
                          ? (currentStepIdx / (ORDER_STEPS.length - 1)) * 100
                          : 0
                      }%`,
                    }}
                  ></div>

                  {ORDER_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-[#E5A000] text-[#4A2E16] shadow-sm'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-[#E5A000]/30 scale-110' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] mt-1.5 text-center max-w-[60px] truncate ${
                            isCurrent
                              ? 'font-bold text-[#4A2E16]'
                              : isCompleted
                              ? 'text-stone-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Delivery Rider Info if Available */}
              {assignedRider && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      🚴
                    </div>
                    <div>
                      <p className="font-bold text-emerald-950">
                        {language === 'bn' ? 'নিযুক্ত ডেলিভারি রাইডার:' : 'Assigned Rider:'} {assignedRider.name}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        {assignedRider.area}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${assignedRider.phone}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{assignedRider.phone}</span>
                  </a>
                </div>
              )}

              {/* Order Status History Log */}
              <div>
                <span className="text-xs font-bold text-[#4A2E16] uppercase tracking-wider block mb-2">
                  {language === 'bn' ? 'স্ট্যাটাস হিস্টোরি ও আপডেট' : 'Status Logs'}
                </span>
                <div className="space-y-2 border-l-2 border-[#E5A000]/40 pl-3 ml-2 text-xs">
                  {trackedOrder.history.map((h, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#E5A000]"></div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-[#4A2E16]">{h.status}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(h.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px] mt-0.5">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E5A000]" />
                    {language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Destination'}
                  </span>
                  <p className="text-stone-800 font-semibold">{trackedOrder.customerDetails.fullName}</p>
                  <p className="text-stone-600">{trackedOrder.customerDetails.phone}</p>
                  <p className="text-stone-500 text-[11px] mt-1">
                    {trackedOrder.customerDetails.fullAddress}, {trackedOrder.customerDetails.upazila}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700 flex items-center gap-1.5 mb-1">
                    <Package className="w-3.5 h-3.5 text-[#E5A000]" />
                    {language === 'bn' ? 'অর্ডারকৃত আইটেম' : 'Ordered Items'}
                  </span>
                  <div className="space-y-1">
                    {trackedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-stone-700">
                        <span className="truncate max-w-[150px]">
                          {it.quantity}x {language === 'bn' ? it.product.nameBn : it.product.name} ({it.selectedWeight})
                        </span>
                        <span className="font-mono font-semibold">৳{it.unitPrice * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
