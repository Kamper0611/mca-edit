import React from 'react';
import { X, HelpCircle, AlertTriangle, ShieldCheck, Folder, Terminal, Download } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const handleDownloadBat = () => {
    const batContent = `@echo off
setlocal
cd /d "%~dp0"

title Minecraft MCA Entity Editor

echo ========================================================
echo   Minecraft MCA Entity Editor - Launcher
echo ========================================================
echo.

:: 1. Check if extracted from ZIP
if not exist "package.json" goto ERR_NO_PACKAGE

:: 2. Check Node.js
where node >nul 2>nul
if errorlevel 1 goto ERR_NO_NODE

:: 3. Check npm
where npm >nul 2>nul
if errorlevel 1 goto ERR_NO_NPM

:: 4. Check dependencies (node_modules)
if not exist "node_modules\\" goto DO_INSTALL
if not exist "node_modules\\vite\\" goto DO_INSTALL
goto START_APP

:DO_INSTALL
echo [INFO] First-time setup: Installing dependencies (npm install)...
echo [INFO] Please wait 1-2 minutes for installation to finish...
echo.
call npm install
if errorlevel 1 goto ERR_INSTALL_FAILED
echo.
echo [SUCCESS] Dependencies installed successfully!
echo.

:START_APP
echo [INFO] Starting Vite server at http://localhost:3000...
echo [INFO] Opening default browser...
echo.
echo ========================================================
echo   Server is running! Keep this window open.
echo   To stop the server, press Ctrl+C or close this window.
echo ========================================================
echo.

start http://localhost:3000

call npm run dev
if errorlevel 1 goto ERR_DEV_FAILED

echo.
echo Server closed.
pause
exit /b 0

:ERR_NO_PACKAGE
echo.
echo ========================================================
echo [ERROR] package.json not found in current folder!
echo.
echo [HINT] Did you double-click inside a .ZIP archive?
echo Please EXTRACT the zip folder completely first!
echo (Right-click the downloaded .zip -^> Extract All...)
echo Then open the extracted folder and run start.bat / 啟動.bat.
echo ========================================================
echo.
pause
exit /b 1

:ERR_NO_NODE
echo.
echo ========================================================
echo [ERROR] Node.js was not detected on this computer!
echo.
echo Please install Node.js (LTS version recommended) from:
echo https://nodejs.org/
echo.
echo After installation finishes, run this script again.
echo ========================================================
echo.
pause
exit /b 1

:ERR_NO_NPM
echo.
echo ========================================================
echo [ERROR] npm command was not found!
echo Please reinstall Node.js from https://nodejs.org/
echo ========================================================
echo.
pause
exit /b 1

:ERR_INSTALL_FAILED
echo.
echo ========================================================
echo [ERROR] "npm install" failed!
echo Please check your internet connection or run "npm install"
echo manually in Command Prompt.
echo ========================================================
echo.
pause
exit /b 1

:ERR_DEV_FAILED
echo.
echo ========================================================
echo [ERROR] Server encountered an error while running.
echo Please review the error log above.
echo ========================================================
echo.
pause
exit /b 1
`;
    // Ensure Windows CRLF (\r\n) line endings so cmd.exe does not drop bytes
    const crlfContent = batContent.replace(/\r?\n/g, '\r\n');
    const blob = new Blob([crlfContent], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'start.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-zinc-100 text-base">Minecraft MCA 實體編輯器使用教學</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-3 p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">安全提醒：</span>
            在替換存檔中的任何 <code className="font-mono text-amber-300">.mca</code> 檔案前，請務必先對你的世界存檔進行備份，避免意外造成重要建築或生物遺失。
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs text-zinc-300">
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center justify-center text-[11px]">1</span>
              尋找存檔中的 .mca 檔案
            </h4>
            <div className="pl-7 space-y-1 text-zinc-400">
              <p>
                <strong>Windows 路徑：</strong>
                <code className="font-mono text-zinc-300 ml-1 select-all bg-zinc-900 px-1.5 py-0.5 rounded">
                  %appdata%\.minecraft\saves\&lt;世界存檔名&gt;\entities\
                </code>
              </p>
              <p>
                <strong>Mac 路徑：</strong>
                <code className="font-mono text-zinc-300 ml-1 select-all bg-zinc-900 px-1.5 py-0.5 rounded">
                  ~/Library/Application Support/minecraft/saves/&lt;世界存檔名&gt;/entities/
                </code>
              </p>
              <p className="text-[11px] text-zinc-500">
                * 若為 1.16 或更舊版本，請至 <code className="font-mono text-zinc-400">region/</code> 資料夾尋找對應座標的 <code className="font-mono text-zinc-400">r.X.Z.mca</code>。
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center justify-center text-[11px]">2</span>
              依數量高低檢視與分析
            </h4>
            <div className="pl-7 text-zinc-400 leading-relaxed">
              系統讀取後會以實體數量由大到小排序（例如 <code className="font-mono text-emerald-300">zombie:1000</code>、<code className="font-mono text-emerald-300">witch:500</code>、<code className="font-mono text-emerald-300">chicken:1</code>）。
              點選右側 32×32 區塊分佈圖可查看哪些區塊密集聚集了實體（可用於找出卡服的生怪磚或大量實體聚集區）。
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center justify-center text-[11px]">3</span>
              指定或批量刪除
            </h4>
            <div className="pl-7 text-zinc-400 space-y-1">
              <p>• <strong>批量刪除：</strong>可勾選多種實體（例如殭屍與女巫），或點擊「一鍵全選敵對生物 / 掉落物」快速批次移除。</p>
              <p>• <strong>指定數量：</strong>點擊「指定數量」可設定只刪除特定隻數（例如清除 500 隻殭屍，保留其餘 500 隻）。</p>
              <p>• <strong>保護名牌生物：</strong>預設開啟「保留有名牌的生物」，避免誤刪寵物、已命名村民或 Boss。</p>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center justify-center text-[11px]">4</span>
              匯出新 MCA 檔案並替換
            </h4>
            <div className="pl-7 text-zinc-400 leading-relaxed">
              點擊右上角「匯出並下載新 MCA 檔案」，將下載後的檔案重新命名放回原本的 <code className="font-mono text-emerald-300">entities/</code> 或 <code className="font-mono text-emerald-300">region/</code> 資料夾內即可生效！
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center justify-center text-[11px]">5</span>
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  本機 Windows 一鍵啟動腳本 (.bat)
                </span>
              </h4>
              <button
                type="button"
                onClick={handleDownloadBat}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                下載 啟動.bat
              </button>
            </div>
            <div className="pl-7 text-zinc-400 leading-relaxed text-[11px]">
              專案根目錄已新增 <code className="font-mono text-emerald-300">啟動.bat</code>（及 <code className="font-mono text-emerald-300">start.bat</code>）。將程式下載到本機電腦解壓縮後，在 Windows 系統上<strong>滑鼠雙擊點擊此 .bat 檔案</strong>，腳本會自動檢查 Node.js、自動安裝套件並為您開啟瀏覽器進入程式！
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
