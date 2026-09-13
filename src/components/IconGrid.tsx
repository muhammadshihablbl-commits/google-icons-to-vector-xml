import React, { useState, useEffect, useMemo } from 'react';
import { GoogleIconItem, IconStyle } from '../types';
import { IconCard } from './IconCard';
import { SearchX, CheckSquare, Square, ArrowDown } from 'lucide-react';

interface IconGridProps {
  icons: GoogleIconItem[];
  style: IconStyle;
  isFilled: boolean;
  selectedNames: Set<string>;
  onToggleSelect: (name: string) => void;
  onSelectAllFiltered: () => void;
  onDeselectAll: () => void;
  onSelectIcon: (icon: GoogleIconItem) => void;
  searchQuery: string;
  onClearSearch: () => void;
  lang: 'en' | 'bn';
}

const PAGE_SIZE = 96;

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  style,
  isFilled,
  selectedNames,
  onToggleSelect,
  onSelectAllFiltered,
  onDeselectAll,
  onSelectIcon,
  searchQuery,
  onClearSearch,
  lang,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Reset pagination when search query or icons change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [icons.length, searchQuery]);

  const visibleIcons = useMemo(() => {
    return icons.slice(0, visibleCount);
  }, [icons, visibleCount]);

  const hasMore = visibleCount < icons.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, icons.length));
  };

  const allFilteredSelected = icons.length > 0 && icons.every((i) => selectedNames.has(i.name));

  if (icons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-neutral-800 mb-1">
          {lang === 'bn' ? 'কোনো আইকন পাওয়া যায়নি' : 'No icons found'}
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mb-4">
          {lang === 'bn'
            ? `"${searchQuery}" এর সাথে মিলে এমন কোনো গুগল আইকন পাওয়া যায়নি। অন্য কোনো বানান বা সমার্থক শব্দ দিয়ে চেষ্টা করুন।`
            : `We couldn't find any Google Material icon matching "${searchQuery}". Try searching for synonyms like "gear", "heart", "trash", or "user".`}
        </p>
        <button
          onClick={onClearSearch}
          className="px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded-xl shadow-xs transition-colors"
        >
          {lang === 'bn' ? 'সার্চ ফিল্টার রিসেট করুন' : 'Clear search query'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top action row: Select all checkbox & showing counts */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={allFilteredSelected ? onDeselectAll : onSelectAllFiltered}
            className="flex items-center gap-1.5 font-medium text-neutral-700 hover:text-blue-600 transition-colors"
          >
            {allFilteredSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-neutral-400" />
            )}
            <span>
              {allFilteredSelected
                ? (lang === 'bn' ? 'সব অনির্বাচিত করুন' : 'Deselect All')
                : (lang === 'bn' ? 'এই তালিকার সব নির্বাচন করুন' : 'Select All Filtered')}
            </span>
          </button>
        </div>

        <div>
          <span>
            {lang === 'bn'
              ? `${Math.min(visibleCount, icons.length)} / ${icons.length} টি দেখানো হচ্ছে`
              : `Showing ${Math.min(visibleCount, icons.length)} of ${icons.length}`}
          </span>
        </div>
      </div>

      {/* Grid of Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-3.5">
        {visibleIcons.map((icon) => (
          <IconCard
            key={icon.name}
            icon={icon}
            style={style}
            isFilled={isFilled}
            isSelected={selectedNames.has(icon.name)}
            onToggleSelect={onToggleSelect}
            onSelectIcon={onSelectIcon}
            lang={lang}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-8 pb-4 gap-2">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-semibold shadow-xs hover:shadow transition-all"
          >
            <ArrowDown className="w-4 h-4 text-neutral-500" />
            <span>
              {lang === 'bn'
                ? `আরও ${Math.min(PAGE_SIZE, icons.length - visibleCount)} টি আইকন লোড করুন (${icons.length - visibleCount} টি বাকি)`
                : `Load More (${icons.length - visibleCount} remaining)`}
            </span>
          </button>
          <span className="text-[11px] text-neutral-400">
            {lang === 'bn'
              ? 'অথবা সার্চ বার ব্যবহার করে সরাসরি যে কোনো আইকন খুঁজুন'
              : 'Tip: Use the search bar to jump straight to any icon'}
          </span>
        </div>
      )}
    </div>
  );
};
