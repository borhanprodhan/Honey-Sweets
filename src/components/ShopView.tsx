import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    language,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCategory && p.categoryId !== selectedCategory) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || p.nameBn.includes(q);
      const matchDesc = p.description.toLowerCase().includes(q) || p.descriptionBn.includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q) || p.categoryNameBn.includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // Flash/Discount filter
    if (filterDiscountOnly && !p.isFlashSale && !p.discountPercentage) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.salePrice - b.salePrice;
    if (sortBy === 'price-high') return b.salePrice - a.salePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="py-8 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <span className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider">
              {language === 'bn' ? 'অনলাইন শপ' : 'Online Store'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#4A2E16] mt-1">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.[language === 'bn' ? 'nameBn' : 'name']
                : language === 'bn'
                ? 'সকল মধু ও মিষ্টির সম্ভার'
                : 'All Honey & Sweet Collections'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'bn'
                ? 'গাইবান্ধার সেরা রসগোল্লা, সুন্দরবনের প্রাকৃতিক মধু ও রাজকীয় মিষ্টি সরাসরি আপনার ঠিকানায়'
                : 'Authentic Sundarbans wild honey and fresh traditional Bengali sweets delivered with care'}
            </p>
          </div>

          <div className="text-xs text-stone-500 font-mono">
            {language === 'bn'
              ? `${sortedProducts.length} টি পণ্য পাওয়া গেছে`
              : `Showing ${sortedProducts.length} products`}
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategory === null
                  ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'সকল পণ্য' : 'All Products'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#4A2E16] text-[#FFF9EC] shadow-sm font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.name}
              </button>
            ))}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Discount Toggle */}
            <button
              onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                filterDiscountOnly
                  ? 'bg-[#E5A000]/15 border-[#E5A000] text-[#4A2E16] font-bold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5A000]" />
              <span>{language === 'bn' ? 'ডিসকাউন্ট অফার' : 'On Sale'}</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1">
              <SlidersHorizontal className="w-3 h-3 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-700 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured">{language === 'bn' ? 'জনপ্রিয় পণ্য' : 'Featured'}</option>
                <option value="price-low">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-high">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Search Filter Badge */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-[#FFF9EC] px-3 py-1.5 rounded-lg border border-[#E5A000]/30 w-fit">
            <span>
              {language === 'bn' ? 'অনুসন্ধান ফলাফল:' : 'Searching for:'} <strong>"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-stone-700">
              {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি!' : 'No matching products found.'}
            </p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {language === 'bn'
                ? 'দয়া করে অন্য কোনো নাম দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।'
                : 'Try searching with different keywords or reset your filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setFilterDiscountOnly(false);
              }}
              className="px-4 py-2 bg-[#E5A000] text-[#4A2E16] text-xs font-bold rounded-lg hover:bg-[#D48F00] transition-colors"
            >
              {language === 'bn' ? 'সব পণ্য দেখুন' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
