import React, { useRef, useState } from 'react';
import { UploadCloud, FileCode2, Sparkles, FolderArchive, AlertCircle } from 'lucide-react';
import { createSampleMCA } from '../utils/sampleMca';

interface FileUploadProps {
  onFileLoaded: (buffer: Uint8Array, fileName: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.name.toLowerCase().endsWith('.mca')) {
      setErrorMessage('請上傳副檔名為 .mca 的 Minecraft 區域檔案 (例如 r.0.0.mca)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          throw new Error('讀取檔案失敗');
        }
        const uint8 = new Uint8Array(arrayBuffer);
        onFileLoaded(uint8, file.name);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '解析 MCA 失敗';
        setErrorMessage(`處理檔案時發生錯誤：${msg}`);
      }
    };
    reader.onerror = () => {
      setErrorMessage('無法讀取檔案，請確認檔案未被其他程式鎖定');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    setErrorMessage(null);
    try {
      const sampleBuffer = createSampleMCA();
      onFileLoaded(sampleBuffer, 'entities_r.0.0.mca');
    } catch (err) {
      console.error(err);
      setErrorMessage('生成測試樣本時發生錯誤');
    }
  };

  return (
    <div id="mca-file-upload-container" className="max-w-3xl mx-auto space-y-6">
      <div
        id="mca-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer select-none ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-900/20 scale-[1.01]'
            : 'border-zinc-700/80 bg-zinc-900/60 hover:border-zinc-500 hover:bg-zinc-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mca"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-emerald-400 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-1">
              點擊或拖曳上傳 Minecraft .mca 檔案
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              支援 Minecraft 1.17+ 專屬實體檔案 (<code className="text-emerald-300 font-mono">entities/r.X.Z.mca</code>) 及舊版與標準區塊檔案 (<code className="text-emerald-300 font-mono">region/r.X.Z.mca</code>)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950/60 border border-zinc-800 px-3 py-1.5 rounded-full">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span>純瀏覽器本地解析，無需上傳伺服器，檔案安全且高速</span>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-zinc-950/80 rounded-3xl flex items-center justify-center backdrop-blur-xs">
            <div className="flex items-center gap-3 text-emerald-400 text-sm font-medium">
              <span className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              正在解壓並解析 MCA 實體與 NBT 資料...
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Instant Demo Generator Button */}
      <div className="p-5 bg-zinc-900 border border-zinc-800/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 font-semibold text-zinc-200 text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>沒有現成的 .mca 檔案？立即試用</span>
          </div>
          <p className="text-xs text-zinc-400">
            載入包含 <strong className="text-zinc-200">Zombie: 1000</strong>、<strong className="text-zinc-200">Witch: 500</strong>、<strong className="text-zinc-200">Chicken: 1</strong> 等完整測試 MCA 樣本
          </p>
        </div>
        <button
          id="load-sample-mca-button"
          type="button"
          onClick={handleLoadSample}
          disabled={isLoading}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          載入示範測試資料
        </button>
      </div>

      {/* Guide to finding MCA files */}
      <div className="p-5 bg-zinc-950/60 border border-zinc-800/60 rounded-2xl text-xs space-y-3">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
          <FolderArchive className="w-4 h-4 text-zinc-400" />
          <span>如何在 Minecraft 存檔中找到 MCA 實體檔案？</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-400">
          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/50">
            <p className="font-medium text-zinc-200 mb-1">Minecraft 1.17 及以上版本 (推薦)</p>
            <p className="text-zinc-400 leading-relaxed">
              實體獨立存放在存檔的 <code className="text-emerald-300 font-mono">entities/</code> 資料夾中，檔名格式為 <code className="text-emerald-300 font-mono">r.X.Z.mca</code>。
            </p>
          </div>
          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/50">
            <p className="font-medium text-zinc-200 mb-1">Minecraft 1.16 及舊版本</p>
            <p className="text-zinc-400 leading-relaxed">
              實體存放在標準的 <code className="text-emerald-300 font-mono">region/</code> 資料夾中，本程式亦能自動深入各區塊讀取實體標籤。
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-400">
          <span>💡 提示：若將此專案下載至本機電腦，可直接滑鼠雙擊點擊根目錄的 <code className="text-emerald-400 font-mono">啟動.bat</code> 即可一鍵自動安裝並啟動！</span>
        </div>
      </div>
    </div>
  );
};
