import React from 'react';
import { X, CheckCircle2, FolderCheck, Code, Smartphone, Sparkles, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, lang }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {lang === 'bn'
                  ? 'অ্যান্ড্রয়েড স্টুডিওতে ভেক্টর এক্সএমএল ব্যবহার নির্দেশিকা'
                  : 'Android Studio Vector XML Guide'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'bn'
                  ? 'গুগল আইকন সহজেই আপনার অ্যান্ড্রয়েড অ্যাপে যুক্ত করুন'
                  : 'How to import and use Google Icons in Android apps'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900">
                {lang === 'bn' ? '১. আইকন সার্চ ও ডাউনলোড করুন' : '1. Search & Download Icon'}
              </h4>
              <p className="text-neutral-600">
                {lang === 'bn'
                  ? 'আপনার পছন্দমতো যেকোনো গুগল আইকন সার্চ করুন এবং "Download XML" বাটনে ক্লিক করে .xml ফাইল ডাউনলোড করুন। অথবা কোড সরাসরি কপি করুন।'
                  : 'Search for any icon from the library and click "Download XML" to get the ready-to-use .xml file, or copy the vector code directly.'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900">
                {lang === 'bn' ? '২. প্রজেক্টের drawable ফোল্ডারে রাখুন' : '2. Paste into res/drawable folder'}
              </h4>
              <p className="text-neutral-600">
                {lang === 'bn'
                  ? 'ডাউনলোড করা ফাইলটি আপনার অ্যান্ড্রয়েড প্রজেক্টের এই ডিরেক্টরিতে পেস্ট করুন:'
                  : 'Copy the downloaded .xml file into your Android Studio project at:'}
              </p>
              <div className="font-mono bg-neutral-900 text-blue-300 p-2 rounded-lg text-[11px]">
                app/src/main/res/drawable/ic_example.xml
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              3
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-900">
                {lang === 'bn' ? '৩. লেআউট বা কোডে ব্যবহার করুন' : '3. Reference in XML Layout or Jetpack Compose'}
              </h4>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="bg-neutral-900 text-neutral-200 p-2.5 rounded-lg space-y-1">
                  <span className="text-neutral-400 font-sans block text-[10px] uppercase tracking-wider">
                    XML Layout (e.g. activity_main.xml):
                  </span>
                  <code>&lt;ImageView android:layout_width="24dp" android:layout_height="24dp" android:src="@drawable/ic_search" /&gt;</code>
                </div>

                <div className="bg-neutral-900 text-emerald-300 p-2.5 rounded-lg space-y-1">
                  <span className="text-neutral-400 font-sans block text-[10px] uppercase tracking-wider">
                    Jetpack Compose (Kotlin):
                  </span>
                  <code>Icon(painter = painterResource(id = R.drawable.ic_search), contentDescription = "Search")</code>
                </div>
              </div>
            </div>
          </div>

          {/* Advantages Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'bn' ? 'কেন পিএনজি (PNG) এর বদলে ভেক্টর এক্সএমএল?' : 'Why Vector XML instead of PNG?'}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-800">
              <li>
                {lang === 'bn'
                  ? 'সব স্ক্রিন রেজোলিউশনে (mdpi, hdpi, xhdpi, xxhdpi) শতভাগ শার্প ও ক্রিস্প থাকে।'
                  : 'Lossless crisp clarity on all screen densities without needing multiple density folders.'}
              </li>
              <li>
                {lang === 'bn'
                  ? 'অ্যাপের সাইজ অনেক ছোট হয় এবং কালার বা সাইজ পরিবর্তন করা অত্যন্ত সহজ।'
                  : 'Dramatically reduces APK file size and allows dynamic tinting & color changes via code.'}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <a
            href="https://fonts.google.com/icons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>fonts.google.com/icons</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded-xl shadow-xs transition-colors"
          >
            {lang === 'bn' ? 'বুঝেছি / ঠিক আছে' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
};
