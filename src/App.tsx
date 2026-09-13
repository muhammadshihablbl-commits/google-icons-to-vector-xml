import React, { useState, useEffect, useMemo } from 'react';
import { GoogleIconItem, IconStyle } from './types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { IconGrid } from './components/IconGrid';
import { XmlDetailModal } from './components/XmlDetailModal';
import { BatchDownloadModal } from './components/BatchDownloadModal';
import { BatchActionBar } from './components/BatchActionBar';
import { HelpModal } from './components/HelpModal';
import { DevToolsModal } from './components/DevToolsModal';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [icons, setIcons] = useState<GoogleIconItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');

  // Icon Display Settings
  const [style, setStyle] = useState<IconStyle>('outlined');
  const [isFilled, setIsFilled] = useState<boolean>(false);

  // Selection & Modals
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const [inspectingIcon, setInspectingIcon] = useState<GoogleIconItem | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState<boolean>(false);
  const [devToolsTab, setDevToolsTab] = useState<'svg-to-xml' | 'xml-inspector'>('svg-to-xml');

  // Language: 'bn' (Bengali) by default since user asked in Bengali, with English toggle
  const [lang, setLang] = useState<'en' | 'bn'>('bn');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme-mode');
    if (stored) {
      return stored === 'dark';
    }
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme-mode');
      if (!stored) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy API
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Fetch icons metadata on load
  const loadIcons = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
      const res = await fetch(`${baseUrl}data/icons.json`);
      if (!res.ok) {
        throw new Error(`Failed to load icons metadata (Status: ${res.status})`);
      }
      const data: GoogleIconItem[] = await res.json();
      setIcons(data);
    } catch (err: any) {
      setError(err.message || 'Error loading Google Icons data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIcons();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    icons.forEach((i) => {
      (i.categories || []).forEach((c) => catSet.add(c));
    });
    return Array.from(catSet).sort();
  }, [icons]);

  // Filtered and sorted icons
  const filteredIcons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = icons.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && !item.categories.includes(selectedCategory)) {
        return false;
      }
      // Query filter
      if (!query) return true;
      if (item.name.toLowerCase().includes(query)) return true;
      if (item.tags.some((t) => t.toLowerCase().includes(query))) return true;
      return false;
    });

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return result;
  }, [icons, searchQuery, selectedCategory, sortBy]);

  // Selection handlers
  const handleToggleSelect = (name: string) => {
    setSelectedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedNames((prev) => {
      const next = new Set(prev);
      filteredIcons.forEach((i) => next.add(i.name));
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedNames(new Set());
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">
        {/* Sticky Header */}
        <Header
          style={style}
          onStyleChange={setStyle}
          isFilled={isFilled}
          onFilledChange={setIsFilled}
          selectedCount={selectedNames.size}
          onOpenBatchModal={() => setIsBatchModalOpen(true)}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onOpenDevTools={(tab) => {
            setDevToolsTab(tab);
            setIsDevToolsOpen(true);
          }}
          totalIcons={icons.length}
          lang={lang}
          onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Main Search and Filtering Area */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          totalResults={filteredIcons.length}
          totalIcons={icons.length}
          style={style}
          onStyleChange={setStyle}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          lang={lang}
          isDarkMode={isDarkMode}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {lang === 'bn' ? 'গুগল আইকন লাইব্রেরি লোড হচ্ছে...' : 'Loading Google Icons library...'}
              </p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                {lang === 'bn' ? 'আইকন লোড করতে সমস্যা হয়েছে' : 'Failed to load icons'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">{error}</p>
              <button
                onClick={loadIcons}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-black dark:hover:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry'}</span>
              </button>
            </div>
          ) : (
            <IconGrid
              icons={filteredIcons}
              style={style}
              isFilled={isFilled}
              selectedNames={selectedNames}
              onToggleSelect={handleToggleSelect}
              onSelectAllFiltered={handleSelectAllFiltered}
              onDeselectAll={handleDeselectAll}
              onSelectIcon={(icon) => setInspectingIcon(icon)}
              searchQuery={searchQuery}
              onClearSearch={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              lang={lang}
              isDarkMode={isDarkMode}
            />
          )}
        </main>

        {/* Floating Bottom Batch Action Bar */}
        <BatchActionBar
          selectedCount={selectedNames.size}
          onOpenBatchModal={() => setIsBatchModalOpen(true)}
          onClearSelection={handleDeselectAll}
          lang={lang}
          isDarkMode={isDarkMode}
        />

        {/* Vector XML Inspector Modal */}
        {inspectingIcon && (
          <XmlDetailModal
            icon={inspectingIcon}
            style={style}
            isFilled={isFilled}
            onClose={() => setInspectingIcon(null)}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Batch Export Modal */}
        {isBatchModalOpen && (
          <BatchDownloadModal
            selectedNames={Array.from(selectedNames)}
            allIcons={icons}
            style={style}
            isFilled={isFilled}
            onClose={() => setIsBatchModalOpen(false)}
            onClearSelection={handleDeselectAll}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Help Modal */}
        {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} lang={lang} isDarkMode={isDarkMode} />}

        {/* DevTools Toolbox Modal (1. Custom SVG to XML & 5. Reverse Vector XML Inspector) */}
        {isDevToolsOpen && (
          <DevToolsModal
            initialTab={devToolsTab}
            onClose={() => setIsDevToolsOpen(false)}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 px-4 text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5">
          <p>
            {lang === 'bn'
              ? 'সকল আইকন fonts.google.com/icons (Google Material Symbols) থেকে সরাসরি সংগৃহীত এবং Apache 2.0 লাইসেন্সের অধীন।'
              : 'All icons sourced directly from fonts.google.com/icons (Google Material Symbols) under Apache License 2.0.'}
          </p>
          <p className="text-neutral-400 dark:text-neutral-600 text-[11px]">
            Android VectorDrawable XML is fully compatible with Android Studio, Jetpack Compose, and Android API 21+.
          </p>
        </footer>
      </div>
    </div>
  );
}
