/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Layers, 
  Image as ImageIcon, 
  Copy, 
  ExternalLink, 
  Zap, 
  TrendingUp, 
  Search,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  BarChart3,
  Compass,
  LayoutDashboard,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { analyzeStockTrends, TrendAnalysis } from './services/geminiService';

type Category = 'video' | 'vector' | 'photo';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('video');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrendAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await analyzeStockTrends(activeCategory);
      setData(result);
    } catch (error) {
      console.error("Error generating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (data?.searchUrl) {
      navigator.clipboard.writeText(data.searchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categoryInfo: Record<Category, { label: string; desc: string; icon: React.ReactNode }> = {
    video: { 
      label: 'Video Content', 
      desc: 'Stock footage & motion graphics', 
      icon: <Video className="w-5 h-5" /> 
    },
    vector: { 
      label: 'Vector Graphics', 
      desc: 'Illustrations & UI elements', 
      icon: <Layers className="w-5 h-5" /> 
    },
    photo: { 
      label: 'Photography', 
      desc: 'High-res photos & textures', 
      icon: <ImageIcon className="w-5 h-5" /> 
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">StockTrend</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-200 flex flex-col shrink-0 transition-transform duration-300 ease-in-out transform
        lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
          <div className="hidden lg:flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-zinc-900">StockTrend <span className="text-emerald-600">Analyzer</span></h1>
          </div>

          <nav className="space-y-2">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-4">Categories</div>
            {(['video', 'vector', 'photo'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setData(null);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  activeCategory === cat 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent'
                }`}
              >
                <div className={`${activeCategory === cat ? 'text-emerald-500' : 'text-zinc-400 group-hover:text-zinc-600'}`}>
                  {categoryInfo[cat].icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">{categoryInfo[cat].label}</div>
                  <div className="text-[10px] opacity-60 font-medium">{categoryInfo[cat].desc}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-6">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-2">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Analyzing millions of data points to find your next bestseller.
            </p>
          </div>

          {/* Copyright Footer */}
          <div className="px-4">
            <a 
              href="https://www.tiktok.com/@walid.microstocke" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-3.5 h-3.5 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.96.41.53.98.89 1.64 1.01.64.11 1.3-.04 1.84-.39.59-.37.98-.99 1.05-1.69.07-1.43.03-2.86.03-4.29.01-4.69.01-9.37.01-14.06z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-zinc-900">Follow on TikTok</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">
                © {new Date().getFullYear()} Walid Microstock
              </div>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 w-full">
        <header className="h-20 border-b border-zinc-200 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-zinc-500 truncate">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Dashboard</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-zinc-900 font-bold truncate">{categoryInfo[activeCategory].label}</span>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/10 active:scale-95 disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
            {loading ? 'Analyzing...' : 'Analyze Market'}
          </button>
        </header>

        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {!data && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 lg:py-12 text-center space-y-8"
              >
                <div className="space-y-4 max-w-2xl px-4">
                  <h2 className="text-3xl md:text-5xl font-black text-zinc-900 leading-tight tracking-tight">
                    Stop Guessing. <span className="text-emerald-600">Start Selling.</span>
                    <br />
                    <span className="text-xl md:text-3xl font-bold text-zinc-600">Find Winning Content Ideas in Seconds.</span>
                  </h2>
                  <p className="text-zinc-500 text-sm md:text-lg leading-relaxed">
                    Gunakan sistem pintar untuk menemukan peluang konten yang belum banyak pesaing,
                    namun memiliki permintaan tinggi di Adobe Stock.
                  </p>
                </div>

                {/* Cara Menggunakan Section */}
                <div className="w-full max-w-xl bg-white border border-zinc-200 p-6 lg:p-8 rounded-3xl text-left shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    Cara Menggunakan:
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs font-bold flex items-center justify-center border border-zinc-200">1</span>
                      <p className="text-xs lg:text-sm text-zinc-600">Pilih kategori di menu sidebar (<span className="text-emerald-600 font-medium">Video, Vector, atau Photo</span>).</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs font-bold flex items-center justify-center border border-zinc-200">2</span>
                      <p className="text-xs lg:text-sm text-zinc-600">Klik tombol <span className="text-emerald-600 font-bold">"Analyze Market"</span> di pojok kanan atas.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs font-bold flex items-center justify-center border border-zinc-200">3</span>
                      <p className="text-xs lg:text-sm text-zinc-600">Tunggu beberapa detik selagi AI memindai data pasar untuk Anda.</p>
                    </li>
                  </ul>
                </div>

                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white border border-zinc-200 rounded-3xl flex items-center justify-center shadow-sm">
                  <Compass className="w-8 h-8 lg:w-10 lg:h-10 text-zinc-300" />
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 lg:py-20 space-y-6"
              >
                <div className="relative">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-base lg:text-lg font-bold text-zinc-900">Scanning Adobe Stock...</div>
                  <div className="text-xs lg:text-sm text-zinc-500">Comparing demand vs supply for {activeCategory}</div>
                </div>
              </motion.div>
            )}

            {data && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-6"
              >
                {/* Top Bar: URL & Actions */}
                <div className="col-span-12 bg-white border border-zinc-200 p-4 lg:p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-4 lg:gap-6 shadow-sm">
                  <div className="w-full sm:flex-1 space-y-1.5 overflow-hidden">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recommended Search URL</div>
                    <div className="bg-zinc-50 border border-zinc-100 px-4 py-2.5 rounded-xl text-emerald-600 font-mono text-[10px] lg:text-xs truncate">
                      {data.searchUrl}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={copyToClipboard}
                      className="flex-1 sm:flex-none p-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-600 flex justify-center"
                      title="Copy URL"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <a 
                      href={data.searchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors text-white flex justify-center"
                      title="Visit URL"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Left Column: Trends */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                  <div className="bg-white border border-zinc-200 p-6 lg:p-8 rounded-3xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-zinc-900">Market Trends</h3>
                    </div>
                    <div className="space-y-3">
                      {data.trends.map((trend, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                          <span className="text-sm text-zinc-600 font-medium">{trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-6 lg:p-8 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Search className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-zinc-900">Market Insights</h3>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed italic">
                      "{data.marketInsights}"
                    </p>
                  </div>
                </div>

                {/* Right Column: Rare Gaps */}
                <div className="col-span-12 lg:col-span-7 bg-white border border-zinc-200 p-6 lg:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-zinc-900">High Potential Gaps</h3>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Low Competition</span>
                  </div>

                  <div className="grid gap-4">
                    {data.rareGaps.map((gap, i) => (
                      <div key={i} className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl hover:border-emerald-200 transition-all group">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                          <div className="space-y-1">
                            <h4 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{gap.theme}</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                gap.demand === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {gap.demand} Demand
                              </span>
                              <span className="text-[9px] px-2 py-0.5 bg-zinc-200 text-zinc-600 rounded-full font-bold uppercase tracking-wider">
                                {gap.competition} Competition
                              </span>
                            </div>
                          </div>
                          <div className="hidden sm:block p-2 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {gap.potential}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile/Main Footer */}
          <footer className="mt-12 pt-8 border-t border-zinc-200 flex flex-col items-center gap-4 pb-8">
            <a 
              href="https://www.tiktok.com/@walid.microstocke" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-zinc-900/10"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-4 h-4 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.96.41.53.98.89 1.64 1.01.64.11 1.3-.04 1.84-.39.59-.37.98-.99 1.05-1.69.07-1.43.03-2.86.03-4.29.01-4.69.01-9.37.01-14.06z"/>
              </svg>
              <span className="text-xs font-bold">Follow @walid.microstocke</span>
            </a>
            <div className="text-[10px] text-zinc-400 font-medium">
              © {new Date().getFullYear()} Walid Microstock • AI Market Analyzer
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
