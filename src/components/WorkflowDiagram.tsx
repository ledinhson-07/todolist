import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowRight, 
  Database, 
  Code2, 
  Play, 
  CheckCircle, 
  Layers, 
  RefreshCw, 
  Sliders, 
  Trash, 
  Edit, 
  PlusCircle, 
  Sparkles,
  MousePointerClick
} from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  action: string;
  stage: 'input' | 'process' | 'storage' | 'render';
  code: string;
  explanation: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'init',
    title: '1. Khởi Động & Đọc LocalStorage',
    action: 'Trang web vừa mở (DOMContentLoaded)',
    stage: 'storage',
    code: `function loadTodosFromStorage() {
  const data = localStorage.getItem('VANILLA_TODOLIST_ITEMS');
  if (data) {
    todos = JSON.parse(data); // Chuyển chuỗi JSON -> mảng JS
  } else {
    todos = defaultTodos;     // Nạp dữ liệu mẫu ban đầu
    saveTodosToStorage();
  }
}`,
    explanation: 'Khi người dùng truy cập trang hoặc nhấn F5, JavaScript sẽ kiểm tra xem trình duyệt đã từng lưu dữ liệu chưa. Nếu có, hàm JSON.parse() sẽ chuyển đổi chuỗi text đã lưu thành mảng Object JavaScript để sử dụng.'
  },
  {
    id: 'render',
    title: '2. Render Danh Sách Ra Giao Diện (DOM)',
    action: 'Gọi hàm renderTodos()',
    stage: 'render',
    code: `function renderTodos() {
  // Lọc theo tab hiện tại (all, active, completed)
  const filtered = todos.filter(/* điều kiện */);
  
  // Dùng .map() để sinh HTML từng thẻ <li>
  todoList.innerHTML = filtered.map(todo => \`
    <li class="todo-item" data-id="\${todo.id}">
      <input type="checkbox" \${todo.completed ? 'checked' : ''}>
      <span class="\${todo.completed ? 'task-completed' : ''}">
        \${escapeHTML(todo.text)}
      </span>
      <button onclick="deleteTodo(\${todo.id})">Xóa</button>
    </li>
  \`).join('');
}`,
    explanation: 'Hàm renderTodos() nhận mảng dữ liệu, dùng phương thức .map() để biến mỗi phần tử thành một thẻ <li> có chứa checkbox và các nút bấm, sau đó gán vào innerHTML của thẻ <ul>.'
  },
  {
    id: 'add',
    title: '3. Thao Tác Thêm Mới (Create)',
    action: 'Người dùng nhập text + bấm Thêm hoặc Enter',
    stage: 'input',
    code: `function addTodo(text) {
  if (!text.trim()) return; // Bỏ qua nếu nhập toàn khoảng trắng

  const newTodo = {
    id: Date.now(),       // Dùng thời gian hiện tại làm ID duy nhất
    text: text.trim(),
    completed: false
  };

  todos.unshift(newTodo); // Đưa việc mới lên đầu danh sách
  saveTodosToStorage();   // Lưu ngay vào LocalStorage
  renderTodos();          // Cập nhật lại giao diện
}`,
    explanation: 'Sự kiện "submit" trên form được kích hoạt. Trình duyệt chặn reload bằng event.preventDefault(). Một object Todo mới được tạo ra và đưa vào đầu mảng todos.'
  },
  {
    id: 'toggle',
    title: '4. Đánh Dấu Hoàn Thành (Toggle Completed)',
    action: 'Người dùng click vào ô Checkbox hoặc dòng chữ',
    stage: 'process',
    code: `function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  saveTodosToStorage(); // Ghi đè trạng thái mới vào LocalStorage
  renderTodos();        // Render lại để áp dụng CSS gạch ngang
}`,
    explanation: 'Tìm phần tử có id trùng khớp, đảo ngược giá trị thuộc tính completed (từ false thành true hoặc ngược lại). Giao diện lập tức thêm class gạch ngang text-decoration: line-through.'
  },
  {
    id: 'filter',
    title: '5. Lọc Trạng Thái (Filter Tabs)',
    action: 'Người dùng bấm tab: Tất cả / Đang làm / Đã xong',
    stage: 'process',
    code: `// Sự kiện bấm nút tab
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter; // 'all' | 'active' | 'completed'
    renderTodos(); // Chỉ lọc khi hiển thị, KHÔNG làm mất dữ liệu gốc!
  });
});`,
    explanation: 'Khi bấm tab, biến currentFilter thay đổi. Hàm renderTodos() chỉ lọc các phần tử thỏa mãn để vẽ ra màn hình. Mảng dữ liệu gốc todos và LocalStorage vẫn được giữ nguyên vẹn!'
  },
  {
    id: 'delete',
    title: '6. Xóa Công Việc (Delete / Clear Completed)',
    action: 'Người dùng bấm icon Thùng rác hoặc nút "Xóa đã xong"',
    stage: 'process',
    code: `// Xóa 1 việc
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodosToStorage();
  renderTodos();
}

// Xóa tất cả việc đã làm xong
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodosToStorage();
  renderTodos();
}`,
    explanation: 'Phương thức .filter() của JavaScript tạo ra một mảng mới chỉ giữ lại những công việc không bị xóa. Sau đó lưu vào LocalStorage và render lại.'
  }
];

