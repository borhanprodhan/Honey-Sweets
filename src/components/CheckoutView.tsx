import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, GAIBANDHA_UPAZILAS } from '../data/initialData';
import { Order } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    calculateCartSummary,
    placeOrder,
    language,
    setCurrentView,
    settings,
    appliedCoupon,
    setIsTrackingModalOpen,
    setTrackedOrder,
  } = useStore();

  const [fullName, setFullName] = useState('Borhan Prodhan');
  const [phone, setPhone] = useState('01711-889900');
  const [email, setEmail] = useState('borhan@example.com');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0]);
  const [upazila, setUpazila] = useState(GAIBANDHA_UPAZILAS[0]);
  const [address, setAddress] = useState('House 42, College Road, Gaibandha Sadar');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const { subtotal, discount } = calculateCartSummary();

  const isGaibandha = district.toLowerCase().includes('gaibandha');
  const deliveryCharge =
    subtotal >= settings.freeDeliveryThreshold
      ? 0
      : appliedCoupon?.code === 'GAIBANDHA_FREE'
      ? 0
      : isGaibandha
      ? settings.deliveryChargeGaibandha
      : settings.deliveryChargeOutside;

  const total = Math.max(0, subtotal - discount + deliveryCharge);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif-title text-[#4A2E16]">
          {language === 'bn' ? 'আপনার কার্ট এখন খালি!' : 'Your Cart is Empty'}
        </h2>
        <p className="text-xs text-stone-500">
          {language === 'bn' ? 'চেকআউট করার আগে কার্টে পণ্য যোগ করুন।' : 'Add products before proceeding to checkout.'}
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-2.5 bg-[#E5A000] text-[#4A2E16] text-xs font-bold rounded-xl hover:bg-[#D48F00] transition-colors"
        >
          {language === 'bn' ? 'দোকানে ফিরুন' : 'Browse Products'}
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      alert(language === 'bn' ? 'দয়া করে একটি সঠিক মোবাইল নম্বর লিখুন!' : 'Please enter a valid phone number!');
      return;
    }
    if (!address) {
      alert(language === 'bn' ? 'দয়া করে আপনার পূর্ণাঙ্গ ঠিকানা লিখুন!' : 'Please enter full address!');
      return;
    }
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId) {
      alert(language === 'bn' ? 'দয়া করে TrxID (Transaction ID) লিখুন!' : 'Please provide transaction ID!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerDetails: {
          fullName,
          phone,
          email,
          district,
          upazila,
          fullAddress: address,
          orderNotes: transactionId
            ? `${orderNotes ? orderNotes + ' | ' : ''}TrxID: ${transactionId}`
            : orderNotes,
        },
        paymentMethod,
      });

      setIsSubmitting(false);
      setPlacedOrder(order);
    }, 450);
  };

  const handleTrackOrder = () => {
    if (placedOrder) {
      setTrackedOrder(placedOrder);
      setIsTrackingModalOpen(true);
      setCurrentView('home');
    }
  };

  return (
    <div className="py-10 bg-[#FFFDF9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2 mb-6 text-xs text-stone-500">
          <button
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-1 hover:text-[#4A2E16]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দোকানে ফিরুন' : 'Continue Shopping'}</span>
          </button>
          <span>/</span>
          <span className="text-[#4A2E16] font-semibold">{language === 'bn' ? 'চেকআউট' : 'Checkout'}</span>
        </div>

        {placedOrder ? (
          /* Confirmation Receipt View */
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-xl mx-auto shadow-lg space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? 'ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত হয়েছে' : 'Order Placed Successfully!'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'আমরা খুব শীঘ্রই আপনার অর্ডার প্রস্তুত করে ডেলিভারি শুরু করব।'
                  : 'We have received your order and started preparing fresh items.'}
              </p>
            </div>

            <div className="bg-[#FFF9EC] p-4 rounded-xl border border-[#E5A000]/40 text-left text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">{language === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি:' : 'Tracking ID:'}</span>
                <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-stone-200 text-[#4A2E16]">
                  {placedOrder.trackingId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">{language === 'bn' ? 'সর্বমোট বিল:' : 'Total Payable:'}</span>
                <span className="font-mono font-bold text-base text-[#E5A000]">
                  ৳{placedOrder.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment:'}</span>
                <span className="font-semibold uppercase">{placedOrder.paymentMethod}</span>
              </div>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                📍 {placedOrder.customerDetails.fullAddress}, {placedOrder.customerDetails.upazila}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleTrackOrder}
                className="px-6 py-3 bg-[#4A2E16] text-[#FFF9EC] text-xs font-semibold rounded-xl hover:bg-[#382210] transition-colors flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#E5A000]" />
                <span>{language === 'bn' ? 'লাইভ অর্ডার ট্র্যাক করুন' : 'Track Order Live'}</span>
              </button>

              <button
                onClick={() => setCurrentView('shop')}
                className="px-6 py-3 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-200 transition-colors"
              >
                {language === 'bn' ? 'আরও কেনাকাটা করুন' : 'Back to Store'}
              </button>
            </div>
          </div>
        ) : (
          /* Form Grid */
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Customer Details Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold font-serif-title text-[#4A2E16]">
                  {language === 'bn' ? '১. ডেলিভারির তথ্য' : '1. Delivery Information'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {language === 'bn' ? 'যে ঠিকানায় পণ্য পৌঁছে দেওয়া হবে' : 'Where should we deliver your order?'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'bn' ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'bn' ? 'জেলা / District *' : 'District *'}
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white font-medium"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'bn' ? 'উপজেলা / এলাকা *' : 'Upazila / Area *'}
                    </label>
                    {isGaibandha ? (
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white font-medium"
                      >
                        {GAIBANDHA_UPAZILAS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        placeholder="উপজেলা বা থানা"
                        className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'bn' ? 'পূর্ণাঙ্গ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) *' : 'Full Detailed Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: বাসা ৪২, কলেজ রোড, গাইবান্ধা সদর"
                    className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'bn' ? 'অর্ডার নোট বা বিশেষ নির্দেশনা' : 'Order Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: সাবধানে ডেলিভারি করবেন' : 'Any special notes for delivery...'}
                    className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                  ></textarea>
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div>
                  <h2 className="text-lg font-bold font-serif-title text-[#4A2E16]">
                    {language === 'bn' ? '২. পেমেন্ট পদ্ধতি' : '2. Payment Method'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'bn' ? 'আপনার পছন্দের মাধ্যম বেছে নিন' : 'Select how you want to pay'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="checkoutPay"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#E5A000]"
                    />
                    <div>
                      <p className="text-xs font-bold">
                        {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Cash on Delivery (COD)'}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {language === 'bn'
                          ? 'পণ্য হাতে পেয়ে চেক করে ডেলিভারি রাইডারের নিকট নগদ পরিশোধ করুন।'
                          : 'Pay in cash when your fresh items are delivered to your door.'}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="checkoutPay"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="mt-1 accent-[#E5A000]"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#E2136E]">
                        bKash (বিকাশ মার্চেন্ট / পার্সোনাল)
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {language === 'bn'
                          ? 'বিকাশ নম্বর 01711-000000 এ Send Money / Payment করে TrxID দিন।'
                          : 'Send Money to 01711-000000 and enter TrxID below.'}
                      </p>
                      {paymentMethod === 'bkash' && (
                        <div className="mt-2">
                          <input
                            type="text"
                            required
                            placeholder="bKash TrxID (যেমন: 9J38A7F2)"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-stone-300 font-mono focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="checkoutPay"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="mt-1 accent-[#E5A000]"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-orange-600">
                        Nagad (নগদ)
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {language === 'bn'
                          ? 'নগদ নম্বর 01711-000000 এ পেমেন্ট করে TrxID প্রদান করুন।'
                          : 'Send money via Nagad and provide TrxID.'}
                      </p>
                      {paymentMethod === 'nagad' && (
                        <div className="mt-2">
                          <input
                            type="text"
                            required
                            placeholder="Nagad TrxID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full text-xs bg-white rounded-lg px-3 py-2 border border-stone-300 font-mono focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif-title text-[#4A2E16] border-b border-stone-100 pb-3">
                  {language === 'bn' ? 'অর্ডার সারসংক্ষেপ' : 'Order Summary'}
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs items-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#4A2E16] truncate">
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </p>
                        <span className="text-[11px] text-stone-500">
                          {item.quantity} × {item.selectedWeight}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-stone-700">
                        ৳{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'পণ্যের উপ-মোট:' : 'Subtotal:'}</span>
                    <span className="font-mono font-semibold text-stone-800">৳{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট:' : 'Discount:'}</span>
                      <span className="font-mono font-semibold">-৳{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>
                      {language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'} ({isGaibandha ? 'গাইবান্ধা' : 'অন্যান্য'})
                    </span>
                    <span className="font-mono font-semibold text-stone-800">
                      {deliveryCharge === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `৳${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-bold text-[#4A2E16]">
                    <span>{language === 'bn' ? 'সর্বমোট বিল:' : 'Total Payable:'}</span>
                    <span className="font-mono text-[#E5A000]">৳{total}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{language === 'bn' ? 'অর্ডার সাবমিট হচ্ছে...' : 'Placing Order...'}</span>
                  ) : (
                    <>
                      <span>
                        {language === 'bn'
                          ? `অর্ডার সম্পন্ন করুন (৳${total})`
                          : `Confirm & Place Order (৳${total})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'নিরাপদ শপিং নিশ্চয়তা' : '100% Safe & Secure'}</span>
                  </div>
                  <p>
                    {language === 'bn'
                      ? 'পণ্য যাচাই করে মূল্য পরিশোধের সুযোগ। ত্রুটিযুক্ত পণ্য সাথে সাথে ফেরত নেওয়া হয়।'
                      : 'Check package upon receipt. Easy instant return policy on fresh items.'}
                  </p>
                </div>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
