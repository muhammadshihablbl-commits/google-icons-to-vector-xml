import React from 'react';
import { IconStyle } from '../types';
import { Sparkles, Download, HelpCircle, Upload, FileSearch } from 'lucide-react';

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
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">android</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 tracking-tight truncate">
                  {lang === 'bn' ? 'গুগল আইকন ভেক্টর এক্সএমএল' : 'Google Icons to Vector XML'}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {totalIcons > 0 ? `${totalIcons.toLocaleString()} Icons` : '2,100+ Icons'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 hidden md:block truncate">
                {lang === 'bn'
                  ? 'fonts.google.com থেকে অফিশিয়াল আইকন লাইব্রেরি ও অ্যান্ড্রয়েড ভেক্টর জেনারেটর'
                  : 'Official Material Symbols with Android VectorDrawable XML generator'}
              </p>
            </div>
          </div>

          {/* Right Controls: Dev Tools, Style, Fill, Batch & Lang */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick DevTools Buttons: 1. SVG to XML & 5. Reverse XML Inspector */}
            <div className="flex items-center bg-neutral-100/90 p-1 rounded-xl border border-neutral-200 gap-1">
              <button
                onClick={() => onOpenDevTools('svg-to-xml')}
                title={lang === 'bn' ? 'কাস্টম SVG থেকে Vector XML রূপান্তর' : 'Convert custom SVG to Android Vector XML'}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 shadow-2xs transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'SVG → XML' : 'SVG to XML'}</span>
                <span className="inline sm:hidden">SVG</span>
              </button>

              <button
                onClick={() => onOpenDevTools('xml-inspector')}
                title={lang === 'bn' ? 'রিভার্স Vector XML প্রিভিউ ইন্সপেক্টর' : 'Reverse Android Vector XML visual inspector'}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-blue-700 hover:bg-white rounded-lg transition-all"
              >
                <FileSearch className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'XML ইন্সপেক্টর' : 'XML Inspector'}</span>
                <span className="inline sm:hidden">XML</span>
              </button>
            </div>

            {/* Style Pills (Outlined / Rounded / Sharp) */}
            <div className="hidden xl:flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStyleChange(s)}
                  className={`px-2 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                    style === s
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
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
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
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
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{selectedCount} XML</span>
              </button>
            )}

            {/* Help / Guide */}
            <button
              onClick={onOpenHelp}
              title={lang === 'bn' ? 'ব্যবহার নির্দেশিকা' : 'How to use in Android Studio'}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-2 py-1 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
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
