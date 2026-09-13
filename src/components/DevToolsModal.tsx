import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Upload,
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  FileSearch,
  Grid,
  Sun,
  Moon,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import {
  convertSvgToVectorXml,
  parseVectorXmlToSvg,
  cssColorToAndroid,
  androidColorToCss,
} from '../utils/customConverters';
import { triggerFileDownload } from '../utils/vectorXml';
import { SyntaxHighlighter } from './SyntaxHighlighter';

interface DevToolsModalProps {
  initialTab?: 'svg-to-xml' | 'xml-inspector';
  onClose: () => void;
  lang: 'en' | 'bn';
}

const SAMPLE_SVGS = [
  {
    name: 'Shield Check',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    name: 'Android Bot',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3DDC84"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85.74c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.9 6 5.83 6 8h12c0-2.17-.97-4.1-2.47-5.24zM9 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>`,
  },
  {
    name: 'Shopping Cart',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  },
];

const SAMPLE_VECTOR_XMLS = [
  {
    name: 'Android Head',
    xml: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#3DDC84"
        android:pathData="M16.53,11.16l1.23,-2.13c0.16,-0.28 0.07,-0.64 -0.21,-0.8 -0.28,-0.16 -0.64,-0.07 -0.8,0.21l-1.26,2.18C14.28,10.23 13.17,10 12,10c-1.17,0 -2.28,0.23 -3.49,0.62L7.25,8.44c-0.16,-0.28 -0.52,-0.37 -0.8,-0.21 -0.28,0.16 -0.37,0.52 -0.21,0.8l1.23,2.13C4.83,12.59 3.03,15.52 2.68,19h18.64C20.97,15.52 19.17,12.59 16.53,11.16zM7.5,16c-0.55,0 -1,-0.45 -1,-1s0.45,-1 1,-1 1,0.45 1,1 -0.45,1 -1,1zm9,0c-0.55,0 -1,-0.45 -1,-1s0.45,-1 1,-1 1,0.45 1,1 -0.45,1 -1,1z" />
</vector>`,
  },
  {
    name: 'Lock Security',
    xml: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF1E88E5"
        android:pathData="M18,8h-1V6c0,-2.76 -2.24,-5 -5,-5S7,3.24 7,6v2H6c-1.1,0 -2,0.9 -2,2v10c0,1.1 0.9,2 2,2h12c1.1,0 2,-0.9 2,-2V10c0,-1.1 -0.9,-2 -2,-2zm-6,9c-1.1,0 -2,-0.9 -2,-2s0.9,-2 2,-2 2,0.9 2,2 -0.9,2 -2,2zm3.1,-9H8.9V6c0,-1.71 1.39,-3.1 3.1,-3.1 1.71,0 3.1,1.39 3.1,3.1v2z" />
</vector>`,
  },
];

