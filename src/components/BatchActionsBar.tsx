import React from 'react';
import { Trash2, Download, Shield, CheckSquare, Square, RefreshCw, Sparkles } from 'lucide-react';
import { EntityCategory } from '../types';

interface BatchActionsBarProps {
  selectedIds: string[];
  totalSelectedEntitiesCount: number;
  totalEntitiesCount: number;
  keepNamed: boolean;
  onToggleKeepNamed: (val: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectCategory: (cat: EntityCategory) => void;
  onBatchDelete: () => void;
  onExport: () => void;
  onReset: () => void;
  hasModifications: boolean;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedIds,
  totalSelectedEntitiesCount,
  totalEntitiesCount,
  keepNamed,
  onToggleKeepNamed,
  onSelectAll,
  onDeselectAll,
  onSelectCategory,
  onBatchDelete,
  onExport,
  onReset,
  hasModifications,
}) => {
  return (
    <div
      id="batch-actions-toolbar"
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Selection presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-medium mr-1">快捷勾選：</span>
          <button
            onClick={onSelectAll}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            全選種類
          </button>
          <button
            onClick={onDeselectAll}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            取消勾選
          </button>
          <button
            onClick={() => onSelectCategory('hostile')}
            className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            全選敵對生物
          </button>
          <button
            onClick={() => onSelectCategory('item')}
            className="px-2.5 py-1 bg-yellow-950/40 hover:bg-yellow-900/60 border border-yellow-800/60 text-yellow-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            全選掉落物與經驗球 (清理卡頓)
          </button>
        </div>

        {/* Protect named toggle */}
        <label className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/30 border border-amber-800/40 px-3 py-1.5 rounded-xl cursor-pointer select-none">
          <input
            type="checkbox"
            checked={keepNamed}
            onChange={e => onToggleKeepNamed(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
          />
          <Shield className="w-3.5 h-3.5" />
          <span>保留已命名/有名牌的生物</span>
        </label>
      </div>

      {/* Main Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <span className="text-zinc-400">目前已選取：</span>
            <span className="font-bold text-zinc-100 ml-1">
              {selectedIds.length} 個種類
            </span>
            <span className="text-emerald-400 font-semibold ml-2">
              (共 {totalSelectedEntitiesCount.toLocaleString()} 隻實體)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasModifications && (
            <button
              onClick={onReset}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="還原為剛讀取時的狀態"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              復原變更
            </button>
          )}

          <button
            id="batch-delete-button"
            onClick={onBatchDelete}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            批量刪除所選種類 ({totalSelectedEntitiesCount.toLocaleString()} 隻)
          </button>

          <button
            id="export-mca-button"
            onClick={onExport}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            匯出並下載新 MCA 檔案
          </button>
        </div>
      </div>
    </div>
  );
};