export const WorkflowDiagram: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<FlowStep>(FLOW_STEPS[0]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Tiêu đề phần Sơ đồ luồng */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Kiến Trúc & Luồng Dữ Liệu
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          Sơ Đồ Luồng Hoạt Động Của Ứng Dụng TodoList
        </h2>
        <p className="text-sm text-slate-600">
          Mô hình chuẩn <strong>State-Driven UI</strong> kết hợp <strong>LocalStorage</strong>: Mọi tương tác của người dùng đều cập nhật mảng dữ liệu (State) trước, sau đó đồng bộ vào Storage và kích hoạt vẽ lại giao diện (Render).
        </p>
      </div>

      {/* Sơ Đồ Trực Quan Dạng Khối (Interactive Flowchart Canvas) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm sm:text-base">Sơ đồ tương tác (Bấm vào khối để xem code chi tiết)</span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" /> Click chọn bước
          </span>
        </div>

        {/* Khung Sơ Đồ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* CỘT 1: INPUT TỪ NGƯỜI DÙNG */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              1. Tương Tác Người Dùng (UI Events)
            </div>

            <button
              onClick={() => setSelectedStep(FLOW_STEPS[2])}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                selectedStep.id === 'add'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
                  : 'bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Nhập Form + Submit</span>
                <PlusCircle className="w-4 h-4 opacity-75" />
              </div>
              <p className={`text-[11px] mt-1 ${selectedStep.id === 'add' ? 'text-blue-100' : 'text-slate-500'}`}>
                Sự kiện: form.onsubmit
              </p>
            </button>

            <button
              onClick={() => setSelectedStep(FLOW_STEPS[3])}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                selectedStep.id === 'toggle'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
                  : 'bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Tick Checkbox / Click việc</span>
                <CheckCircle className="w-4 h-4 opacity-75" />
              </div>
              <p className={`text-[11px] mt-1 ${selectedStep.id === 'toggle' ? 'text-blue-100' : 'text-slate-500'}`}>
                Sự kiện: checkbox.onchange
              </p>
            </button>

            <button
              onClick={() => setSelectedStep(FLOW_STEPS[4])}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                selectedStep.id === 'filter'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
                  : 'bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Bấm Tabs Bộ Lọc</span>
                <Sliders className="w-4 h-4 opacity-75" />
              </div>
              <p className={`text-[11px] mt-1 ${selectedStep.id === 'filter' ? 'text-blue-100' : 'text-slate-500'}`}>
                Tất cả / Đang làm / Đã xong
              </p>
            </button>

            <button
              onClick={() => setSelectedStep(FLOW_STEPS[5])}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                selectedStep.id === 'delete'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
                  : 'bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Bấm nút Xóa / Clear</span>
                <Trash className="w-4 h-4 opacity-75" />
              </div>
              <p className={`text-[11px] mt-1 ${selectedStep.id === 'delete' ? 'text-blue-100' : 'text-slate-500'}`}>
                Sự kiện: button.onclick
              </p>
            </button>
          </div>

          {/* CỘT 2: XỬ LÝ LOGIC DỮ LIỆU & STORAGE */}
          <div className="space-y-3 p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 pb-2 border-b border-indigo-200">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              2. Logic Xử Lý & LocalStorage
            </div>

            <button
              onClick={() => setSelectedStep(FLOW_STEPS[0])}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                selectedStep.id === 'init'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                  : 'bg-white hover:bg-indigo-100/60 border-indigo-200 text-slate-700'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>Đọc từ LocalStorage</span>
                <Database className="w-4 h-4 opacity-75" />
              </div>
              <p className={`text-[11px] mt-1 ${selectedStep.id === 'init' ? 'text-indigo-100' : 'text-slate-500'}`}>
                JSON.parse(localStorage.getItem)
              </p>
            </button>

            <div className="bg-white p-3 rounded-xl border border-indigo-200 text-xs space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold">
                <Code2 className="w-3.5 h-3.5" />
                <span>Mảng Quản Lý State:</span>
              </div>
              <pre className="text-[10px] bg-slate-900 text-emerald-300 p-2 rounded font-mono overflow-x-auto">
{`let todos = [
  { id: 1, text: "...", completed: false }
];`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-indigo-600/10 border border-indigo-300 text-xs text-indigo-900">
              <span className="font-bold block">Tự động đồng bộ:</span>
              <code className="text-[11px] bg-indigo-200/80 px-1 py-0.5 rounded text-indigo-950 font-mono block mt-1">
                localStorage.setItem(KEY, JSON.stringify(todos))
              </code>
            </div>
          </div>

          {/* CỘT 3: RENDER GIAO DIỆN (DOM) */}
          <div className="space-y-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 pb-2 border-b border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              3. Vẽ Giao Diện (Render DOM)
            </div>

            <button
              onClick={() => setSelectedStep(FLOW_STEPS[1])}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                selectedStep.id === 'render'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                  : 'bg-white hover:bg-emerald-100/60 border-emerald-200 text-slate-700'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>renderTodos()</span>
                <RefreshCw className="w-4 h-4 opacity-75" />
              </div>
              <p className={`text-[11px] mt-1 ${selectedStep.id === 'render' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Tạo chuỗi HTML & gán vào todoList.innerHTML
              </p>
            </button>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1 text-slate-700 shadow-xs">
              <span className="font-bold text-emerald-800 block">Kết quả hiển thị:</span>
              <ul className="text-[11px] space-y-1 list-disc list-inside text-slate-600">
                <li>Hiển thị các thẻ <code className="text-emerald-700 font-mono">&lt;li&gt;</code></li>
                <li>Gạch ngang nếu <code className="text-emerald-700 font-mono">completed: true</code></li>
                <li>Đếm số lượng công việc còn lại</li>
                <li>Ẩn/hiện thông báo rỗng (Empty state)</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* Chi Tiết Bước Đang Chọn (Code + Giải Thích) */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500 text-white font-mono text-xs font-bold">
              BƯỚC CHI TIẾT
            </span>
            <h3 className="text-lg font-bold text-white">
              {selectedStep.title}
            </h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Kích hoạt: {selectedStep.action}
          </span>
        </div>

        {/* Giải thích dễ hiểu */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {selectedStep.explanation}
        </p>

        {/* Khối mã nguồn mẫu */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-indigo-400 font-mono font-semibold">
              <Code2 className="w-3.5 h-3.5" /> Mã JavaScript tương ứng:
            </span>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed">
            {selectedStep.code}
          </pre>
        </div>
      </div>

    </div>
  );
};
