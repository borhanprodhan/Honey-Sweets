import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Star, ShoppingBag, Zap, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    addToCart,
    openBuyNow,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const isWish = isInWishlist(product.id);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Badges: Discount or Best Seller */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.discountPercentage && (
            <span className="bg-[#E5A000] text-[#4A2E16] text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#4A2E16] text-[#FFF9EC] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {language === 'bn' ? 'বেস্ট সেলার' : 'Best Seller'}
            </span>
          )}
        </div>

        {/* Hover Action Icons: Wishlist & Quick View */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors ${
              isWish ? 'text-rose-500' : 'text-stone-600 hover:text-rose-500'
            }`}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => setQuickViewProduct(product)}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm text-stone-600 hover:text-[#4A2E16] transition-colors"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Out of Stock Warning */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md">
              {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Weight unboxed metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66E38]">
              {language === 'bn' ? product.categoryNameBn : product.categoryName}
            </span>
            <span className="font-mono text-[11px] text-stone-400">
              {product.weight}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-sm font-bold text-[#4A2E16] hover:text-[#E5A000] cursor-pointer transition-colors line-clamp-1"
          >
            {language === 'bn' ? product.nameBn : product.name}
          </h3>

          {/* Rating stars & review count */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="font-bold text-stone-700 ml-1 font-mono">{product.rating}</span>
            </div>
            <span>·</span>
            <span className="text-[11px]">({product.reviewsCount})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-extrabold text-[#E5A000] font-mono">
              ৳{product.salePrice}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs text-stone-400 line-through font-mono">
                ৳{product.regularPrice}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions: Express Buy Now & Add to Cart */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={() => openBuyNow(product)}
            disabled={product.stock <= 0}
            className="w-full py-2 bg-[#E5A000] hover:bg-[#D48F00] text-[#4A2E16] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-[#4A2E16]" />
            <span>{language === 'bn' ? 'সরাসরি কিনুন' : 'Buy Now'}</span>
          </button>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="w-full py-2 bg-[#4A2E16] hover:bg-[#382210] text-[#FFF9EC] font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#E5A000]" />
            <span>{language === 'bn' ? 'কার্ট' : 'Add Cart'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
