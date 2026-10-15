import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Sparkles, 
  RotateCcw, 
  Database, 
  Check, 
  X, 
  Calendar, 
  Tag, 
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Info,
  Download,
  FileSpreadsheet,
  FileJson,
  Upload,
  Share2
} from 'lucide-react';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category?: 'study' | 'work' | 'personal';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

const STORAGE_KEY = 'MODERN_TODOLIST_REACT_APP';

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 1,
    text: "Học cấu trúc thẻ HTML5 Semantic (<header>, <main>, <article>)",
    completed: true,
    category: "study",
    priority: "medium",
    createdAt: "Hôm nay, 08:30"
  },
  {
    id: 2,
    text: "Áp dụng Tailwind CSS dàn trang danh sách và hiệu ứng hover",
    completed: true,
    category: "study",
    priority: "high",
    createdAt: "Hôm nay, 09:15"
  },
  {
    id: 3,
    text: "Viết hàm JavaScript ES6 xử lý thêm, sửa, xóa và toggle hoàn thành",
    completed: false,
    category: "work",
    priority: "high",
    createdAt: "Hôm nay, 10:00"
  },
  {
    id: 4,
    text: "Lưu mảng công việc vào LocalStorage với JSON.stringify",
    completed: false,
    category: "work",
    priority: "medium",
    createdAt: "Hôm nay, 11:20"
  },
  {
    id: 5,
    text: "Chạy thử nghiệm trên điện thoại và tối ưu responsive",
    completed: false,
    category: "personal",
    priority: "low",
    createdAt: "Hôm nay, 14:00"
  }
];

