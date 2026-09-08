import React, { useMemo } from 'react';
import { MCARegionData } from '../types';
import { Box, Layers } from 'lucide-react';

interface RegionMapProps {
  mca: MCARegionData;
  selectedChunkIndex: number | null;
  onSelectChunk: (chunkIndex: number | null) => void;
}

export const RegionMap: React.FC<RegionMapProps> = ({
  mca,
  selectedChunkIndex,
  onSelectChunk,
}) => {
  // Find max entity count in any chunk for heatmap scaling
  const { maxEntities, chunkDensity } = useMemo(() => {
    let max = 0;
    const density = new Map<number, number>();
    for (let i = 0; i < 1024; i++) {
      const c = mca.chunks[i];
      const count = c?.entities.length || 0;
      density.set(i, count);
      if (count > max) max = count;
    }
    return { maxEntities: max || 1, chunkDensity: density };
  }, [mca]);

  const activeChunksCount = useMemo(() => {
    return mca.chunks.filter(c => c !== null).length;
  }, [mca]);

  return (
    <div id="mca-region-map-card" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-zinc-200">區域 32×32 區塊分佈圖</h3>
          <span className="text-xs text-zinc-400 font-mono">
            ({activeChunksCount}/1024 區塊已生成)
          </span>
        </div>
        {selectedChunkIndex !== null && (
          <button
            onClick={() => onSelectChunk(null)}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            清除區塊篩選 (顯示全部)
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
        方格顏色越深代表實體聚集越密集（可用於排查伺服器卡頓、怪物農場）。點選方格可單獨篩選該區塊。
      </p>

      {/* 32x32 Grid */}
      <div className="relative w-full aspect-square max-w-sm mx-auto bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 grid grid-cols-[repeat(32,minmax(0,1fr))] gap-[1px] select-none">
        {Array.from({ length: 1024 }).map((_, i) => {
          const chunk = mca.chunks[i];
          const count = chunkDensity.get(i) || 0;
          const isSelected = selectedChunkIndex === i;

          let bgClass = 'bg-zinc-900/40';
          if (chunk) {
            if (count === 0) {
              bgClass = 'bg-zinc-800/80';
            } else {
              const ratio = count / maxEntities;
              if (ratio > 0.6) {
                bgClass = 'bg-red-500 hover:bg-red-400';
              } else if (ratio > 0.25) {
                bgClass = 'bg-amber-500 hover:bg-amber-400';
              } else if (ratio > 0.05) {
                bgClass = 'bg-emerald-500 hover:bg-emerald-400';
              } else {
                bgClass = 'bg-emerald-700/60 hover:bg-emerald-600';
              }
            }
          }

          const relX = i % 32;
          const relZ = Math.floor(i / 32);

          return (
            <button
              key={i}
              onClick={() => {
                if (chunk && chunk.entities.length > 0) {
                  onSelectChunk(isSelected ? null : i);
                }
              }}
              disabled={!chunk}
              title={
                chunk
                  ? `區塊 [${relX}, ${relZ}] (全域 [${chunk.globalChunkX}, ${chunk.globalChunkZ}]) - 實體數: ${count}`
                  : `區塊 [${relX}, ${relZ}] - 未生成`
              }
              className={`w-full aspect-square rounded-[1px] transition-all cursor-pointer ${bgClass} ${
                isSelected ? 'ring-2 ring-white scale-125 z-10' : ''
              } ${!chunk ? 'cursor-not-allowed opacity-30' : ''}`}
            />
          );
        })}
      </div>

      {/* Selected Chunk Info */}
      {selectedChunkIndex !== null && mca.chunks[selectedChunkIndex] && (
        <div className="mt-3 p-2.5 bg-zinc-950/80 rounded-xl border border-emerald-800/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-200 font-medium">
              目前篩選區塊：
              <span className="font-mono text-emerald-300 ml-1">
                [{mca.chunks[selectedChunkIndex]!.relX}, {mca.chunks[selectedChunkIndex]!.relZ}]
              </span>
            </span>
          </div>
          <span className="font-semibold text-emerald-400">
            {mca.chunks[selectedChunkIndex]!.entities.length} 隻實體
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-zinc-800 border border-zinc-700" />
          <span>無實體</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          <span>微量</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          <span>中度</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
          <span>極高密度</span>
        </div>
      </div>
    </div>
  );
};
