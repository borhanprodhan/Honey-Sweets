import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  CheckCircle,
  Truck,
  Heart,
  Plus,
  Minus,
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const {
    activeQuickViewProduct,
    setQuickViewProduct,
    language,
    addToCart,
    openBuyNow,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
  } = useStore();

  const product = activeQuickViewProduct;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product?.weight || '500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'purity' | 'reviews'>('desc');

  // Review Form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  if (!product) return null;

  const isWish = isInWishlist(product.id);

  // Dynamic price calculation
  let multiplier = 1.0;
  if (product.availableWeights) {
    const match = product.availableWeights.find((w) => w.label === selectedWeight);
    if (match) multiplier = match.priceMultiplier;
  }
  const unitPrice = Math.round(product.salePrice * multiplier);
  const originalUnitPrice = Math.round(product.regularPrice * multiplier);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;

    addReview({
      productId: product.id,
      userName: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
      verifiedPurchase: true,
    });

    setReviewerName('');
    setReviewerComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
            {language === 'bn' ? product.categoryNameBn : product.categoryName} · SKU: {product.sku}
          </span>
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.discountPercentage && (
                <span className="absolute top-3 left-3 bg-[#E5A000] text-[#4A2E16] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx ? 'border-[#E5A000] scale-105' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Purity guarantee badge */}
            <div className="p-3 bg-[#FFF9EC] rounded-xl border border-[#E5A000]/30 flex items-center gap-2.5 text-xs text-[#4A2E16]">
              <ShieldCheck className="w-5 h-5 text-[#E5A000] shrink-0" />
              <div>
                <p className="font-bold">
                  {language === 'bn' ? '১০০% বিশুদ্ধতার নিশ্চয়তা' : 'Guaranteed Pure & Authentic'}
                </p>
                <p className="text-[11px] text-stone-600">
                  {language === 'bn' ? product.purityGuaranteeBn : product.purityGuarantee}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Purchase Module (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-[#4A2E16]">
                {language === 'bn' ? product.nameBn : product.name}
              </h2>

              {/* Rating & Origin */}
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 mr-1" />
                  <span className="font-mono">{product.rating}</span>
                </div>
                <span>·</span>
                <span>{product.reviewsCount} {language === 'bn' ? 'টি রিভিউ' : 'reviews'}</span>
                <span>·</span>
                <span className="text-[#A66E38]">📍 {language === 'bn' ? product.originBn : product.origin}</span>
              </div>

              {/* Dynamic Price Display */}
              <div className="flex items-baseline gap-3 mt-4 p-3 bg-stone-50 rounded-xl">
                <span className="text-2xl font-bold text-[#E5A000] font-mono">
                  ৳{unitPrice}
                </span>
                {originalUnitPrice > unitPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    ৳{originalUnitPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-semibold ml-auto">
                  {product.stock > 0
                    ? language === 'bn'
                      ? `স্টকে আছে (${product.stock} টি)`
                      : `In Stock (${product.stock} units)`
                    : language === 'bn'
                    ? 'স্টক শেষ'
                    : 'Out of Stock'}
                </span>
              </div>

              {/* Weight Selector */}
              {product.availableWeights && product.availableWeights.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {language === 'bn' ? 'প্যাকেজিং ওজন নির্বাচন করুন:' : 'Select Weight / Pack:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableWeights.map((w) => (
                      <button
                        key={w.label}
                        type="button"
                        onClick={() => setSelectedWeight(w.label)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedWeight === w.label
                            ? 'border-[#E5A000] bg-[#FFF9EC] text-[#4A2E16] shadow-xs'
                            : 'border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {w.label} (৳{Math.round(product.salePrice * w.priceMultiplier)})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs font-semibold text-stone-700">
                  {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Express Buy Now & Add to Cart */}
              <div className="flex items-center gap-3 pt-5 border-t border-stone-100 mt-5">
                <button
                  onClick={() => {
                    setQuickViewProduct(null);
                    openBuyNow(product, quantity, selectedWeight);
                  }}
                  className="flex-1 py-3 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-[#4A2E16]" />
                  <span>
                    {language === 'bn'
                      ? `সরাসরি কিনুন (৳${unitPrice * quantity})`
                      : `Buy Now (৳${unitPrice * quantity})`}
                  </span>
                </button>

                <button
                  onClick={() => {
                    addToCart(product, quantity, selectedWeight);
                  }}
                  className="px-5 py-3 bg-[#4A2E16] hover:bg-[#382210] text-[#FFF9EC] font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E5A000]" />
                  <span>{language === 'bn' ? 'কার্ট' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWish ? 'border-rose-400 bg-rose-50 text-rose-500' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section (Description / Purity / Reviews) */}
        <div className="border-t border-stone-200 bg-stone-50/50 p-6">
          <div className="flex items-center gap-4 border-b border-stone-200 pb-2 mb-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-1 transition-colors ${
                activeTab === 'desc'
                  ? 'border-b-2 border-[#E5A000] text-[#4A2E16] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? 'পণ্যের বিবরণ' : 'Description'}
            </button>
            <button
              onClick={() => setActiveTab('purity')}
              className={`pb-1 transition-colors ${
                activeTab === 'purity'
                  ? 'border-b-2 border-[#E5A000] text-[#4A2E16] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? 'বিশুদ্ধতা ও ল্যাব টেস্ট' : 'Purity & Guarantee'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-1 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[#E5A000] text-[#4A2E16] font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? `রিভিউ (${productReviews.length})` : `Reviews (${productReviews.length})`}
            </button>
          </div>

          {activeTab === 'desc' && (
            <div className="text-xs text-stone-700 leading-relaxed max-w-2xl space-y-2">
              <p>{language === 'bn' ? product.descriptionBn : product.description}</p>
              <div className="pt-2 flex items-center gap-4 text-stone-500">
                <span>📦 {language === 'bn' ? 'প্যাকেজিং: প্রিমিয়াম সিলড জার / বক্স' : 'Packaging: Sealed Food-Grade Box'}</span>
                <span>🚚 {language === 'bn' ? 'ডেলিভারি: গাইবান্ধায় ১ ঘণ্টা' : 'Delivery: 1-hour in Gaibandha'}</span>
              </div>
            </div>
          )}

          {activeTab === 'purity' && (
            <div className="text-xs text-stone-700 space-y-2 max-w-2xl">
              <div className="flex items-start gap-2 p-3 bg-white rounded-xl border border-stone-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">
                    {language === 'bn' ? 'প্রাকৃতিক মান নিয়ন্ত্রণ' : 'Natural Quality Standards'}
                  </p>
                  <p className="text-stone-500 mt-0.5">
                    {language === 'bn'
                      ? 'কোনো প্রকার কৃত্রিম রং, রাসায়নিক বা চিনি মেশানো হয় না। প্রতিটি ব্যাচ কঠোর মান পরীক্ষার পর ডেলিভারি করা হয়।'
                      : 'Zero artificial color, sugar syrup, or chemicals. Every batch is rigorously inspected.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              {/* Reviews List */}
              <div className="space-y-3">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-stone-500">
                    {language === 'bn' ? 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!' : 'No reviews yet. Be the first to review!'}
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#4A2E16]">{rev.userName}</span>
                        <span className="text-[10px] text-stone-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <p className="text-stone-600 mt-1">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-stone-200 space-y-2">
                <span className="text-xs font-bold text-[#4A2E16] block">
                  {language === 'bn' ? 'একটি রিভিউ লিখুন:' : 'Write a Review:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="text-xs bg-white rounded-lg px-3 py-1.5 border border-stone-200 focus:outline-none"
                  />
                  <select
                    value={reviewerRating}
                    onChange={(e) => setReviewerRating(Number(e.target.value))}
                    className="text-xs bg-white rounded-lg px-3 py-1.5 border border-stone-200 focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Star)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Star)</option>
                    <option value={3}>⭐⭐⭐ (3 Star)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder={language === 'bn' ? 'আপনার মতামত লিখুন...' : 'Write your comment...'}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full text-xs bg-white rounded-lg px-3 py-1.5 border border-stone-200 focus:outline-none"
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4A2E16] text-[#FFF9EC] text-xs font-semibold rounded-lg hover:bg-[#382210] transition-colors"
                >
                  {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
