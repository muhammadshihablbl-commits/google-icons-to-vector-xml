import React from 'react';
import { IconStyle } from '../types';
import { Sparkles, Download, Layers, HelpCircle, Palette } from 'lucide-react';

interface HeaderProps {
  style: IconStyle;
  onStyleChange: (style: IconStyle) => void;
  isFilled: boolean;
  onFilledChange: (filled: boolean) => void;
  selectedCount: number;
  onOpenBatchModal: () => void;
  onOpenHelp: () => void;
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
  totalIcons,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">android</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight truncate">
                  {lang === 'bn' ? 'গুগল আইকন ভেক্টর এক্সএমএল' : 'Google Icons to Vector XML'}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
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

          {/* Right Controls: Style, Fill, Batch & Lang */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Style Pills (Outlined / Rounded / Sharp) */}
            <div className="hidden lg:flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStyleChange(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isFilled
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span
                className={`material-symbols-${style} text-[18px]`}
                style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
              >
                {isFilled ? 'star' : 'star'}
              </span>
              <span className="hidden sm:inline">{isFilled ? (lang === 'bn' ? 'ভরাট (Fill)' : 'Filled') : (lang === 'bn' ? 'আউটলাইন (Outline)' : 'Outlined')}</span>
            </button>

            {/* Batch Download button if icons selected */}
            {selectedCount > 0 && (
              <button
                onClick={onOpenBatchModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{selectedCount} XML (ZIP)</span>
              </button>
            )}

            {/* Help / Guide */}
            <button
              onClick={onOpenHelp}
              title={lang === 'bn' ? 'ব্যবহার নির্দেশিকা' : 'How to use in Android Studio'}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
