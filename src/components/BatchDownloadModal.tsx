import React, { useState } from 'react';
import { GoogleIconItem, IconStyle, VectorXmlOptions } from '../types';
import { fetchIconSvg, downloadBatchAsZip, getAndroidDrawableName } from '../utils/vectorXml';
import { X, Download, Check, AlertCircle, Loader2 } from 'lucide-react';

interface BatchDownloadModalProps {
  selectedNames: string[];
  allIcons: GoogleIconItem[];
  style: IconStyle;
  isFilled: boolean;
  onClose: () => void;
  onClearSelection: () => void;
  lang: 'en' | 'bn';
}

export const BatchDownloadModal: React.FC<BatchDownloadModalProps> = ({
  selectedNames,
  allIcons,
  style,
  isFilled,
  onClose,
  onClearSelection,
  lang,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [sizeDp, setSizeDp] = useState<number>(24);
  const [fillColor, setFillColor] = useState<string>('#FF000000');
  const [error, setError] = useState<string | null>(null);

  const selectedIcons = allIcons.filter((i) => selectedNames.includes(i.name));

  const handleStartDownload = async () => {
    if (selectedIcons.length === 0) return;
    setDownloading(true);
    setError(null);
    setProgress({ current: 0, total: selectedIcons.length });

    try {
      const iconData: Array<{ name: string; svgText: string }> = [];

      // Fetch SVGs in batches of 5 to avoid overwhelming network
      for (let i = 0; i < selectedIcons.length; i++) {
        const item = selectedIcons[i];
        try {
          const svgText = await fetchIconSvg(item.name, style, isFilled);
          iconData.push({ name: item.name, svgText });
        } catch (e) {
          console.error(`Failed to fetch ${item.name}`, e);
        }
        setProgress({ current: i + 1, total: selectedIcons.length });
      }

      const options: VectorXmlOptions = {
        widthDp: sizeDp,
        heightDp: sizeDp,
        fillColor,
        style,
        isFilled,
        compatMode: 'group',
      };

      await downloadBatchAsZip(iconData, options);
      setTimeout(() => {
        setDownloading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate ZIP');
      setDownloading(false);
    }
  };

  const percentage = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {lang === 'bn' ? 'একসাথে একাধিক XML ডাউনলোড করুন' : 'Batch Vector XML Export'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'bn'
                  ? `${selectedIcons.length} টি আইকন সিলেক্ট করা হয়েছে`
                  : `${selectedIcons.length} ${selectedIcons.length === 1 ? 'icon' : 'icons'} selected`}
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

        {/* Selected preview tags */}
        <div className="max-h-32 overflow-y-auto p-2 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-wrap gap-1.5 text-xs">
          {selectedIcons.map((i) => (
            <span
              key={i.name}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700 font-mono text-[11px]"
            >
              <span className={`material-symbols-${style} text-[14px]`}>{i.name}</span>
              <span>{getAndroidDrawableName(i.name)}.xml</span>
            </span>
          ))}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-neutral-700 font-medium mb-1">
              {lang === 'bn' ? 'সাইজ (dp):' : 'Icon Size (dp):'}
            </label>
            <select
              value={sizeDp}
              onChange={(e) => setSizeDp(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-800"
            >
              <option value={16}>16dp × 16dp</option>
              <option value={20}>20dp × 20dp</option>
              <option value={24}>24dp × 24dp (Standard)</option>
              <option value={32}>32dp × 32dp</option>
              <option value={48}>48dp × 48dp</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 font-medium mb-1">
              {lang === 'bn' ? 'ফিল কালার:' : 'Fill Color:'}
            </label>
            <select
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-800"
            >
              <option value="#FF000000">Black (#000000)</option>
              <option value="#FFFFFFFF">White (#FFFFFF)</option>
              <option value="@android:color/black">@android:color/black</option>
              <option value="@android:color/white">@android:color/white</option>
              <option value="?attr/colorControlNormal">?attr/colorControlNormal</option>
            </select>
          </div>
        </div>

        {/* Progress Bar if downloading */}
        {downloading && progress && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-600 font-medium">
              <span>{lang === 'bn' ? 'ভেক্টর এক্সএমএল তৈরি হচ্ছে...' : 'Generating Vector XML files...'}</span>
              <span>
                {progress.current} / {progress.total} ({percentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-150"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <button
            onClick={onClearSelection}
            disabled={downloading}
            className="px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            {lang === 'bn' ? 'সিলেকশন মুছুন' : 'Clear Selection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={downloading}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              onClick={handleStartDownload}
              disabled={downloading || selectedIcons.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'bn' ? 'প্রসেসিং...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ZIP ডাউনলোড করুন' : 'Download ZIP Archive'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
