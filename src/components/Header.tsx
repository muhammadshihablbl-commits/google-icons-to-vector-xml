import React from 'react';
import { IconStyle } from '../types';
import { Download, HelpCircle, Upload, FileSearch, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  style: IconStyle;
  onStyleChange: (style: IconStyle) => void;
  isFilled: boolean;
  onFilledChange: (filled: boolean) => void;
  selectedCount: number;
  onOpenBatchModal: () => void;
  onOpenHelp: () => void;
  onOpenDevTools: (tab: 'svg-to-xml' | 'xml-inspector') => void;
  totalIcons: number;
  lang: 'en' | 'bn';
  onToggleLang: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  style,
  onStyleChange,
  isFilled,
  onFilledChange,
  selectedCount,
  onOpenBatchModal,
  onOpenHelp,
  onOpenDevTools,
  totalIcons,
  lang,
  onToggleLang,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">android</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 dark:text-white tracking-tight truncate">
                  {lang === 'bn' ? 'গুগল আইকন ভেক্টর এক্সএমএল' : 'Google Icons to Vector XML'}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {totalIcons > 0 ? `${totalIcons.toLocaleString()} Icons` : '2,100+ Icons'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:block truncate">
                {lang === 'bn'
                  ? 'fonts.google.com থেকে অফিশিয়াল আইকন লাইব্রেরি ও অ্যান্ড্রয়েড ভেক্টর জেনারেটর'
                  : 'Official Material Symbols with Android VectorDrawable XML generator'}
              </p>
            </div>
          </div>

          {/* Right Controls: Dev Tools, Style, Fill, Batch & Lang */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick DevTools Buttons: 1. SVG to XML & 5. Reverse XML Inspector */}
            <div className="flex items-center bg-neutral-100/90 dark:bg-neutral-800/90 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 gap-1">
              <button
                onClick={() => onOpenDevTools('svg-to-xml')}
                title={lang === 'bn' ? 'কাস্টম SVG থেকে Vector XML রূপান্তর' : 'Convert custom SVG to Android Vector XML'}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-neutral-700 hover:bg-blue-50 dark:hover:bg-neutral-600 rounded-lg border border-blue-200 dark:border-blue-800 shadow-2xs transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'SVG → XML' : 'SVG to XML'}</span>
                <span className="inline sm:hidden">SVG</span>
              </button>

              <button
                onClick={() => onOpenDevTools('xml-inspector')}
                title={lang === 'bn' ? 'রিভার্স Vector XML প্রিভিউ ইন্সপেক্টর' : 'Reverse Android Vector XML visual inspector'}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-all"
              >
                <FileSearch className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'XML ইন্সপেক্টর' : 'XML Inspector'}</span>
                <span className="inline sm:hidden">XML</span>
              </button>
            </div>

            {/* Style Pills (Outlined / Rounded / Sharp) - Hidden on mobile */}
            <div className="hidden xl:flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
              {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStyleChange(s)}
                  className={`px-2 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                    style === s
                      ? 'bg-white dark:bg-neutral-700 text-blue-700 dark:text-blue-300 shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Fill Toggle */}
            <button
              onClick={() => onFilledChange(!isFilled)}
              title={isFilled ? 'Switch to Outline' : 'Switch to Filled'}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isFilled
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              <span
                className={`material-symbols-${style} text-[16px] sm:text-[18px]`}
                style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
              <span className="hidden lg:inline">{isFilled ? (lang === 'bn' ? 'ভরাট' : 'Filled') : (lang === 'bn' ? 'আউটলাইন' : 'Outlined')}</span>
            </button>

            {/* Batch Download button if icons selected */}
            {selectedCount > 0 && (
              <button
                onClick={onOpenBatchModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{selectedCount} XML</span>
              </button>
            )}

            {/* Help / Guide */}
            <button
              onClick={onOpenHelp}
              title={lang === 'bn' ? 'ব্যবহার নির্দেশিকা' : 'How to use in Android Studio'}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? (lang === 'bn' ? 'লাইট মোড' : 'Light Mode') : (lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode')}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-2 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
