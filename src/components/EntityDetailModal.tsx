import React, { useState } from 'react';
import { X, Trash2, MapPin, Tag, ShieldCheck } from 'lucide-react';
import { EntityTypeSummary, ParsedEntity } from '../types';

interface EntityDetailModalProps {
  summary: EntityTypeSummary;
  onClose: () => void;
  onDeleteSingle: (uniqueKey: string) => void;
  onDeleteSpecificCount: (cleanId: string, count: number) => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  summary,
  onClose,
  onDeleteSingle,
  onDeleteSpecificCount,
}) => {
  const [customCount, setCustomCount] = useState<number>(Math.min(10, summary.count));
  const [filterNamedOnly, setFilterNamedOnly] = useState<boolean>(false);
  const [searchPos, setSearchPos] = useState<string>('');

  const filteredEntities = summary.entities.filter(ent => {
    if (filterNamedOnly && !ent.hasCustomName) return false;
    if (searchPos.trim()) {
      const q = searchPos.toLowerCase();
      const posStr = `${ent.pos[0].toFixed(1)}, ${ent.pos[1].toFixed(1)}, ${ent.pos[2].toFixed(1)}`;
      const name = ent.customName?.toLowerCase() || '';
      return posStr.includes(q) || name.includes(q);
    }
    return true;
  });

  return (
    <div
      id="entity-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="entity-detail-modal-content"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-200">
              {summary.cleanId.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-100">{summary.nameZh}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {summary.id}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                總計 <span className="text-emerald-400 font-semibold">{summary.count.toLocaleString()}</span> 個實體
                {summary.namedCount > 0 && ` (其中 ${summary.namedCount} 個具有命名牌)`}
              </p>
            </div>
          </div>
          <button
            id="close-detail-modal-button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick batch count delete tool */}
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-300 font-medium">指定刪除數量：</span>
            <input
              id="custom-delete-count-input"
              type="number"
              min="1"
              max={summary.count}
              value={customCount}
              onChange={e => setCustomCount(Math.max(1, Math.min(summary.count, parseInt(e.target.value) || 1)))}
              className="w-24 px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 text-center font-mono text-sm focus:outline-none focus:border-red-500"
            />
            <span className="text-xs text-zinc-500">/ 剩餘 {summary.count}</span>
            <button
              id="confirm-custom-delete-button"
              onClick={() => onDeleteSpecificCount(summary.cleanId, customCount)}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              刪除 {customCount.toLocaleString()} 隻
            </button>
          </div>

          <div className="flex items-center gap-3">
            {summary.namedCount > 0 && (
              <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterNamedOnly}
                  onChange={e => setFilterNamedOnly(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0"
                />
                <ShieldCheck className="w-3.5 h-3.5" />
                只看有名牌 ({summary.namedCount})
              </label>
            )}
            <input
              type="text"
              placeholder="搜尋座標或名稱..."
              value={searchPos}
              onChange={e => setSearchPos(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-zinc-500 w-40"
            />
          </div>
        </div>

        {/* Entity instances list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredEntities.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">沒有符合條件的實體</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredEntities.slice(0, 300).map((ent: ParsedEntity, idx: number) => (
                <div
                  key={ent.uniqueKey}
                  className="flex items-center justify-between p-3 bg-zinc-950/50 hover:bg-zinc-800/40 border border-zinc-800/80 rounded-xl text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-mono">#{idx + 1}</span>
                      {ent.hasCustomName ? (
                        <span className="flex items-center gap-1 text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/50">
                          <Tag className="w-3 h-3" />
                          {ent.customName}
                        </span>
                      ) : (
                        <span className="text-zinc-300 font-mono">{summary.cleanId}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        X: {ent.pos[0].toFixed(1)}, Y: {ent.pos[1].toFixed(1)}, Z: {ent.pos[2].toFixed(1)}
                      </span>
                      <span className="font-mono text-zinc-500">
                        Chunk [{ent.chunkX}, {ent.chunkZ}]
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteSingle(ent.uniqueKey)}
                    title="刪除此隻實體"
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {filteredEntities.length > 300 && (
            <div className="text-center py-2 text-xs text-zinc-500">
              還有 {(filteredEntities.length - 300).toLocaleString()} 筆實體未展開顯示，可使用上方指定數量進行批量刪除
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-400">
          <span>顯示 {filteredEntities.length} 個實體</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium transition-colors cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