export const TodoListApp: React.FC = () => {
  // 1. Quản lý State
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi đọc LocalStorage", e);
    }
    return INITIAL_TODOS;
  });

  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'study' | 'work' | 'personal'>('study');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showStorageInspector, setShowStorageInspector] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // 2. Lưu vào LocalStorage mỗi khi todos thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Lỗi ghi LocalStorage", e);
    }
  }, [todos]);

  // Tự động focus ô sửa khi mở inline edit
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Thông báo tạm thời (Toast)
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // 3. Thao tác CRUD
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newTodo: TodoItem = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      createdAt: 'Vừa xong'
    };

    setTodos([newTodo, ...todos]);
    setInputText('');
    showToast(`Đã thêm: "${trimmed.slice(0, 24)}${trimmed.length > 24 ? '...' : ''}"`);
    inputRef.current?.focus();
  };

  const handleToggle = (id: number) => {
    const updated = todos.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          // Bắn pháo hoa nhẹ nếu hoàn thành việc
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#4f46e5', '#10b981', '#f59e0b']
          });
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTodos(updated);

    // Kiểm tra nếu tất cả đã hoàn thành thì chúc mừng lớn
    const allDone = updated.length > 0 && updated.every(t => t.completed);
    if (allDone) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      showToast('Tuyệt vời! Bạn đã hoàn thành tất cả công việc!');
    }
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: number) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos(todos.map(t => t.id === id ? { ...t, text: trimmed } : t));
      showToast('Đã lưu chỉnh sửa!');
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: number, text: string) => {
    setTodos(todos.filter(t => t.id !== id));
    showToast(`Đã xóa: "${text.slice(0, 20)}..."`);
  };

  const handleClearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) return;

    if (window.confirm(`Bạn có chắc muốn xóa tất cả ${completedCount} công việc đã hoàn thành?`)) {
      setTodos(todos.filter(t => !t.completed));
      showToast(`Đã dọn dẹp ${completedCount} việc đã xong!`);
    }
  };

  const handleResetSample = () => {
    if (window.confirm("Khôi phục danh sách công việc mẫu ban đầu?")) {
      setTodos(INITIAL_TODOS);
      showToast("Đã khôi phục dữ liệu mẫu!");
    }
  };

  // 4. Thao tác Xuất dữ liệu (JSON & CSV) & Nhập sao lưu (Import)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Xuất file JSON
  const exportToJSON = () => {
    if (todos.length === 0) {
      showToast("Danh sách đang trống, không có dữ liệu để xuất!");
      return;
    }

    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todolist-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Đã xuất ${todos.length} công việc ra file JSON!`);
    setShowExportModal(false);
  };

  // Xuất file CSV (Tương thích 100% Microsoft Excel tiếng Việt có dấu)
  const exportToCSV = () => {
    if (todos.length === 0) {
      showToast("Danh sách đang trống, không có dữ liệu để xuất!");
      return;
    }

    // Tiêu đề cột
    const headers = ["ID", "Nội Dung Công Việc", "Trạng Thái", "Thể Loại", "Mức Ưu Tiên", "Thời Gian Tạo"];
    
    // Hàm xử lý chuỗi an toàn cho CSV (bao bọc ngoặc kép và escape dấu ngoặc kép)
    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = todos.map(todo => {
      const statusText = todo.completed ? "Đã xong" : "Đang làm";
      const categoryMap = { study: "Học tập", work: "Công việc", personal: "Cá nhân" };
      const priorityMap = { high: "Cao", medium: "Trung bình", low: "Thấp" };
      
      const catText = todo.category ? (categoryMap[todo.category] || todo.category) : "Chung";
      const prioText = todo.priority ? (priorityMap[todo.priority] || todo.priority) : "Bình thường";

      return [
        escapeCSV(todo.id),
        escapeCSV(todo.text),
        escapeCSV(statusText),
        escapeCSV(catText),
        escapeCSV(prioText),
        escapeCSV(todo.createdAt)
      ].join(",");
    });

    // Thêm ký tự BOM (\uFEFF) ở đầu để Excel tự động nhận diện UTF-8 tiếng Việt không bị lỗi font chữ
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todolist-backup-${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Đã xuất ${todos.length} công việc ra file CSV (Excel)!`);
    setShowExportModal(false);
  };

  // Khôi phục dữ liệu từ file JSON sao lưu
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
          // Kiểm tra cấu trúc sơ bộ
          const validTodos: TodoItem[] = parsed.map((item: any, idx: number) => ({
            id: typeof item.id === 'number' ? item.id : Date.now() + idx,
            text: String(item.text || 'Công việc chưa đặt tên'),
            completed: Boolean(item.completed),
            category: ['study', 'work', 'personal'].includes(item.category) ? item.category : 'study',
            priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
            createdAt: item.createdAt || 'Đã nhập từ file'
          }));

          setTodos(validTodos);
          showToast(`Khôi phục thành công ${validTodos.length} công việc!`);
          setShowExportModal(false);
        } else {
          alert("Tệp JSON không hợp lệ! Vui lòng chọn tệp danh sách Todo đã xuất trước đó.");
        }
      } catch (err) {
        console.error("Lỗi đọc file JSON", err);
        alert("Không thể đọc tệp sao lưu. Vui lòng kiểm tra định dạng tệp!");
      }
    };
    reader.readAsText(file);
    // Reset file input để có thể chọn lại cùng file nếu cần
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = todos.filter(todo => {
    // Lọc theo trạng thái
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    // Lọc theo tìm kiếm
    if (searchQuery.trim()) {
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'study':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Học tập</span>;
      case 'work':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Công việc</span>;
      case 'personal':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Cá nhân</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (p?: string) => {
    switch (p) {
      case 'high':
        return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 flex items-center gap-0.5"><Flame className="w-3 h-3 text-rose-500" /> Cao</span>;
      case 'medium':
        return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">TB</span>;
      case 'low':
        return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Thấp</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Toast thông báo */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Card chính TodoList */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        {/* Banner Header phong cách hiện đại */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white relative overflow-hidden">
          {/* Họa tiết nền trang trí */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-36 h-36 bg-violet-400/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur text-xs font-semibold tracking-wide uppercase">
                  Thực hành Live
                </span>
                <span className="flex items-center gap-1 text-xs text-indigo-100">
                  <Database className="w-3.5 h-3.5 text-emerald-300" /> LocalStorage Auto-save
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
                Ứng Dụng Quản Lý Công Việc
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
                Đáp ứng đầy đủ chuẩn CRUD, Bộ lọc, LocalStorage & Trải nghiệm UX mượt mà
              </p>
            </div>

            {/* Thống kê tiến độ mini */}
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-300 transition-all duration-500 ease-out"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-bold">{progressPercent}%</span>
              </div>
              <div>
                <p className="text-[11px] text-indigo-100 uppercase tracking-wider font-semibold">Tiến độ</p>
                <p className="text-sm font-bold text-white">
                  {completedCount}/{totalCount} <span className="font-normal text-xs text-indigo-200">đã xong</span>
                </p>
              </div>
            </div>
          </div>

          {/* Thanh progress bar ngang */}
          <div className="mt-5 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Thân ứng dụng */}
        <div className="p-5 sm:p-7 space-y-5">
          
          {/* 1. Form nhập Todo mới */}
          <form onSubmit={handleAddTodo} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập nội dung công việc mới và nhấn Enter..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                />
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Thêm việc</span>
              </button>
            </div>

            {/* Các tùy chọn tag / độ ưu tiên bổ sung */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Tag className="w-3.5 h-3.5" /> Thể loại:
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('study')}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      selectedCategory === 'study' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Học tập
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('work')}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      selectedCategory === 'work' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Công việc
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('personal')}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      selectedCategory === 'personal' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Cá nhân
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  Ưu tiên:
                </span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Khẩn cấp (Cao)</option>
                </select>
              </div>
            </div>
          </form>

          {/* 2. Thanh lọc & Tìm kiếm */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Tabs bộ lọc */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  filter === 'active'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đang làm ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  filter === 'completed'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã xong ({completedCount})
              </button>
            </div>

            {/* Ô tìm kiếm nhanh */}
            <div className="relative flex-1 sm:max-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh việc..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 3. Danh sách công việc */}
          <div className="min-h-[220px]">
            {filteredTodos.length === 0 ? (
              <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-700">Chưa có công việc nào!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {searchQuery 
                    ? `Không tìm thấy công việc nào khớp với từ khóa "${searchQuery}".`
                    : filter === 'completed'
                    ? 'Bạn chưa hoàn thành công việc nào trong danh sách.'
                    : 'Hãy nhập công việc mới ở trên hoặc nhấn "Khôi phục dữ liệu mẫu" để thử nghiệm.'}
                </p>
                {todos.length === 0 && (
                  <button
                    onClick={handleResetSample}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Nạp danh sách mẫu
                  </button>
                )}
              </div>
            ) : (
              <ul className="space-y-2.5">
                {filteredTodos.map((todo) => {
                  const isEditing = editingId === todo.id;

                  return (
                    <li
                      key={todo.id}
                      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        todo.completed
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      {/* Checkbox và tiêu đề */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(todo.id)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none shrink-0"
                          title={todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                        >
                          {todo.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                          )}
                        </button>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(todo.id);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              className="flex-1 px-2.5 py-1 text-sm border border-indigo-400 rounded-lg focus:outline-none ring-2 ring-indigo-200"
                            />
                            <button
                              onClick={() => saveEdit(todo.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              title="Lưu"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                              title="Hủy"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="flex-1 min-w-0 cursor-pointer select-none"
                            onDoubleClick={() => startEdit(todo)}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-sm font-medium break-words ${
                                  todo.completed
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-800'
                                }`}
                              >
                                {todo.text}
                              </span>
                              {getCategoryBadge(todo.category)}
                              {getPriorityBadge(todo.priority)}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {todo.createdAt}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Các nút hành động: Sửa, Xóa */}
                      {!isEditing && (
                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => startEdit(todo)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Sửa công việc (hoặc bấm đúp)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(todo.id, todo.text)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa công việc này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 4. Footer tổng kết & Thao tác nhanh */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                {activeCount}
              </span>
              <span>công việc chưa hoàn thành</span>
            </div>

            <div className="flex items-center gap-3">
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearCompleted}
                  className="text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa việc đã xong ({completedCount})
                </button>
              )}

              <button
                type="button"
                onClick={handleResetSample}
                className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                title="Khôi phục dữ liệu mẫu ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Mẫu thử
              </button>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="Xuất file JSON hoặc CSV để sao lưu dữ liệu"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất / Sao lưu</span>
              </button>

              <button
                type="button"
                onClick={() => setShowStorageInspector(!showStorageInspector)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  showStorageInspector
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Xem dữ liệu LocalStorage thực tế"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Soi LocalStorage</span>
              </button>
            </div>
          </div>

        </div>

        {/* 5. Khung soi dữ liệu LocalStorage trực quan (Cực tốt để học tập) */}
        {showStorageInspector && (
          <div className="bg-slate-900 text-slate-200 p-5 border-t border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Database className="w-4 h-4" />
                <span>window.localStorage['{STORAGE_KEY}']</span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Kích thước: {(new Blob([JSON.stringify(todos)]).size)} bytes
              </span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              💡 Đây chính là chuỗi JSON đang được lưu trữ trực tiếp trong bộ nhớ trình duyệt của bạn:
            </p>
            <pre className="bg-slate-950 p-3 rounded-lg overflow-x-auto text-[11px] text-indigo-300 max-h-40 border border-slate-800">
              {JSON.stringify(todos, null, 2)}
            </pre>
          </div>
        )}

      </div>

      {/* Input ẩn để chọn file JSON khi nhập sao lưu */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportJSON} 
        accept=".json" 
        className="hidden" 
      />

      {/* MODAL XUẤT VÀ SAO LƯU DỮ LIỆU */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Xuất & Sao Lưu Dữ Liệu</h3>
                  <p className="text-xs text-indigo-100 mt-0.5">Lưu danh sách {todos.length} công việc về máy tính</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung các phương thức xuất */}
            <div className="p-6 space-y-4">
              
              {/* Lựa chọn 1: Xuất JSON */}
              <div 
                onClick={exportToJSON}
                className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/40 transition-all cursor-pointer flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileJson className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">
                      Xuất tệp JSON (.json)
                    </h4>
                    <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Giữ nguyên vẹn 100% cấu trúc dữ liệu, có thể nhập lại (Restore) vào ứng dụng bất cứ lúc nào.
                  </p>
                </div>
              </div>

              {/* Lựa chọn 2: Xuất CSV */}
              <div 
                onClick={exportToCSV}
                className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700">
                      Xuất bảng tính CSV (.csv)
                    </h4>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Excel / Sheets
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mở được trên Microsoft Excel, Google Sheets. Tự động gắn BOM UTF-8 hiển thị tiếng Việt chuẩn không lỗi font.
                  </p>
                </div>
              </div>

              {/* Phần Khôi phục / Nhập từ file JSON */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Đã có tệp sao lưu trước đó?</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nhập file sao lưu (.json)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mẹo học tập nhanh */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold text-amber-950">Mẹo lập trình cho bạn:</strong>
          <span className="ml-1">
            Mỗi khi bạn thêm, sửa hoặc xóa một công việc ở trên, hàm <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-mono">localStorage.setItem()</code> sẽ tự động ghi đè mảng dữ liệu mới. Thử nhấn <strong>F5 (Reload)</strong> để kiểm chứng: toàn bộ dữ liệu của bạn vẫn giữ nguyên 100%!
          </span>
        </div>
      </div>

    </div>
  );
};
