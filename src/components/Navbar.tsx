import React from 'react';
import { Box, Download, XCircle, Info, RefreshCw } from 'lucide-react';
import { MCARegionData } from '../types';

interface NavbarProps {
  mca: MCARegionData | null;
  onExport: () => void;
  onCloseFile: () => void;
  onReset: () => void;
  hasModifications: boolean;
  onShowHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mca,
  onExport,
  onCloseFile,
  onReset,
  hasModifications,
  onShowHelp,
}) => {
  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-950/60 border border-emerald-500/30">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg text-zinc-100 tracking-tight">
                Minecraft MCA 實體編輯器
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/60">
                v1.20+ Compatible
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              MCA 區域實體深度分析、數量排序、指定與批量清理工具
            </p>
          </div>
        </div>

        {/* Status / Loaded File Details */}
        {mca && (
          <div className="hidden lg:flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-zinc-400">目前檔案：</span>
            <span className="font-mono font-semibold text-emerald-400">
              {mca.fileName}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">實體總數：</span>
            <span className="font-mono font-bold text-zinc-200">
              {mca.allEntities.length.toLocaleString()} 隻
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">區塊數：</span>
            <span className="font-mono text-zinc-300">
              {mca.totalChunks} / 1024
            </span>
          </div>
        )}

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShowHelp}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
            title="說明與使用指南"
          >
            <Info className="w-4 h-4" />
          </button>

          {mca && (
            <>
              {hasModifications && (
                <button
                  onClick={onReset}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
                  title="撤銷所有刪除並還原檔案"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">還原初始</span>
                </button>
              )}

              <button
                id="navbar-export-button"
                onClick={onExport}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>匯出 .mca</span>
              </button>

              <button
                onClick={onCloseFile}
                className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                title="關閉目前檔案"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
