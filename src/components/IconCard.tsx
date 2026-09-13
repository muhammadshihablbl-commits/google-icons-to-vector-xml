import React, { useState } from 'react';
import { GoogleIconItem, IconStyle, VectorXmlOptions } from '../types';
import { Download, Copy, Check, Code, ExternalLink } from 'lucide-react';
import { fetchIconSvg, generateVectorXml, triggerFileDownload, getAndroidDrawableName } from '../utils/vectorXml';

interface IconCardProps {
  icon: GoogleIconItem;
  style: IconStyle;
  isFilled: boolean;
  isSelected: boolean;
  onToggleSelect: (name: string) => void;
  onSelectIcon: (icon: GoogleIconItem) => void;
  lang: 'en' | 'bn';
}

export const IconCard: React.FC<IconCardProps> = ({
  icon,
  style,
  isFilled,
  isSelected,
  onToggleSelect,
  onSelectIcon,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Quick copy XML without opening the drawer
  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const svgText = await fetchIconSvg(icon.name, style, isFilled);
      const options: VectorXmlOptions = {
        widthDp: 24,
        heightDp: 24,
        fillColor: '#FF000000',
        style,
        isFilled,
        compatMode: 'group',
      };
      const xml = generateVectorXml(icon.name, svgText, options);
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Quick download XML without opening the drawer
  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      const svgText = await fetchIconSvg(icon.name, style, isFilled);
      const options: VectorXmlOptions = {
        widthDp: 24,
        heightDp: 24,
        fillColor: '#FF000000',
        style,
        isFilled,
        compatMode: 'group',
      };
      const xml = generateVectorXml(icon.name, svgText, options);
      const fileName = `${getAndroidDrawableName(icon.name)}.xml`;
      triggerFileDownload(xml, fileName);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const fontClass = `material-symbols-${style}`;
  const fontSettings = isFilled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400";
  const drawableName = getAndroidDrawableName(icon.name);

  return (
    <div
      onClick={() => onSelectIcon(icon)}
      className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
          : 'bg-white hover:bg-neutral-50/80 border-neutral-200 hover:border-blue-300 hover:shadow-xs'
      }`}
    >
      {/* Checkbox for batch selection with enlarged touch target */}
      <div
        className="absolute top-1.5 left-1.5 z-10 p-2 rounded-lg hover:bg-neutral-100/80 transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(icon.name);
        }}
        role="button"
        aria-label={`Select ${icon.name}`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer pointer-events-none transition-opacity group-hover:opacity-100 opacity-70 data-checked:opacity-100"
        />
      </div>

      {/* Code icon badge on top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelectIcon(icon);
        }}
        title="Open Vector XML inspector"
        className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-blue-600 rounded transition-all"
      >
        <Code className="w-3.5 h-3.5" />
      </button>

      {/* Center: Material Symbol Rendering */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center my-1.5 transition-transform group-hover:scale-110 duration-150">
        <span
          className={`${fontClass} text-[36px] sm:text-[42px] text-neutral-800 group-hover:text-blue-600 transition-colors`}
          style={{ fontVariationSettings: fontSettings }}
        >
          {icon.name}
        </span>
      </div>

      {/* Bottom: Icon name & Drawable file name */}
      <div className="w-full text-center mt-1">
        <p className="text-xs font-semibold text-neutral-800 truncate px-1" title={icon.name}>
          {icon.name}
        </p>
        <p className="text-[10px] font-mono text-neutral-400 truncate px-1" title={`${drawableName}.xml`}>
          {drawableName}.xml
        </p>
      </div>

      {/* Hover action bar overlay */}
      <div className="w-full mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all">
        {/* Quick Copy XML */}
        <button
          onClick={handleQuickCopy}
          title={copied ? 'Copied!' : 'Copy Vector XML'}
          className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition-colors ${
            copied
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* Quick Download XML */}
        <button
          onClick={handleQuickDownload}
          title={downloading ? 'Downloading...' : 'Download Vector XML (.xml)'}
          className="flex items-center justify-center p-1.5 rounded-lg text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* View Details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectIcon(icon);
          }}
          title="Customize & View XML"
          className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-medium bg-neutral-900 hover:bg-black text-white text-center truncate transition-colors"
        >
          {lang === 'bn' ? 'এক্সএমএল দেখুন' : 'View XML'}
        </button>
      </div>
    </div>
  );
};
