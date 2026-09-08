import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Sliders,
  Eye,
  Search,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Shield,
  Layers,
} from 'lucide-react';
import { EntityTypeSummary, EntityCategory } from '../types';
import { CATEGORY_LABELS, getEntityMetadata } from '../utils/minecraftEntities';

interface EntityListProps {
  summaries: EntityTypeSummary[];
  totalEntitiesCount: number;
  selectedIds: string[];
  onToggleSelectId: (cleanId: string) => void;
  onDeleteType: (cleanId: string) => void;
  onOpenDetailModal: (summary: EntityTypeSummary) => void;
  onPromptDeleteCount: (summary: EntityTypeSummary) => void;
  selectedChunkIndex: number | null;
  onClearChunkFilter: () => void;
}

export const EntityList: React.FC<EntityListProps> = ({
  summaries,
  totalEntitiesCount,
  selectedIds,
  onToggleSelectId,
  onDeleteType,
  onOpenDetailModal,
  onPromptDeleteCount,
  selectedChunkIndex,
  onClearChunkFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EntityCategory | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter and sort
  const filteredSummaries = useMemo(() => {
    let result = [...summaries];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        item =>
          item.cleanId.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.nameZh.toLowerCase().includes(q)
      );
    }

    // Sort order: default is count descending (as requested: zombie:1000, witch:500, chicken:1)
    if (sortOrder === 'asc') {
      result.sort((a, b) => a.count - b.count);
    } else {
      result.sort((a, b) => b.count - a.count);
    }

    return result;
  }, [summaries, selectedCategory, searchTerm, sortOrder]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: summaries.length };
    for (const s of summaries) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [summaries]);

  return (
    <div id="mca-entity-list-section" className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="search-entities-input"
              type="text"
              placeholder="搜尋實體 ID 或名稱 (例如: zombie, 女巫)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Sort & Chunk filter indicator */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {selectedChunkIndex !== null && (
              <button
                onClick={onClearChunkFilter}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl hover:bg-emerald-900/60 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>已套用區塊篩選 (點擊清除)</span>
              </button>
            )}

            <button
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl border border-zinc-700 transition-colors cursor-pointer"
              title="切換排序方式"
            >
              {sortOrder === 'desc' ? (
                <>
                  <ArrowDownNarrowWide className="w-4 h-4 text-emerald-400" />
                  <span>數量：多到少 (預設)</span>
                </>
              ) : (
                <>
                  <ArrowUpNarrowWide className="w-4 h-4 text-emerald-400" />
                  <span>數量：少到多</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/60 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            全部種類 ({categoryCounts['all'] || 0})
          </button>
          {(Object.keys(CATEGORY_LABELS) as EntityCategory[]).map(cat => {
            const count = categoryCounts[cat] || 0;
            if (count === 0 && selectedCategory !== cat) return null;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-900 font-semibold'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {CATEGORY_LABELS[cat].name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Entity Ranking Table / Cards */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-950/60 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <div className="col-span-1 flex items-center">排行 / 勾選</div>
          <div className="col-span-4">實體種類名稱 & 識別碼</div>
          <div className="col-span-4">數量統計 (zombie:1000 格式)</div>
          <div className="col-span-3 text-right">指定與刪除操作</div>
        </div>

        {filteredSummaries.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <p className="text-base font-semibold text-zinc-400">找不到符合條件的實體種類</p>
            <p className="text-xs">請嘗試清除搜尋關鍵字或切換生物分類標籤</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {filteredSummaries.map((summary, idx) => {
              const isSelected = selectedIds.includes(summary.cleanId);
              const meta = getEntityMetadata(summary.cleanId);
              const percentage = totalEntitiesCount > 0 ? (summary.count / totalEntitiesCount) * 100 : 0;
              const rank = sortOrder === 'desc' ? idx + 1 : filteredSummaries.length - idx;

              return (
                <div
                  key={summary.cleanId}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-4 md:px-6 py-3.5 transition-colors ${
                    isSelected ? 'bg-emerald-950/20' : 'hover:bg-zinc-800/30'
                  }`}
                >
                  {/* Checkbox & Rank */}
                  <div className="md:col-span-1 flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id={`checkbox-${summary.cleanId}`}
                      checked={isSelected}
                      onChange={() => onToggleSelectId(summary.cleanId)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span
                      className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                        rank === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : rank === 2
                          ? 'bg-zinc-400/20 text-zinc-300 border border-zinc-400/40'
                          : rank === 3
                          ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                          : 'text-zinc-500'
                      }`}
                    >
                      #{rank}
                    </span>
                  </div>

                  {/* Name & ID */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${meta.badgeBg} ${meta.badgeText}`}
                    >
                      {summary.cleanId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-100 truncate">
                          {summary.nameZh}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                            CATEGORY_LABELS[summary.category]?.color || 'text-zinc-400 bg-zinc-800 border-zinc-700'
                          }`}
                        >
                          {CATEGORY_LABELS[summary.category]?.name || '其他'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-zinc-400 truncate">
                          {summary.cleanId}
                        </span>
                        {summary.namedCount > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-300 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 font-medium">
                            <Shield className="w-2.5 h-2.5" />
                            {summary.namedCount} 隻名牌
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Bar (Exactly matching user prompt display format) */}
                  <div className="md:col-span-4 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-zinc-300 font-medium text-xs">
                          {summary.cleanId}:
                        </span>
                        <span className="text-emerald-400 font-bold text-base">
                          {summary.count.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        佔比 {percentage.toFixed(1)}%
                      </span>
                    </div>

                    {/* Proportional Bar */}
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(1, percentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions for this specific entity */}
                  <div className="md:col-span-3 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onPromptDeleteCount(summary)}
                      title="指定刪除此種類的特定數量"
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3 h-3 text-zinc-400" />
                      <span>指定數量</span>
                    </button>

                    <button
                      onClick={() => onOpenDetailModal(summary)}
                      title="檢視所有個別實體座標與詳情"
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteType(summary.cleanId)}
                      title={`刪除全部 ${summary.count} 隻 ${summary.nameZh}`}
                      className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-800/60 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
