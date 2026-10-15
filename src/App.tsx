import React, { useState } from 'react';
import { TodoListApp } from './components/TodoListApp';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { StepByStepGuide } from './components/StepByStepGuide';
import { 
  CheckSquare, 
  GitBranch, 
  Code, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Terminal,
  ExternalLink,
  Github
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'flow' | 'code' | 'guide'>('app');

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG (NAVBAR) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Tên Dự Án */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight">
                  TodoList Masterclass
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Vanilla JS + LocalStorage
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Kế hoạch & Hướng dẫn từng bước phát triển Web TodoList
              </p>
            </div>
          </div>

          {/* Các nút chuyển Tab chính */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'app'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Ứng Dụng</span>
            </button>

            <button
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4 text-violet-600" />
              <span className="hidden md:inline">Sơ Đồ Luồng</span>
              <span className="md:hidden">Sơ Đồ</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Mã Nguồn Mẫu</span>
              <span className="md:hidden">Code</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Hướng Dẫn</span>
              <span className="md:hidden">Học</span>
            </button>
          </nav>

        </div>
      </header>

      {/* NỘI DUNG CHÍNH THEO TAB */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* TAB 1: ỨNG DỤNG TODOLIST TRỰC TIẾP */}
        {activeTab === 'app' && (
          <div className="space-y-6 animate-fadeIn">
            <TodoListApp />
          </div>
        )}

        {/* TAB 2: SƠ ĐỒ LUỒNG HOẠT ĐỘNG */}
        {activeTab === 'flow' && (
          <div className="space-y-6 animate-fadeIn">
            <WorkflowDiagram />
          </div>
        )}

        {/* TAB 3: MÃ NGUỒN HOÀN CHỈNH (1 FILE HOẶC 3 FILE) */}
        {activeTab === 'code' && (
          <div className="space-y-6 animate-fadeIn">
            <SourceCodeViewer />
          </div>
        )}

        {/* TAB 4: HƯỚNG DẪN TỪNG BƯỚC CHO NGƯỜI MỚI BẮT ĐẦU */}
        {activeTab === 'guide' && (
          <div className="space-y-6 animate-fadeIn">
            <StepByStepGuide />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1">
            <span>Dành cho người mới bắt đầu học</span>
            <span className="font-semibold text-slate-700">HTML5 • TailwindCSS • Vanilla JS • LocalStorage</span>
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-indigo-600 transition-colors"
            >
              Lấy mã nguồn index.html
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('flow')}
              className="hover:text-indigo-600 transition-colors"
            >
              Xem sơ đồ luồng
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
