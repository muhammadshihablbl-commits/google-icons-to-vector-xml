import React, { useState, useEffect, useMemo } from 'react';
import { GoogleIconItem, IconStyle, VectorXmlOptions } from '../types';
import {
  fetchIconSvg,
  generateVectorXml,
  triggerFileDownload,
  getAndroidDrawableName,
  getAndroidSnippets,
  parseSvg,
} from '../utils/vectorXml';
import {
  X,
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  Sun,
  Moon,
  Grid,
} from 'lucide-react';

interface XmlDetailModalProps {
  icon: GoogleIconItem | null;
  style: IconStyle;
  isFilled: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

const COLOR_PRESETS = [
  { label: 'Black (#000)', value: '#FF000000', display: '#000000' },
  { label: 'White (#FFF)', value: '#FFFFFFFF', display: '#FFFFFF' },
  { label: 'Google Blue', value: '#FF1A73E8', display: '#1A73E8' },
  { label: 'Google Green', value: '#FF34A853', display: '#34A853' },
  { label: 'Google Red', value: '#FFEA4335', display: '#EA4335' },
  { label: 'Google Yellow', value: '#FFFBBC04', display: '#FBBC04' },
  { label: 'Android Black', value: '@android:color/black', display: '#222222' },
  { label: 'Android White', value: '@android:color/white', display: '#F5F5F5' },
  { label: 'Theme Color', value: '?attr/colorControlNormal', display: '#64748b' },
];

const SIZE_PRESETS = [16, 20, 24, 32, 40, 48, 64];

export const XmlDetailModal: React.FC<XmlDetailModalProps> = ({
  icon,
  style: initialStyle,
  isFilled: initialFilled,
  onClose,
  lang,
}) => {
  const [style, setStyle] = useState<IconStyle>(initialStyle);
  const [isFilled, setIsFilled] = useState<boolean>(initialFilled);
  const [sizeDp, setSizeDp] = useState<number>(24);
  const [fillColor, setFillColor] = useState<string>('#FF000000');
  const [tint, setTint] = useState<string>('');
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'checker'>('checker');
  const [activeTab, setActiveTab] = useState<'vector' | 'layout' | 'compose' | 'guide'>('vector');

  const [svgText, setSvgText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Sync with initial props when opened
  useEffect(() => {
    setStyle(initialStyle);
    setIsFilled(initialFilled);
  }, [initialStyle, initialFilled]);

  // Fetch SVG whenever icon, style or fill changes
  useEffect(() => {
    if (!icon) return;
    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetchIconSvg(icon.name, style, isFilled)
      .then((svg) => {
        if (!isCancelled) {
          setSvgText(svg);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'Failed to load icon SVG');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [icon, style, isFilled]);

  // Generate Vector XML
  const vectorXml = useMemo(() => {
    if (!icon || !svgText) return '';
    const options: VectorXmlOptions = {
      widthDp: sizeDp,
      heightDp: sizeDp,
      fillColor,
      tint: tint || undefined,
      style,
      isFilled,
      compatMode: 'group',
    };
    return generateVectorXml(icon.name, svgText, options);
  }, [icon, svgText, sizeDp, fillColor, tint, style, isFilled]);

  // Extract path data only
  const pathDataOnly = useMemo(() => {
    if (!svgText) return '';
    const parsed = parseSvg(svgText);
    return parsed.paths.join('\n');
  }, [svgText]);

  // Snippets
  const snippets = useMemo(() => {
    if (!icon) return { xmlLayout: '', jetpackCompose: '', resourceFileName: '' };
    return getAndroidSnippets(icon.name, {
      widthDp: sizeDp,
      heightDp: sizeDp,
      fillColor,
      style,
      isFilled,
      compatMode: 'group',
    });
  }, [icon, sizeDp, fillColor, style, isFilled]);

  // Copy code handler
  const handleCopyCode = async () => {
    if (!vectorXml) return;
    try {
      await navigator.clipboard.writeText(vectorXml);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Copy path handler
  const handleCopyPath = async () => {
    if (!pathDataOnly) return;
    try {
      await navigator.clipboard.writeText(pathDataOnly);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Copy snippet handler
  const handleCopySnippet = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Download XML file
  const handleDownloadXml = () => {
    if (!icon || !vectorXml) return;
    const fileName = `${getAndroidDrawableName(icon.name)}.xml`;
    triggerFileDownload(vectorXml, fileName, 'application/xml');
  };

  // Download SVG file
  const handleDownloadSvg = () => {
    if (!icon || !svgText) return;
    const fileName = `${icon.name}_${style}.svg`;
    triggerFileDownload(svgText, fileName, 'image/svg+xml');
  };

  if (!icon) return null;

  const drawableName = getAndroidDrawableName(icon.name);

  // Compute visual preview color
  const previewColor = fillColor.startsWith('#')
    ? (fillColor.length === 9 ? `#${fillColor.slice(3)}` : fillColor)
    : fillColor.includes('white')
    ? '#ffffff'
    : '#000000';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <span className={`material-symbols-${style} text-[24px]`}>{icon.name}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 truncate">{icon.name}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-200/70 text-neutral-700">
                  {drawableName}.xml
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-500">
                <span>{lang === 'bn' ? 'ক্যাটাগরি:' : 'Categories:'}</span>
                {icon.categories.map((c) => (
                  <span key={c} className="capitalize text-neutral-700 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadXml}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'এক্সএমএল ডাউনলোড' : 'Download XML'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/70 transition-colors"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left controls & Right code viewer */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* Left Column: Interactive Icon Preview & Controls (5 cols) */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col gap-4 overflow-y-auto bg-neutral-50/40">
            {/* Canvas Preview Area */}
            <div className="relative flex flex-col items-center justify-center p-6 rounded-xl border border-neutral-200 shadow-xs min-h-[220px]">
              {/* Background mode switcher */}
              <div className="absolute top-2.5 right-2.5 flex items-center bg-white/90 backdrop-blur-xs p-0.5 rounded-lg border border-neutral-200 text-neutral-600 shadow-xs">
                <button
                  onClick={() => setBgMode('checker')}
                  className={`p-1 rounded ${bgMode === 'checker' ? 'bg-blue-50 text-blue-600' : 'hover:bg-neutral-100'}`}
                  title="Checkerboard (Transparent)"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setBgMode('light')}
                  className={`p-1 rounded ${bgMode === 'light' ? 'bg-blue-50 text-blue-600' : 'hover:bg-neutral-100'}`}
                  title="Light background"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setBgMode('dark')}
                  className={`p-1 rounded ${bgMode === 'dark' ? 'bg-blue-50 text-blue-600' : 'hover:bg-neutral-100'}`}
                  title="Dark background"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Icon rendering container */}
              <div
                className={`w-40 h-40 rounded-xl flex items-center justify-center transition-all ${
                  bgMode === 'dark'
                    ? 'bg-neutral-900 border border-neutral-800'
                    : bgMode === 'light'
                    ? 'bg-white border border-neutral-200'
                    : 'checkerboard-bg border border-neutral-200'
                }`}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading SVG...</span>
                  </div>
                ) : (
                  <span
                    className={`material-symbols-${style} transition-all duration-150`}
                    style={{
                      fontSize: `${Math.min(sizeDp * 2.2, 110)}px`,
                      color: previewColor,
                      fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {icon.name}
                  </span>
                )}
              </div>

              <div className="mt-2 text-center">
                <span className="text-xs font-mono text-neutral-500">
                  {sizeDp}dp × {sizeDp}dp | {style} {isFilled ? '(filled)' : '(outlined)'}
                </span>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="space-y-3.5 text-xs">
              {/* Style & Fill row */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">
                  {lang === 'bn' ? 'স্টাইল ও ফিল:' : 'Icon Style & Fill:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['outlined', 'rounded', 'sharp'] as IconStyle[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`py-1.5 px-2 rounded-lg capitalize font-medium border text-center transition-all ${
                        style === s
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-200">
                  <span className="font-medium text-neutral-700">
                    {lang === 'bn' ? 'ভরাট আইকন (Fill 1)' : 'Filled State (Fill 1)'}
                  </span>
                  <button
                    onClick={() => setIsFilled(!isFilled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isFilled ? 'bg-blue-600' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isFilled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Size preset pills */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">
                  {lang === 'bn' ? 'আইকনের সাইজ (dp):' : 'Dimension (dp):'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SIZE_PRESETS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSizeDp(s)}
                      className={`px-2.5 py-1 rounded-md font-mono border text-xs font-medium transition-all ${
                        sizeDp === s
                          ? 'bg-neutral-900 border-neutral-900 text-white'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {s}dp
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">
                  {lang === 'bn' ? 'ফিল কালার (android:fillColor):' : 'Fill Color (android:fillColor):'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setFillColor(c.value)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left truncate transition-all ${
                        fillColor === c.value
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: c.display }}
                      />
                      <span className="truncate text-[11px]">{c.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="color"
                    value={fillColor.startsWith('#') ? (fillColor.length === 9 ? `#${fillColor.slice(3)}` : fillColor) : '#000000'}
                    onChange={(e) => setFillColor(`#FF${e.target.value.replace('#', '').toUpperCase()}`)}
                    className="w-8 h-8 rounded border border-neutral-300 cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    placeholder="#FF000000 or @color/my_color"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 font-mono text-xs text-neutral-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Quick Export Action Buttons in Left column for mobile */}
            <div className="mt-auto pt-3 border-t border-neutral-200 flex flex-col gap-2">
              <button
                onClick={handleDownloadXml}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ডাউনলোড Vector XML (.xml)' : 'Download Vector XML (.xml)'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyCode}
                  className="py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : (lang === 'bn' ? 'কোড কপি করুন' : 'Copy XML')}</span>
                </button>

                <button
                  onClick={handleDownloadSvg}
                  className="py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Code & Code Snippets Tabs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-neutral-900 text-neutral-100">
            {/* Code Tabs Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 text-xs shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('vector')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'vector' ? 'bg-neutral-800 text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Vector XML</span>
                </button>
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'layout' ? 'bg-neutral-800 text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>XML Layout</span>
                </button>
                <button
                  onClick={() => setActiveTab('compose')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'compose' ? 'bg-neutral-800 text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>Jetpack Compose</span>
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'guide' ? 'bg-neutral-800 text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ব্যবহার গাইড' : 'Android Guide'}</span>
                </button>
              </div>

              {/* Code Actions */}
              <div className="flex items-center gap-2">
                {activeTab === 'vector' && (
                  <button
                    onClick={handleCopyPath}
                    className="px-2 py-1 text-[11px] font-mono text-neutral-400 hover:text-neutral-200 rounded hover:bg-neutral-800 transition-colors"
                    title="Copy pathData attribute only"
                  >
                    {copiedPath ? 'Path Copied!' : 'Copy pathData'}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (activeTab === 'vector') handleCopyCode();
                    else if (activeTab === 'layout') handleCopySnippet(snippets.xmlLayout);
                    else if (activeTab === 'compose') handleCopySnippet(snippets.jetpackCompose);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors"
                >
                  {copiedCode || copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'কপি' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Content Area */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed select-text">
              {activeTab === 'vector' && (
                <div className="relative">
                  <pre className="text-neutral-300 font-mono whitespace-pre overflow-x-auto p-2">
                    <code>{vectorXml}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-4">
                  <p className="text-neutral-400 font-sans text-xs">
                    {lang === 'bn'
                      ? 'অ্যান্ড্রয়েড XML লেআউট ফাইলে (যেমন activity_main.xml) এই ImageView কোড ব্যবহার করুন:'
                      : 'Paste this snippet in your Android XML Layout file (e.g. res/layout/activity_main.xml):'}
                  </p>
                  <pre className="bg-neutral-950 p-3 rounded-lg text-blue-300 overflow-x-auto">
                    <code>{snippets.xmlLayout}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'compose' && (
                <div className="space-y-4">
                  <p className="text-neutral-400 font-sans text-xs">
                    {lang === 'bn'
                      ? 'Jetpack Compose-এ এই আইকনটি ব্যবহার করতে Kotlin ফাইলে লিখুন:'
                      : 'Use this snippet in your Jetpack Compose Kotlin UI code:'}
                  </p>
                  <pre className="bg-neutral-950 p-3 rounded-lg text-emerald-300 overflow-x-auto">
                    <code>{snippets.jetpackCompose}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'guide' && (
                <div className="space-y-4 font-sans text-xs text-neutral-300">
                  <h3 className="text-sm font-semibold text-white">
                    {lang === 'bn' ? 'অ্যান্ড্রয়েড স্টুডিওতে ব্যবহারের নিয়ম:' : 'How to use in Android Studio:'}
                  </h3>

                  <ol className="list-decimal list-inside space-y-2.5 text-neutral-300">
                    <li>
                      <strong className="text-white">
                        {lang === 'bn' ? 'ফাইল ডাউনলোড করুন:' : '1. Download the XML file:'}
                      </strong>{' '}
                      {lang === 'bn'
                        ? `"${drawableName}.xml" ফাইলে ক্লিক করে ডাউনলোড করুন।`
                        : `Click "Download XML" to get "${drawableName}.xml".`}
                    </li>
                    <li>
                      <strong className="text-white">
                        {lang === 'bn' ? 'drawable ফোল্ডারে পেস্ট করুন:' : '2. Place in drawable folder:'}
                      </strong>{' '}
                      {lang === 'bn'
                        ? 'আপনার অ্যান্ড্রয়েড স্টুডিও প্রোজেক্টের `app/src/main/res/drawable/` ফোল্ডারে ফাইলটি পেস্ট করুন।'
                        : 'Copy the file into your Android Studio project at `app/src/main/res/drawable/`.'}
                    </li>
                    <li>
                      <strong className="text-white">
                        {lang === 'bn' ? 'লেআউটে ব্যবহার করুন:' : '3. Reference in UI:'}
                      </strong>{' '}
                      {lang === 'bn'
                        ? `XML-এ \`@drawable/${drawableName}\` অথবা কোড থেকে \`R.drawable.${drawableName}\` ব্যবহার করুন।`
                        : `Use \`@drawable/${drawableName}\` in XML or \`R.drawable.${drawableName}\` in Kotlin/Java.`}
                    </li>
                  </ol>

                  <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg text-blue-200 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      {lang === 'bn' ? 'কেন ভেক্টর এক্সএমএল (Vector XML)?' : 'Why Vector XML?'}
                    </p>
                    <p className="text-[11px] text-blue-300">
                      {lang === 'bn'
                        ? 'ভেক্টর এক্সএমএল ফাইলগুলো যে কোনো স্ক্রিন সাইজে (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) ফেটে না গিয়ে ক্রিস্প থাকে এবং APK-এর সাইজ অনেক কমিয়ে রাখে।'
                        : 'VectorDrawables scale losslessly to any Android device resolution (mdpi to xxxhdpi) without blurriness, keeping your APK size minimal.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom status line */}
            <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between shrink-0">
              <span>Standard Android VectorDrawable XML</span>
              <span>API 21+ Compatible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
