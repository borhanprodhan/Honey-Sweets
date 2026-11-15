import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  MapPin,
  Phone,
  User,
  ArrowRight,
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, GAIBANDHA_UPAZILAS } from '../data/initialData';
import { CartItem, Order } from '../types';

export const ExpressBuyNowModal: React.FC = () => {
  const {
    buyNowItem,
    closeBuyNow,
    language,
    placeOrder,
    settings,
    setIsTrackingModalOpen,
    setTrackedOrder,
  } = useStore();

  const [quantity, setQuantity] = useState(buyNowItem?.quantity || 1);
  const [selectedWeight, setSelectedWeight] = useState(buyNowItem?.selectedWeight || '500g');
  const [fullName, setFullName] = useState('Borhan Prodhan');
  const [phone, setPhone] = useState('01711-889900');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0]);
  const [upazila, setUpazila] = useState(GAIBANDHA_UPAZILAS[0]);
  const [address, setAddress] = useState('College Road, Gaibandha Sadar');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (buyNowItem) {
      setQuantity(buyNowItem.quantity || 1);
      setSelectedWeight(buyNowItem.selectedWeight || buyNowItem.product.weight);
      setConfirmedOrder(null);
    }
  }, [buyNowItem]);

  if (!buyNowItem && !confirmedOrder) return null;

  const product = buyNowItem?.product;

  // Calculate dynamic price based on weight multiplier
  let multiplier = 1.0;
  if (product?.availableWeights) {
    const found = product.availableWeights.find((w) => w.label === selectedWeight);
    if (found) multiplier = found.priceMultiplier;
  }
  const unitPrice = Math.round((product?.salePrice || 0) * multiplier);
  const subtotal = unitPrice * quantity;

  // Delivery charge
  const isGaibandha = district.toLowerCase().includes('gaibandha');
  const deliveryCharge =
    subtotal >= settings.freeDeliveryThreshold
      ? 0
      : isGaibandha
      ? settings.deliveryChargeGaibandha
      : settings.deliveryChargeOutside;

  const total = subtotal + deliveryCharge;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!phone || phone.length < 8) {
      alert(language === 'bn' ? 'সঠিক মোবাইল নম্বর দিন!' : 'Please enter a valid phone number!');
      return;
    }
    if (!address) {
      alert(language === 'bn' ? 'ডেলিভারি ঠিকানা দিন!' : 'Please enter delivery address!');
      return;
    }

    setIsSubmitting(true);

    const singleItem: CartItem = {
      product,
      quantity,
      selectedWeight,
      unitPrice,
    };

    setTimeout(() => {
      const order = placeOrder({
        customerDetails: {
          fullName,
          phone,
          district,
          upazila,
          fullAddress: address,
          orderNotes,
        },
        paymentMethod,
        itemsOverride: [singleItem],
      });

      setIsSubmitting(false);
      setConfirmedOrder(order);
    }, 400);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    closeBuyNow();
  };

  const handleTrackCreatedOrder = () => {
    if (confirmedOrder) {
      setTrackedOrder(confirmedOrder);
      setConfirmedOrder(null);
      closeBuyNow();
      setIsTrackingModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="bg-[#4A2E16] text-[#FFF9EC] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E5A000] text-[#4A2E16] flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-title leading-tight">
                {confirmedOrder
                  ? language === 'bn' ? 'অর্ডার সফলভাবে গৃহীত হয়েছে!' : 'Order Placed Successfully!'
                  : language === 'bn' ? 'এক্সপ্রেস বাই নাও (সরাসরি কিনুন)' : 'Express 1-Click Buy Now'}
              </h2>
              <p className="text-[11px] text-[#E5A000]">
                {confirmedOrder
                  ? language === 'bn' ? 'আপনার অর্ডারটি প্রক্রিয়াধীন আছে' : 'Your order is being processed'
                  : language === 'bn' ? 'ক্যাশ অন ডেলিভারিতে দ্রুত অর্ডার করুন' : 'Instant Cash on Delivery Checkout'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed Success Screen */}
        {confirmedOrder ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#4A2E16]">
                {language === 'bn' ? 'অভিনন্দন! আপনার অর্ডার সম্পন্ন হয়েছে' : 'Thank You! Order Confirmed'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'আমরা দ্রুততম সময়ে আপনার ঠিকানায় পণ্য পৌঁছে দেব।'
                  : 'We will deliver your fresh items directly to your address.'}
              </p>
            </div>

            {/* Tracking ID Badge */}
            <div className="bg-[#FFF9EC] border border-[#E5A000]/40 p-4 rounded-xl max-w-sm mx-auto text-left space-y-2">
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি:' : 'Tracking ID:'}</span>
                <span className="font-mono font-bold text-sm text-[#4A2E16] bg-white px-2 py-0.5 rounded border border-stone-200">
                  {confirmedOrder.trackingId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>{language === 'bn' ? 'মোট প্রদেয় বিল:' : 'Total Payable:'}</span>
                <span className="font-mono font-bold text-sm text-[#E5A000]">
                  ৳{confirmedOrder.total}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>
                <span className="font-semibold uppercase text-stone-800">
                  {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash'}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                📍 {confirmedOrder.customerDetails.fullAddress}, {confirmedOrder.customerDetails.upazila}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleTrackCreatedOrder}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#4A2E16] text-[#FFF9EC] text-xs font-semibold rounded-xl hover:bg-[#382210] transition-colors flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#E5A000]" />
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track This Order'}</span>
              </button>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-200 transition-colors"
              >
                {language === 'bn' ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}
              </button>
            </div>
          </div>
        ) : (
          /* Buy Now Form */
          <form onSubmit={handleOrderSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Product Summary Row */}
            <div className="flex items-center gap-4 p-3 bg-[#FFF9EC] rounded-xl border border-[#E5A000]/20">
              <img
                src={product?.images[0]}
                alt={product?.name}
                className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#4A2E16] truncate">
                  {language === 'bn' ? product?.nameBn : product?.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                  <span>{selectedWeight}</span>
                  <span>·</span>
                  <span className="font-mono font-bold text-[#E5A000]">৳{unitPrice}</span>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 text-xs font-mono font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weight / Pack Options */}
            {product?.availableWeights && product.availableWeights.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {language === 'bn' ? 'পরিমাণ / ওজন নির্বাচন করুন:' : 'Select Pack Weight:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableWeights.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setSelectedWeight(w.label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedWeight === w.label
                          ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16] font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      {w.label} (৳{Math.round(product.salePrice * w.priceMultiplier)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Information Inputs */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#4A2E16] uppercase tracking-wider block">
                {language === 'bn' ? 'ডেলিভারির তথ্য' : 'Delivery Details'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="নাম লিখুন"
                      className="w-full text-xs bg-stone-50 rounded-lg pl-8 pr-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017..."
                      className="w-full text-xs bg-stone-50 rounded-lg pl-8 pr-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'bn' ? 'জেলা / District *' : 'District *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'bn' ? 'উপজেলা / এলাকা *' : 'Upazila / Area *'}
                  </label>
                  {isGaibandha ? (
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
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
                      placeholder="উপজেলা / থানা"
                      className="w-full text-xs bg-stone-50 rounded-lg px-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {language === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা (গ্রাম/রোড/বাসা নম্বর) *' : 'Detailed Address *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: কলেজ রোড, বাসা ৪২, গাইবান্ধা সদর"
                    className="w-full text-xs bg-stone-50 rounded-lg pl-8 pr-3 py-2 border border-stone-200 focus:outline-none focus:border-[#E5A000] focus:bg-white"
                  />
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-xs font-bold text-[#4A2E16] uppercase tracking-wider block mb-2">
                {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16] font-semibold shadow-sm'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#E5A000]"
                  />
                  <div className="text-xs">
                    <p className="font-bold">
                      {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                    </p>
                    <p className="text-[10px] text-stone-500">পণ্য হাতে পেয়ে টাকা দিন</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16] font-semibold shadow-sm'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="accent-[#E5A000]"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-[#E2136E]">bKash (বিকাশ)</p>
                    <p className="text-[10px] text-stone-500">দ্রুত অনলাইন পেমেন্ট</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'পণ্যের উপ-মোট:' : 'Subtotal:'}</span>
                <span className="font-mono font-semibold text-stone-800">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}</span>
                <span className="font-mono font-semibold text-stone-800">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `৳${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-stone-200 text-sm font-bold text-[#4A2E16]">
                <span>{language === 'bn' ? 'সর্বমোট প্রদেয় বিল:' : 'Total Payable:'}</span>
                <span className="font-mono text-[#E5A000]">৳{total}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing...'}</span>
              ) : (
                <>
                  <span>
                    {language === 'bn'
                      ? `অর্ডার কনফার্ম করুন (৳${total})`
                      : `Confirm & Place Order (৳${total})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
