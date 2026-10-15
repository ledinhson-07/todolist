import React, { useState } from 'react';
import { 
  singleFileCode, 
  splitFiles 
} from '../data/vanillaCode';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Files, 
  Play, 
  ExternalLink, 
  Sparkles,
  Info
} from 'lucide-react';

export const SourceCodeViewer: React.FC = () => {
  // Tabs lựa chọn: 'single' (1 file index.html) | 'split' (3 file riêng biệt) | 'preview' (chạy thử trong iframe)
  const [viewMode, setViewMode] = useState<'single' | 'split' | 'preview'>('single');
  const [activeSplitTab, setActiveSplitTab] = useState<'html' | 'css' | 'js'>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Tiêu đề & Chọn phương án mã nguồn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-md border border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
            Mã Nguồn Hoàn Chỉnh & Chú Thích Tiếng Việt
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            Chọn Dạng Mã Nguồn Bạn Muốn Sử Dụng
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dễ dàng sao chép chỉ với 1 click, hoặc tải trực tiếp về máy tính để học tập
          </p>
        </div>

        {/* Chuyển đổi định dạng */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Gộp 1 File (index.html)</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Files className="w-4 h-4" />
            <span>Tách 3 File (HTML, CSS, JS)</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'preview'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-600" />
            <span>Chạy Thử Sandbox</span>
          </button>
        </div>
      </div>

      {/* 1. CHẾ ĐỘ 1 FILE (index.html) */}
      {viewMode === 'single' && (
        <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
          <div className="bg-slate-950 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-300 ml-2 font-semibold">index.html</span>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Gồm đầy đủ HTML5 + Tailwind CDN + Script Vanilla JS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(singleFileCode, 'single')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
              >
                {copiedKey === 'single' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Đã chép mã!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile(singleFileCode, 'index.html', 'text/html')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700 cursor-pointer"
                title="Tải file index.html về máy"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải về .html</span>
              </button>
            </div>
          </div>

          {/* Gợi ý cách chạy */}
          <div className="bg-indigo-950/40 px-5 py-2.5 border-b border-slate-800/80 flex items-center gap-2 text-xs text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Cách dùng:</strong> Tạo file tên <code className="bg-indigo-900/60 text-indigo-200 px-1.5 py-0.5 rounded font-mono">index.html</code> trên máy tính, dán toàn bộ code dưới đây vào và nhấp đúp để mở trực tiếp trên Chrome/Edge/Firefox!
            </span>
          </div>

          <pre className="p-5 font-mono text-xs text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed select-text">
            <code>{singleFileCode}</code>
          </pre>
        </div>
      )}

      {/* 2. CHẾ ĐỘ TÁCH 3 FILE (HTML, CSS, JS) */}
      {viewMode === 'split' && (
        <div className="space-y-4">
          {/* Thanh chọn tab file */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveSplitTab('html')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeSplitTab === 'html'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>1. index.html</span>
              </button>

              <button
                onClick={() => setActiveSplitTab('css')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeSplitTab === 'css'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>2. style.css</span>
              </button>

              <button
                onClick={() => setActiveSplitTab('js')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeSplitTab === 'js'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>3. app.js</span>
              </button>
            </div>

            {/* Các nút sao chép / tải cho tab hiện tại */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const content = activeSplitTab === 'html' ? splitFiles.html : activeSplitTab === 'css' ? splitFiles.css : splitFiles.js;
                  copyToClipboard(content, activeSplitTab);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedKey === activeSplitTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép file này</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (activeSplitTab === 'html') downloadFile(splitFiles.html, 'index.html', 'text/html');
                  if (activeSplitTab === 'css') downloadFile(splitFiles.css, 'style.css', 'text/css');
                  if (activeSplitTab === 'js') downloadFile(splitFiles.js, 'app.js', 'application/javascript');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải về</span>
              </button>
            </div>
          </div>

          {/* Nội dung code của file đang chọn */}
          <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-950 px-5 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>{activeSplitTab === 'html' ? 'index.html (Khung giao diện)' : activeSplitTab === 'css' ? 'style.css (Định dạng bổ trợ)' : 'app.js (Toàn bộ logic Vanilla JS)'}</span>
              <span className="text-indigo-400 font-sans">Được chú thích tiếng Việt từng đoạn</span>
            </div>
            <pre className="p-5 font-mono text-xs text-slate-300 overflow-x-auto max-h-[550px] leading-relaxed select-text">
              <code>
                {activeSplitTab === 'html' && splitFiles.html}
                {activeSplitTab === 'css' && splitFiles.css}
                {activeSplitTab === 'js' && splitFiles.js}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* 3. CHẾ ĐỘ CHẠY THỬ LIVE SANDBOX IFRAME */}
      {viewMode === 'preview' && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-600" />
                <span>Live Sandbox Preview</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đây là chính xác file <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700">index.html</code> (Vanilla JS + Tailwind CDN) đang được chạy trong iframe độc lập.
              </p>
            </div>

            <button
              onClick={() => {
                const win = window.open('', '_blank');
                if (win) {
                  win.document.write(singleFileCode);
                  win.document.close();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Mở trong tab mới
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-100 min-h-[500px]">
            <iframe
              title="Live Vanilla TodoList Sandbox"
              srcDoc={singleFileCode}
              className="w-full h-[540px] border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      )}

    </div>
  );
};
