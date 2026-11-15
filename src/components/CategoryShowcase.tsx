import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { categories, language, setSelectedCategory, setCurrentView } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#A66E38] uppercase tracking-wider mb-1">
              {language === 'bn' ? 'আমাদের সংগ্রহসমূহ' : 'Curated Categories'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-[#4A2E16]">
              {language === 'bn' ? 'সেরা মিষ্টি ও মধুর সম্ভার' : 'Handcrafted Honey & Sweet Delights'}
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('shop');
            }}
            className="text-xs font-bold text-[#E5A000] hover:text-[#C98200] flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
          >
            <span>{language === 'bn' ? 'সকল ক্যাটাগরি এক্সপ্লোর করুন' : 'Browse All Categories'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-stone-200/80 bg-[#FFFDF9] hover:border-[#E5A000] hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[#4A2E16] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm font-mono">
                  {cat.count} {language === 'bn' ? 'টি আইটেম' : 'Items'}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#4A2E16] group-hover:text-[#E5A000] transition-colors font-serif-title">
                    {language === 'bn' ? cat.nameBn : cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {language === 'bn' ? cat.descriptionBn : cat.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#A66E38] group-hover:text-[#E5A000]">
                  <span>{language === 'bn' ? 'পণ্য দেখুন' : 'View Products'}</span>
                  <span className="text-sm font-bold">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
