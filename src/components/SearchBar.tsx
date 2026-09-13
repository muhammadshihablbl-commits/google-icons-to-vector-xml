import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { IconStyle } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalResults: number;
  totalIcons: number;
  style: IconStyle;
  onStyleChange: (style: IconStyle) => void;
  sortBy: 'popularity' | 'name';
  onSortByChange: (sort: 'popularity' | 'name') => void;
  lang: 'en' | 'bn';
}

const POPULAR_TAGS = [
  'search',
  'home',
  'settings',
  'favorite',
  'person',
  'menu',
  'close',
  'check',
  'delete',
  'download',
  'arrow',
  'notifications',
  'shopping',
  'camera',
];

const CATEGORY_NAMES_BN: Record<string, string> = {
  all: 'সব (All)',
  action: 'একশন (Action)',
  alert: 'সতর্কতা (Alert)',
  av: 'অডিও/ভিডিও (AV)',
  communication: 'যোগাযোগ (Comm)',
  content: 'কনটেন্ট (Content)',
  device: 'ডিভাইস (Device)',
  editor: 'এডিটর (Editor)',
  file: 'ফাইল (File)',
  hardware: 'হার্ডওয়্যার (Hardware)',
  home: 'হোম (Home)',
  image: 'ইমেজ (Image)',
  maps: 'ম্যাপস (Maps)',
  navigation: 'নেভিগেশন (Nav)',
  notification: 'নোটিফিকেশন (Notif)',
  places: 'প্লেসেস (Places)',
  search: 'সার্চ (Search)',
  social: 'সোশ্যাল (Social)',
  toggle: 'টগল (Toggle)',
};

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalResults,
  totalIcons,
  style,
  onStyleChange,
  sortBy,
  onSortByChange,
  lang,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: press '/' or 'Ctrl+K' / 'Cmd+K' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full bg-white border-b border-neutral-200 py-4 px-4 sm:px-6 lg:px-8 space-y-3">
      {/* Top row: Main Search Input & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'আইকনের নাম বা কীওয়ার্ড দিয়ে সার্চ করুন (যেমন: search, home, user, heart)...'
                : 'Search Google icons by name or tag (e.g. search, home, user, heart)...'
            }
            className="w-full pl-10 pr-20 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-300 focus:border-blue-500 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-3 focus:ring-blue-100 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  inputRef.current?.focus();
                }}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono text-neutral-400 bg-neutral-200/80 rounded">
              ⌘K
            </span>
          </div>
        </div>

        {/* Style Selector (Mobile visible) & Sort dropdown */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Mobile Style Switcher */}
          <div className="flex lg:hidden items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
            {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => onStyleChange(s)}
                className={`px-2 py-1 rounded capitalize ${
                  style === s ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-neutral-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort Option */}
          <button
            onClick={() => onSortByChange(sortBy === 'popularity' ? 'name' : 'popularity')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors shrink-0"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span>
              {sortBy === 'popularity'
                ? (lang === 'bn' ? 'জনপ্রিয়তা অনুযায়ী' : 'Popularity')
                : (lang === 'bn' ? 'নাম অনুযায়ী (A-Z)' : 'Name (A-Z)')}
            </span>
          </button>
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
          }`}
        >
          {lang === 'bn' ? 'সব ক্যাটাগরি (All)' : 'All Categories'}
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const label = lang === 'bn' ? (CATEGORY_NAMES_BN[cat] || cat) : cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 rounded-full capitalize whitespace-nowrap font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Suggested Quick Tags & Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-neutral-400 font-medium">
            {lang === 'bn' ? 'পপুলার কীওয়ার্ড:' : 'Quick tags:'}
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onSearchChange(tag)}
              className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-blue-50 hover:text-blue-700 text-neutral-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="font-medium text-neutral-600">
          {lang === 'bn'
            ? `${totalResults.toLocaleString()} টি আইকন পাওয়া গেছে`
            : `${totalResults.toLocaleString()} ${totalResults === 1 ? 'icon' : 'icons'} found`}
        </div>
      </div>
    </div>
  );
};
