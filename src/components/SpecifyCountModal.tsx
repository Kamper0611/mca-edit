import React, { useState } from 'react';
import { X, Trash2, Sliders, Shield } from 'lucide-react';
import { EntityTypeSummary } from '../types';

interface SpecifyCountModalProps {
  summary: EntityTypeSummary;
  onClose: () => void;
  onConfirm: (cleanId: string, countToDelete: number, keepNamed: boolean) => void;
}

export const SpecifyCountModal: React.FC<SpecifyCountModalProps> = ({
  summary,
  onClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState<'deleteCount' | 'keepCount'>('deleteCount');
  const [deleteAmount, setDeleteAmount] = useState<number>(Math.min(100, summary.count));
  const [keepAmount, setKeepAmount] = useState<number>(Math.max(0, summary.count - 100));
  const [protectNamed, setProtectNamed] = useState<boolean>(true);

  const calculatedDeleteCount =
    mode === 'deleteCount'
      ? Math.max(1, Math.min(summary.count, deleteAmount))
      : Math.max(0, summary.count - Math.max(0, keepAmount));

  const remainingAfter = summary.count - calculatedDeleteCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-zinc-100">指定刪除數量：{summary.nameZh}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Info */}
        <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
          <span className="text-zinc-400">目前檔案內總計：</span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            {summary.count.toLocaleString()} 隻
          </span>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('deleteCount')}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              mode === 'deleteCount' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            直接指定欲刪除數量
          </button>
          <button
            type="button"
            onClick={() => setMode('keepCount')}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              mode === 'keepCount' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            指定保留數量 (其餘刪除)
          </button>
        </div>

        {/* Input & Slider */}
        <div className="space-y-3">
          {mode === 'deleteCount' ? (
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                <span>欲刪除的數量：</span>
                <span className="font-mono text-zinc-200 font-bold">{deleteAmount} 隻</span>
              </div>
              <input
                type="number"
                min="1"
                max={summary.count}
                value={deleteAmount}
                onChange={e => setDeleteAmount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="range"
                min="1"
                max={summary.count}
                value={deleteAmount}
                onChange={e => setDeleteAmount(parseInt(e.target.value) || 1)}
                className="w-full mt-3 accent-emerald-500 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                <span>欲保留的數量：</span>
                <span className="font-mono text-zinc-200 font-bold">{keepAmount} 隻</span>
              </div>
              <input
                type="number"
                min="0"
                max={summary.count}
                value={keepAmount}
                onChange={e => setKeepAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="range"
                min="0"
                max={summary.count}
                value={keepAmount}
                onChange={e => setKeepAmount(parseInt(e.target.value) || 0)}
                className="w-full mt-3 accent-emerald-500 cursor-pointer"
              />
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-500">快捷比例：</span>
            {[0.25, 0.5, 0.75, 1.0].map(ratio => {
              const count = Math.round(summary.count * ratio);
              return (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => {
                    if (mode === 'deleteCount') {
                      setDeleteAmount(count);
                    } else {
                      setKeepAmount(summary.count - count);
                    }
                  }}
                  className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] rounded font-mono transition-colors cursor-pointer"
                >
                  {ratio * 100}%
                </button>
              );
            })}
          </div>
        </div>

        {/* Named Protection Toggle */}
        {summary.namedCount > 0 && (
          <label className="flex items-center gap-2 p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={protectNamed}
              onChange={e => setProtectNamed(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0"
            />
            <Shield className="w-4 h-4 text-amber-400" />
            <span>優先保留有命名牌的名牌生物 ({summary.namedCount} 隻)</span>
          </label>
        )}

        {/* Prediction Summary */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">預計刪除：</span>
            <span className="text-red-400 font-bold font-mono">
              -{calculatedDeleteCount.toLocaleString()} 隻
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">刪除後剩餘：</span>
            <span className="text-emerald-400 font-bold font-mono">
              {remainingAfter.toLocaleString()} 隻
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onConfirm(summary.cleanId, calculatedDeleteCount, protectNamed)}
            disabled={calculatedDeleteCount <= 0}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            確認刪除 {calculatedDeleteCount.toLocaleString()} 隻
          </button>
        </div>
      </div>
    </div>
  );
};