export const DevToolsModal: React.FC<DevToolsModalProps> = ({
  initialTab = 'svg-to-xml',
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'svg-to-xml' | 'xml-inspector'>(initialTab);

  // Background mode for previews
  const [bgMode, setBgMode] = useState<'checker' | 'light' | 'dark'>('checker');

  // Syntax highlighting mode
  const [codeTheme, setCodeTheme] = useState<'dark' | 'light'>('dark');
  const isDarkCode = codeTheme === 'dark';

  // Mobile Tab for small screens (< lg)
  const [mobileSubTab, setMobileSubTab] = useState<'editor' | 'output'>('editor');

  // -------------------------------------------------------------
  // TAB 1: SVG to Vector XML State
  // -------------------------------------------------------------
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_SVGS[0].svg);
  const [drawableName, setDrawableName] = useState<string>('ic_custom_vector');
  const [sizeDp, setSizeDp] = useState<number>(24);
  const [fillColor, setFillColor] = useState<string>('#FF000000');
  const [preserveSvgColors, setPreserveSvgColors] = useState<boolean>(true);
  const [copiedXml, setCopiedXml] = useState<boolean>(false);
  const svgFileInputRef = useRef<HTMLInputElement | null>(null);

  // Generated Vector XML
  const conversionResult = useMemo(() => {
    return convertSvgToVectorXml(svgInput, {
      drawableName,
      widthDp: sizeDp,
      heightDp: sizeDp,
      fillColor,
      preserveColors: preserveSvgColors,
    });
  }, [svgInput, drawableName, sizeDp, fillColor, preserveSvgColors]);

  // -------------------------------------------------------------
  // TAB 2: Reverse Vector XML Inspector State
  // -------------------------------------------------------------
  const [xmlInput, setXmlInput] = useState<string>(SAMPLE_VECTOR_XMLS[0].xml);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);
  const [copiedCleanXml, setCopiedCleanXml] = useState<boolean>(false);
  const xmlFileInputRef = useRef<HTMLInputElement | null>(null);

  // Parsed SVG from Vector XML
  const parsedXmlResult = useMemo(() => {
    return parseVectorXmlToSvg(xmlInput);
  }, [xmlInput]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handlers for Tab 1
  const handleSvgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameNoExt = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    setDrawableName(fileNameNoExt.startsWith('ic_') ? fileNameNoExt : `ic_${fileNameNoExt}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSvgInput(content);
        setMobileSubTab('output');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadVectorXml = () => {
    triggerFileDownload(conversionResult.vectorXml, `${drawableName}.xml`);
  };

  const handleCopyVectorXml = async () => {
    await navigator.clipboard.writeText(conversionResult.vectorXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  // Handlers for Tab 2
  const handleXmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setXmlInput(content);
        setMobileSubTab('output');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadParsedSvg = () => {
    triggerFileDownload(parsedXmlResult.svgMarkup, `vector_exported.svg`, 'image/svg+xml');
  };

  const handleCopySvgMarkup = async () => {
    await navigator.clipboard.writeText(parsedXmlResult.svgMarkup);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleCopyCleanXml = async () => {
    await navigator.clipboard.writeText(xmlInput);
    setCopiedCleanXml(true);
    setTimeout(() => setCopiedCleanXml(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-200 bg-neutral-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2">
                <span>{lang === 'bn' ? 'অ্যান্ড্রয়েড ভেক্টর টুলবক্স' : 'Android Vector Toolbox'}</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                  {activeTab === 'svg-to-xml' ? 'SVG → Vector XML' : 'Vector XML → Visual'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500 hidden sm:block">
                {activeTab === 'svg-to-xml'
                  ? (lang === 'bn' ? 'যেকোনো কাস্টম SVG ফাইল থেকে অ্যান্ড্রয়েড Vector XML তৈরি করুন' : 'Convert any custom SVG into a production-ready Android VectorDrawable')
                  : (lang === 'bn' ? 'বিদ্যমান অ্যান্ড্রয়েড Vector XML পেস্ট করে সরাসরি লাইভ প্রিভিউ দেখুন' : 'Reverse inspect and render any Android VectorDrawable XML')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Background switcher */}
            <div className="hidden sm:flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-neutral-600">
              <button
                onClick={() => setBgMode('checker')}
                className={`p-1 rounded ${bgMode === 'checker' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:bg-neutral-200'}`}
                title="Checkerboard"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBgMode('light')}
                className={`p-1 rounded ${bgMode === 'light' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:bg-neutral-200'}`}
                title="Light"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBgMode('dark')}
                className={`p-1 rounded ${bgMode === 'dark' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:bg-neutral-200'}`}
                title="Dark"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/70 transition-colors"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Feature Tabs */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 border-b border-neutral-200 bg-white shrink-0 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setActiveTab('svg-to-xml');
                setMobileSubTab('editor');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === 'svg-to-xml'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{lang === 'bn' ? '১. কাস্টম SVG থেকে XML' : '1. Custom SVG to XML'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('xml-inspector');
                setMobileSubTab('editor');
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === 'xml-inspector'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>{lang === 'bn' ? '৫. রিভার্স XML প্রিভিউ ইন্সপেক্টর' : '5. Reverse XML Inspector'}</span>
            </button>
          </div>

          {/* Code Light/Dark mode toggle */}
          <button
            onClick={() => setCodeTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
              isDarkCode
                ? 'bg-neutral-800 text-amber-300 border-neutral-700'
                : 'bg-white text-neutral-700 border-neutral-200 shadow-2xs'
            }`}
            title="Toggle Code Syntax Theme"
          >
            {isDarkCode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
            <span className="hidden sm:inline font-mono text-[11px]">{isDarkCode ? 'Light Code' : 'Dark Code'}</span>
          </button>
        </div>

        {/* Mobile View Switcher (Only on screens < lg) */}
        <div className="flex lg:hidden items-center border-b border-neutral-200 bg-neutral-100/90 p-1.5 shrink-0 gap-1 text-xs">
          <button
            onClick={() => setMobileSubTab('editor')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              mobileSubTab === 'editor'
                ? 'bg-white text-blue-700 font-semibold shadow-xs'
                : 'text-neutral-600'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ইনপুট ও কনফিগ' : 'Input & Settings'}</span>
          </button>
          <button
            onClick={() => setMobileSubTab('output')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              mobileSubTab === 'output'
                ? 'bg-white text-blue-700 font-semibold shadow-xs'
                : 'text-neutral-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'প্রিভিউ ও কোড' : 'Preview & Code'}</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* ========================================================= */}
          {/* TAB 1: SVG TO VECTOR XML */}
          {/* ========================================================= */}
          {activeTab === 'svg-to-xml' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
              {/* Left Column: SVG Upload, Input & Config (5 cols) */}
              <div
                className={`lg:col-span-5 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-neutral-200 flex-col gap-4 overflow-y-auto bg-neutral-50/40 ${
                  mobileSubTab === 'editor' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Upload or Dropzone Box */}
                <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    ref={svgFileInputRef}
                    accept=".svg,image/svg+xml"
                    onChange={handleSvgFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => svgFileInputRef.current?.click()}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-800">
                      {lang === 'bn' ? 'কাস্টম SVG ফাইল আপলোড করুন' : 'Upload custom SVG file'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {lang === 'bn' ? 'ক্লিক করুন অথবা ড্র্যাগ অ্যান্ড ড্রপ করুন (.svg)' : 'Click to browse or drag and drop (.svg)'}
                    </p>
                  </div>
                </div>

                {/* Sample SVGs Quick Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-700">
                    {lang === 'bn' ? 'অথবা ডেমো SVG দিয়ে পরীক্ষা করুন:' : 'Or test with a sample SVG:'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SAMPLE_SVGS.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => {
                          setSvgInput(sample.svg);
                          setDrawableName(`ic_${sample.name.toLowerCase().replace(/\s+/g, '_')}`);
                        }}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors shadow-2xs"
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Raw SVG Text Area */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-700">
                      {lang === 'bn' ? 'সরাসরি SVG কোড পেস্ট করুন:' : 'Paste SVG Markup directly:'}
                    </label>
                    <button
                      onClick={() => setSvgInput('')}
                      className="text-[11px] text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      {lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
                    </button>
                  </div>
                  <textarea
                    value={svgInput}
                    onChange={(e) => setSvgInput(e.target.value)}
                    placeholder="<svg ...>...</svg>"
                    rows={6}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 font-mono text-xs text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-2xs"
                  />
                </div>

                {/* Conversion Settings */}
                <div className="p-3.5 bg-white rounded-xl border border-neutral-200 space-y-3 shadow-2xs">
                  <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'bn' ? 'অ্যান্ড্রয়েড ভেক্টর কনফিগারেশন' : 'Android Vector Configuration'}</span>
                  </h4>

                  {/* Resource Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-600">
                      {lang === 'bn' ? 'রিসোর্স ফাইল নেম (Resource Name)' : 'Drawable Resource Name'}
                    </label>
                    <input
                      type="text"
                      value={drawableName}
                      onChange={(e) => {
                        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                        setDrawableName(clean);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="ic_my_icon"
                    />
                  </div>

                  {/* DP Dimensions */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-600">
                      {lang === 'bn' ? 'সাইজ (Size in dp)' : 'Dimensions (dp)'}
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[18, 24, 36, 48].map((dp) => (
                        <button
                          key={dp}
                          onClick={() => setSizeDp(dp)}
                          className={`py-1 rounded-lg text-xs font-medium border text-center transition-all ${
                            sizeDp === dp
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                          }`}
                        >
                          {dp}dp
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preserve SVG colors toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-xs font-medium text-neutral-800">
                        {lang === 'bn' ? 'SVG এর আসল রঙ রাখুন' : 'Preserve original SVG colors'}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {lang === 'bn' ? 'বহুরঙা আইকনের রঙ অবিকল রাখবে' : 'Keep multicolor path fills & strokes'}
                      </p>
                    </div>
                    <button
                      onClick={() => setPreserveSvgColors(!preserveSvgColors)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        preserveSvgColors ? 'bg-blue-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          preserveSvgColors ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Mobile Button to jump to output */}
                <button
                  onClick={() => setMobileSubTab('output')}
                  className="lg:hidden w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{lang === 'bn' ? 'প্রিভিউ ও কোড দেখুন' : 'View Preview & Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: Live Visual Preview & Generated Vector XML (7 cols) */}
              <div
                className={`lg:col-span-7 flex-col min-h-0 bg-neutral-900 text-neutral-100 ${
                  mobileSubTab === 'output' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Header with quick download */}
                <div
                  className={`flex items-center justify-between px-4 py-2.5 border-b text-xs shrink-0 transition-colors ${
                    isDarkCode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 text-neutral-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>{drawableName}.xml</span>
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      ({conversionResult.pathsCount} paths | {sizeDp}×{sizeDp}dp)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyVectorXml}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isDarkCode
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedXml ? 'Copied!' : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                    </button>

                    <button
                      onClick={handleDownloadVectorXml}
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download XML'}</span>
                    </button>
                  </div>
                </div>

                {/* Visual Preview Box */}
                <div
                  className={`p-4 border-b flex flex-col items-center justify-center shrink-0 transition-colors ${
                    isDarkCode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div
                    className={`w-32 h-32 rounded-xl flex items-center justify-center p-3 transition-all ${
                      bgMode === 'dark'
                        ? 'bg-neutral-950 border border-neutral-800'
                        : bgMode === 'light'
                        ? 'bg-white border border-neutral-200 shadow-xs'
                        : 'checkerboard-bg border border-neutral-200 shadow-xs'
                    }`}
                  >
                    {conversionResult.cleanedSvg ? (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: conversionResult.cleanedSvg }}
                      />
                    ) : (
                      <div className="text-center text-xs text-neutral-400">
                        <AlertCircle className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <span>No valid SVG preview</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] font-mono mt-1.5 ${isDarkCode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Rendered at {sizeDp}dp viewport ({conversionResult.viewportWidth} × {conversionResult.viewportHeight})
                  </span>
                </div>

                {/* Generated Vector XML Code Viewer */}
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs leading-relaxed select-text">
                  <SyntaxHighlighter
                    code={conversionResult.vectorXml}
                    language="xml"
                    isDark={isDarkCode}
                    showLineNumbers={true}
                  />
                </div>

                {/* Bottom status line */}
                <div
                  className={`px-4 py-2 border-t text-[11px] flex items-center justify-between shrink-0 transition-colors ${
                    isDarkCode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-500'
                      : 'bg-white border-neutral-200 text-neutral-500'
                  }`}
                >
                  <span>Valid Android VectorDrawable XML</span>
                  <span>API 21+ Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: REVERSE VECTOR XML INSPECTOR */}
          {/* ========================================================= */}
          {activeTab === 'xml-inspector' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
              {/* Left Column: Paste Vector XML & Controls (5 cols) */}
              <div
                className={`lg:col-span-5 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-neutral-200 flex-col gap-4 overflow-y-auto bg-neutral-50/40 ${
                  mobileSubTab === 'editor' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Upload existing .xml */}
                <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    ref={xmlFileInputRef}
                    accept=".xml,text/xml"
                    onChange={handleXmlFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => xmlFileInputRef.current?.click()}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-800">
                      {lang === 'bn' ? 'অ্যান্ড্রয়েড Vector XML (.xml) ফাইল আপলোড করুন' : 'Upload Android Vector XML (.xml)'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {lang === 'bn' ? 'অ্যান্ড্রয়েড স্টুডিও প্রোজেক্টের drawable ফাইল বাছাই করুন' : 'From your Android Studio res/drawable folder'}
                    </p>
                  </div>
                </div>

                {/* Sample XMLs Quick Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-700">
                    {lang === 'bn' ? 'অথবা ডেমো ভেক্টর এক্সএমএল পেস্ট করুন:' : 'Or test with a sample Vector XML:'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SAMPLE_VECTOR_XMLS.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => setXmlInput(sample.xml)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors shadow-2xs"
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* XML Input Textarea */}
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-700">
                      {lang === 'bn' ? 'Vector XML কোড পেস্ট করুন:' : 'Paste Android Vector XML:'}
                    </label>
                    <button
                      onClick={() => setXmlInput('')}
                      className="text-[11px] text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      {lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
                    </button>
                  </div>
                  <textarea
                    value={xmlInput}
                    onChange={(e) => setXmlInput(e.target.value)}
                    placeholder="<vector xmlns:android=...> ... </vector>"
                    rows={8}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 font-mono text-xs text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-2xs"
                  />
                </div>

                {/* Extracted Metadata Card */}
                <div className="p-3.5 bg-white rounded-xl border border-neutral-200 space-y-2 shadow-2xs">
                  <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'bn' ? 'সনাক্তকৃত ভেক্টর মেটাডেটা' : 'Detected Vector Metadata'}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <span className="text-[10px] text-neutral-500 block">Viewport:</span>
                      <span className="font-mono font-semibold text-neutral-800">
                        {parsedXmlResult.viewportWidth} × {parsedXmlResult.viewportHeight}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <span className="text-[10px] text-neutral-500 block">Density Size:</span>
                      <span className="font-mono font-semibold text-neutral-800">
                        {parsedXmlResult.widthDp}dp × {parsedXmlResult.heightDp}dp
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <span className="text-[10px] text-neutral-500 block">Path Count:</span>
                      <span className="font-mono font-semibold text-neutral-800">
                        {parsedXmlResult.paths.length} {parsedXmlResult.paths.length === 1 ? 'path' : 'paths'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/80">
                      <span className="text-[10px] text-neutral-500 block">Compatibility:</span>
                      <span className="font-mono font-semibold text-emerald-600">Android API 21+</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Button to jump to output */}
                <button
                  onClick={() => setMobileSubTab('output')}
                  className="lg:hidden w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{lang === 'bn' ? 'লাইভ ভিজ্যুয়াল প্রিভিউ দেখুন' : 'View Visual Rendering'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: Reverse Visual Rendering & Export Options (7 cols) */}
              <div
                className={`lg:col-span-7 flex-col min-h-0 bg-neutral-900 text-neutral-100 ${
                  mobileSubTab === 'output' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Header with Export SVG button */}
                <div
                  className={`flex items-center justify-between px-4 py-2.5 border-b text-xs shrink-0 transition-colors ${
                    isDarkCode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 text-neutral-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'bn' ? 'লাইভ ভেক্টর রেন্ডার' : 'Live Vector Rendering'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySvgMarkup}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isDarkCode
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
                      }`}
                      title="Copy standard SVG markup"
                    >
                      {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSvg ? 'SVG Copied!' : (lang === 'bn' ? 'SVG কপি' : 'Copy SVG')}</span>
                    </button>

                    <button
                      onClick={handleDownloadParsedSvg}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      title="Download as standard web SVG (.svg)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'SVG ডাউনলোড' : 'Download SVG'}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Large Canvas Visual Rendering Area */}
                <div
                  className={`p-6 border-b flex flex-col items-center justify-center shrink-0 transition-colors ${
                    isDarkCode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div
                    className={`w-48 h-48 sm:w-56 sm:h-56 rounded-2xl flex items-center justify-center p-6 transition-all ${
                      bgMode === 'dark'
                        ? 'bg-neutral-950 border border-neutral-800 shadow-lg'
                        : bgMode === 'light'
                        ? 'bg-white border border-neutral-200 shadow-md'
                        : 'checkerboard-bg border border-neutral-200 shadow-md'
                    }`}
                  >
                    {parsedXmlResult.svgMarkup && parsedXmlResult.paths.length > 0 ? (
                      <div
                        className="w-full h-full flex items-center justify-center transition-transform hover:scale-105 duration-150"
                        dangerouslySetInnerHTML={{ __html: parsedXmlResult.svgMarkup }}
                      />
                    ) : (
                      <div className="text-center text-xs text-neutral-400 px-4">
                        <AlertCircle className="w-6 h-6 mx-auto mb-1.5 text-amber-400" />
                        <span>{lang === 'bn' ? 'ভ্যালিড Vector XML কোড পেস্ট করুন' : 'Paste valid Vector XML to inspect'}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <span className={`text-xs font-mono ${isDarkCode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Viewport: {parsedXmlResult.viewportWidth} × {parsedXmlResult.viewportHeight} | {parsedXmlResult.widthDp}dp
                    </span>
                  </div>
                </div>

                {/* Display Clean Parsed Vector XML Code with Highlighter */}
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs leading-relaxed select-text">
                  <SyntaxHighlighter
                    code={xmlInput}
                    language="xml"
                    isDark={isDarkCode}
                    showLineNumbers={true}
                  />
                </div>

                {/* Bottom status line */}
                <div
                  className={`px-4 py-2 border-t text-[11px] flex items-center justify-between shrink-0 transition-colors ${
                    isDarkCode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-500'
                      : 'bg-white border-neutral-200 text-neutral-500'
                  }`}
                >
                  <span>VectorDrawable to Vector Graphics Engine</span>
                  <span>Fully Bidirectional</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
