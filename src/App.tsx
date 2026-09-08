import React, { useState, useMemo, useCallback } from 'react';
import { MCARegionData, EntityTypeSummary, EntityCategory } from './types';
import { parseMCA, deleteEntitiesFromMCA, rebuildMCA } from './utils/mca';
import { Navbar } from './components/Navbar';
import { FileUpload } from './components/FileUpload';
import { EntityList } from './components/EntityList';
import { BatchActionsBar } from './components/BatchActionsBar';
import { RegionMap } from './components/RegionMap';
import { EntityDetailModal } from './components/EntityDetailModal';
import { SpecifyCountModal } from './components/SpecifyCountModal';
import { HelpModal } from './components/HelpModal';
import { CheckCircle2, AlertCircle, Info, Sparkles, Box } from 'lucide-react';

export default function App() {
  const [mca, setMca] = useState<MCARegionData | null>(null);
  const [initialBuffer, setInitialBuffer] = useState<{ buffer: Uint8Array; fileName: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [keepNamed, setKeepNamed] = useState<boolean>(true);
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null);
  const [detailModalSummary, setDetailModalSummary] = useState<EntityTypeSummary | null>(null);
  const [countModalSummary, setCountModalSummary] = useState<EntityTypeSummary | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // Load and parse file
  const handleFileLoaded = useCallback((buffer: Uint8Array, fileName: string) => {
    setIsLoading(true);
    // Timeout to allow spinner render
    setTimeout(() => {
      try {
        const parsed = parseMCA(buffer, fileName);
        setMca(parsed);
        setInitialBuffer({ buffer, fileName });
        setSelectedIds([]);
        setSelectedChunkIndex(null);
        showNotification(
          `成功載入 ${fileName}！共解析到 ${parsed.allEntities.length.toLocaleString()} 隻實體，分佈於 ${parsed.totalChunks} 個區塊中。`,
          'success'
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '解析 MCA 失敗';
        showNotification(`解析失敗：${msg}`, 'error');
      } finally {
        setIsLoading(false);
      }
    }, 50);
  }, [showNotification]);

  // Reset to initial file
  const handleReset = useCallback(() => {
    if (!initialBuffer) return;
    try {
      const parsed = parseMCA(initialBuffer.buffer, initialBuffer.fileName);
      setMca(parsed);
      setSelectedIds([]);
      setSelectedChunkIndex(null);
      showNotification('已還原為最初載入的檔案狀態！', 'info');
    } catch {
      showNotification('還原失敗', 'error');
    }
  }, [initialBuffer, showNotification]);

  // Close file
  const handleCloseFile = useCallback(() => {
    setMca(null);
    setInitialBuffer(null);
    setSelectedIds([]);
    setSelectedChunkIndex(null);
    setDetailModalSummary(null);
    setCountModalSummary(null);
  }, []);

  // Filter entities if a chunk is selected
  const activeSummaries = useMemo(() => {
    if (!mca) return [];
    if (selectedChunkIndex === null) {
      return mca.typeSummaries;
    }
    const chunk = mca.chunks[selectedChunkIndex];
    if (!chunk) return [];
    // Compute summaries for this chunk only
    const map = new Map<string, EntityTypeSummary>();
    for (const ent of chunk.entities) {
      let entry = map.get(ent.cleanId);
      if (!entry) {
        const globalMeta = mca.typeSummaries.find(t => t.cleanId === ent.cleanId);
        entry = {
          id: ent.id,
          cleanId: ent.cleanId,
          nameZh: globalMeta?.nameZh || ent.cleanId,
          category: globalMeta?.category || 'other',
          count: 0,
          entities: [],
          namedCount: 0,
        };
        map.set(ent.cleanId, entry);
      }
      entry.count++;
      entry.entities.push(ent);
      if (ent.hasCustomName) entry.namedCount++;
    }
    const list = Array.from(map.values());
    list.sort((a, b) => b.count - a.count);
    return list;
  }, [mca, selectedChunkIndex]);

  // Total entities currently in display
  const currentTotalEntities = useMemo(() => {
    return activeSummaries.reduce((sum, s) => sum + s.count, 0);
  }, [activeSummaries]);

  // Total count of selected entities for batch deletion
  const totalSelectedEntitiesCount = useMemo(() => {
    return activeSummaries
      .filter(s => selectedIds.includes(s.cleanId))
      .reduce((sum, s) => sum + s.count, 0);
  }, [activeSummaries, selectedIds]);

  // Selection handlers
  const handleToggleSelectId = useCallback((cleanId: string) => {
    setSelectedIds(prev =>
      prev.includes(cleanId) ? prev.filter(id => id !== cleanId) : [...prev, cleanId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(activeSummaries.map(s => s.cleanId));
  }, [activeSummaries]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleSelectCategory = useCallback((cat: EntityCategory) => {
    const ids = activeSummaries.filter(s => s.category === cat).map(s => s.cleanId);
    setSelectedIds(prev => Array.from(new Set([...prev, ...ids])));
  }, [activeSummaries]);

  // Delete handlers
  const handleBatchDelete = useCallback(() => {
    if (!mca || selectedIds.length === 0) return;
    const { mca: updatedMca, deletedCount } = deleteEntitiesFromMCA(mca, {
      cleanIds: selectedIds,
      keepNamed,
    });
    setMca(updatedMca);
    setSelectedIds([]);
    showNotification(
      `批量刪除完成！共清除了 ${deletedCount.toLocaleString()} 隻實體。`,
      'success'
    );
  }, [mca, selectedIds, keepNamed, showNotification]);

  const handleDeleteType = useCallback((cleanId: string) => {
    if (!mca) return;
    const { mca: updatedMca, deletedCount } = deleteEntitiesFromMCA(mca, {
      cleanIds: [cleanId],
      keepNamed,
    });
    setMca(updatedMca);
    setSelectedIds(prev => prev.filter(id => id !== cleanId));
    showNotification(
      `已清除 ${deletedCount.toLocaleString()} 隻 ${cleanId}！`,
      'success'
    );
  }, [mca, keepNamed, showNotification]);

  const handleDeleteSingle = useCallback((uniqueKey: string) => {
    if (!mca) return;
    const { mca: updatedMca } = deleteEntitiesFromMCA(mca, {
      uniqueKeys: new Set([uniqueKey]),
    });
    setMca(updatedMca);
    if (detailModalSummary) {
      const updatedSummary = updatedMca.typeSummaries.find(
        s => s.cleanId === detailModalSummary.cleanId
      );
      setDetailModalSummary(updatedSummary || null);
    }
    showNotification('已刪除指定實體！', 'success');
  }, [mca, detailModalSummary, showNotification]);

  const handleDeleteSpecificCount = useCallback((cleanId: string, count: number, protectNamed = true) => {
    if (!mca) return;
    const { mca: updatedMca, deletedCount } = deleteEntitiesFromMCA(mca, {
      cleanIds: [cleanId],
      maxCountPerType: { [cleanId]: count },
      keepNamed: protectNamed,
    });
    setMca(updatedMca);
    setCountModalSummary(null);
    if (detailModalSummary) {
      const updatedSummary = updatedMca.typeSummaries.find(
        s => s.cleanId === detailModalSummary.cleanId
      );
      setDetailModalSummary(updatedSummary || null);
    }
    showNotification(
      `已成功指定刪除 ${deletedCount.toLocaleString()} 隻 ${cleanId}！`,
      'success'
    );
  }, [mca, detailModalSummary, showNotification]);

  // Export modified MCA
  const handleExport = useCallback(() => {
    if (!mca) return;
    setIsLoading(true);
    setTimeout(() => {
      try {
        const bytes = rebuildMCA(mca);
        const blob = new Blob([bytes], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = mca.fileName.startsWith('cleaned_')
          ? mca.fileName
          : `cleaned_${mca.fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(
          `新 MCA 檔案 (${(bytes.byteLength / 1024).toFixed(1)} KB) 已產生並開始下載！`,
          'success'
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '匯出失敗';
        showNotification(`匯出錯誤：${msg}`, 'error');
      } finally {
        setIsLoading(false);
      }
    }, 50);
  }, [mca, showNotification]);

  const hasModifications = useMemo(() => {
    if (!mca) return false;
    return mca.chunks.some(c => c?.isModified);
  }, [mca]);

  return (
    <div id="mca-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Bar */}
      <Navbar
        mca={mca}
        onExport={handleExport}
        onCloseFile={handleCloseFile}
        onReset={handleReset}
        hasModifications={hasModifications}
        onShowHelp={() => setShowHelpModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Floating Notification Toast */}
        {notification && (
          <div
            id="toast-notification"
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-medium transition-all transform translate-y-0 ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-red-950/90 border-red-700/80 text-red-200'
                : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        )}

        {!mca ? (
          /* File Upload State */
          <div className="py-8 sm:py-14">
            <FileUpload onFileLoaded={handleFileLoaded} isLoading={isLoading} />
          </div>
        ) : (
          /* Editor Dashboard State */
          <div className="space-y-6">
            {/* Top Quick Overview Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400">目前實體總數</span>
                <p className="text-2xl font-bold font-mono text-emerald-400">
                  {mca.allEntities.length.toLocaleString()}
                </p>
                <span className="text-[11px] text-zinc-500">分佈於整個區域檔案</span>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400">實體種類數</span>
                <p className="text-2xl font-bold font-mono text-zinc-100">
                  {mca.typeSummaries.length}
                </p>
                <span className="text-[11px] text-zinc-500">已自動按數量排序</span>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400">最高數量實體</span>
                <p className="text-xl font-bold font-mono text-amber-400 truncate">
                  {mca.typeSummaries[0]?.cleanId || '無'}
                </p>
                <span className="text-[11px] text-zinc-500">
                  {mca.typeSummaries[0]
                    ? `${mca.typeSummaries[0].count.toLocaleString()} 隻 (${mca.typeSummaries[0].nameZh})`
                    : '檔案內無實體'}
                </span>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400">已生成區塊數</span>
                <p className="text-2xl font-bold font-mono text-sky-400">
                  {mca.totalChunks} <span className="text-xs text-zinc-500">/ 1024</span>
                </p>
                <span className="text-[11px] text-zinc-500">包含有效 NBT 數據</span>
              </div>
            </div>

            {/* Batch Actions & Preset Toolbar */}
            <BatchActionsBar
              selectedIds={selectedIds}
              totalSelectedEntitiesCount={totalSelectedEntitiesCount}
              totalEntitiesCount={currentTotalEntities}
              keepNamed={keepNamed}
              onToggleKeepNamed={setKeepNamed}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onSelectCategory={handleSelectCategory}
              onBatchDelete={handleBatchDelete}
              onExport={handleExport}
              onReset={handleReset}
              hasModifications={hasModifications}
            />

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Entity Ranking & Actions List (User's primary requirement) */}
              <div className="lg:col-span-8 space-y-4">
                <EntityList
                  summaries={activeSummaries}
                  totalEntitiesCount={currentTotalEntities}
                  selectedIds={selectedIds}
                  onToggleSelectId={handleToggleSelectId}
                  onDeleteType={handleDeleteType}
                  onOpenDetailModal={setDetailModalSummary}
                  onPromptDeleteCount={setCountModalSummary}
                  selectedChunkIndex={selectedChunkIndex}
                  onClearChunkFilter={() => setSelectedChunkIndex(null)}
                />
              </div>

              {/* Right Column: 32x32 Region Chunk Heatmap & File Info */}
              <div className="lg:col-span-4 space-y-5">
                <RegionMap
                  mca={mca}
                  selectedChunkIndex={selectedChunkIndex}
                  onSelectChunk={setSelectedChunkIndex}
                />

                {/* File Details Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-zinc-200">
                    <Box className="w-4 h-4 text-emerald-400" />
                    <span>區域檔案詳情</span>
                  </div>
                  <div className="space-y-2 divide-y divide-zinc-800/60 text-zinc-400">
                    <div className="flex justify-between pt-1">
                      <span>檔案名稱</span>
                      <span className="font-mono text-zinc-200">{mca.fileName}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span>原始檔案大小</span>
                      <span className="font-mono text-zinc-200">
                        {(mca.fileSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span>區域座標</span>
                      <span className="font-mono text-zinc-200">
                        r.{mca.regionX}.{mca.regionZ}.mca
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span>檔案類型</span>
                      <span className="font-mono text-emerald-300">
                        {mca.isEntityRegion ? '實體專用 (entities/)' : '常規區域 (region/)'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span>編輯狀態</span>
                      <span className={`font-semibold ${hasModifications ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {hasModifications ? '已變更 (尚未匯出)' : '未修改'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {detailModalSummary && (
        <EntityDetailModal
          summary={detailModalSummary}
          onClose={() => setDetailModalSummary(null)}
          onDeleteSingle={handleDeleteSingle}
          onDeleteSpecificCount={handleDeleteSpecificCount}
        />
      )}

      {countModalSummary && (
        <SpecifyCountModal
          summary={countModalSummary}
          onClose={() => setCountModalSummary(null)}
          onConfirm={handleDeleteSpecificCount}
        />
      )}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}
