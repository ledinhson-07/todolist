import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  Terminal, 
  Sparkles, 
  Code, 
  ChevronRight, 
  ChevronDown, 
  Lightbulb,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface GuideSection {
  id: string;
  stepNumber: string;
  title: string;
  summary: string;
  details: React.ReactNode;
}

export const StepByStepGuide: React.FC = () => {
  const [openSectionId, setOpenSectionId] = useState<string>('step-1');

  const toggleSection = (id: string) => {
    setOpenSectionId(openSectionId === id ? '' : id);
  };

  const sections: GuideSection[] = [
    {
      id: 'step-1',
      stepNumber: 'BƯỚC 1',
      title: 'Chuẩn Bị Cấu Trúc Thư Mục & Tệp Dự Án',
      summary: 'Cách tạo dự án cực kỳ đơn giản mà không cần cài đặt NodeJS hay môi trường phức tạp.',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            Đối với người mới bắt đầu, bạn không cần phải cài đặt Webpack, Vite hay NodeJS. Chỉ cần tạo một thư mục trên máy tính với 1 hoặc 3 tệp sau:
          </p>
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-1">
            <p className="text-emerald-400 font-bold">📂 thu-muc-todolist/</p>
            <p className="pl-4">├── 📄 index.html  <span className="text-slate-400 font-sans">(Chứa cấu trúc HTML5 và nhúng Tailwind CSS CDN)</span></p>
            <p className="pl-4">├── 🎨 style.css   <span className="text-slate-400 font-sans">(Tùy chọn: Chứa CSS định kiểu gạch ngang & thanh cuộn)</span></p>
            <p className="pl-4">└── ⚡ app.js      <span className="text-slate-400 font-sans">(Chứa toàn bộ logic xử lý JavaScript ES6+)</span></p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Mẹo hay:</strong> Bạn có thể dùng <strong>Visual Studio Code</strong> và cài tiện ích mở rộng <strong>Live Server</strong> để khi bấm Lưu (Ctrl + S), trang web sẽ tự động làm mới ngay lập tức!
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'step-2',
      stepNumber: 'BƯỚC 2',
      title: 'Dựng Cấu Trúc Giao Diện HTML5 & Tích Hợp Tailwind CSS',
      summary: 'Sử dụng các thẻ Semantic (<header>, <main>, <ul>) và CDN Tailwind để có ngay giao diện đẹp mắt.',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <p>Thay vì viết hàng trăm dòng CSS từ đầu, ta sử dụng CDN của <strong>Tailwind CSS</strong> bằng cách đặt thẻ script sau vào phần <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">&lt;head&gt;</code>:</p>
          <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg text-xs font-mono">
            {'<script src="https://cdn.tailwindcss.com"></script>'}
          </pre>
          <p className="font-semibold text-slate-800">Cấu trúc các khối giao diện chính gồm 4 phần:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
            <li><strong>Header:</strong> Tiêu đề ứng dụng với dải màu gradient <code className="font-mono text-indigo-600">bg-gradient-to-r from-indigo-600 to-violet-600</code>.</li>
            <li><strong>Form Input:</strong> Thẻ <code className="font-mono text-indigo-600">&lt;form id="todo-form"&gt;</code> chứa ô nhập văn bản và nút bấm "Thêm".</li>
            <li><strong>Filter Tabs:</strong> Các nút bấm "Tất cả", "Đang làm", "Đã xong" cùng nút "Xóa đã xong".</li>
            <li><strong>Danh sách Todo:</strong> Thẻ <code className="font-mono text-indigo-600">&lt;ul id="todo-list"&gt;</code> rỗng sẵn sàng để JavaScript đổ dữ liệu vào.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'step-3',
      stepNumber: 'BƯỚC 3',
      title: 'Thiết Kế Cấu Trúc Dữ Liệu (Data Model) & State',
      summary: 'Cách tổ chức một đối tượng công việc trong mảng JavaScript.',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            Một sai lầm của người mới học là thao tác trực tiếp trên DOM (ví dụ: gán màu trực tiếp lên thẻ HTML). Cách làm chuyên nghiệp là <strong>quản lý bằng một mảng dữ liệu (State Array)</strong>.
          </p>
          <p>Mỗi công việc trong danh sách là một Object có dạng:</p>
          <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg text-xs font-mono">
{`const todo = {
  id: 1713180000000,      // Dùng Date.now() để làm ID duy nhất (không trùng lặp)
  text: "Học JavaScript", // Nội dung công việc
  completed: false        // Trạng thái: false (chưa xong), true (đã xong)
};

// Toàn bộ danh sách công việc:
let todos = [];`}
          </pre>
          <p className="text-xs">
            Khi thay đổi trạng thái hoặc xóa việc, ta chỉ cần thay đổi mảng <code className="font-mono text-indigo-600">todos</code>, sau đó gọi một hàm duy nhất để vẽ lại toàn bộ danh sách ra màn hình.
          </p>
        </div>
      )
    },
    {
      id: 'step-4',
      stepNumber: 'BƯỚC 4',
      title: 'Lưu Trữ Dữ Liệu Tự Động Với LocalStorage',
      summary: 'Hiểu cặn kẽ localStorage.getItem, localStorage.setItem, JSON.stringify và JSON.parse.',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            <strong>LocalStorage</strong> là kho lưu trữ của trình duyệt, cho phép giữ lại dữ liệu ngay cả khi người dùng tắt trình duyệt hoặc nhấn F5. Tuy nhiên, LocalStorage <em>chỉ chấp nhận chuỗi ký tự (String)</em>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
              <span className="font-bold text-indigo-900 block">1. Lưu dữ liệu (Ghi vào storage):</span>
              <p className="text-slate-600">Dùng <code className="bg-indigo-100 text-indigo-800 font-mono">JSON.stringify(todos)</code> để biến mảng Object thành chuỗi JSON.</p>
              <pre className="bg-slate-900 text-amber-300 p-2 rounded font-mono text-[11px]">
                {"localStorage.setItem('KEY', JSON.stringify(todos));"}
              </pre>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block">2. Đọc dữ liệu (Lấy ra dùng):</span>
              <p className="text-slate-600">Dùng <code className="bg-emerald-100 text-emerald-800 font-mono">JSON.parse(data)</code> để biến chuỗi JSON ngược lại thành mảng JS.</p>
              <pre className="bg-slate-900 text-emerald-300 p-2 rounded font-mono text-[11px]">
                {"todos = JSON.parse(localStorage.getItem('KEY'));"}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'step-5',
      stepNumber: 'BƯỚC 5',
      title: 'Viết Logic CRUD Đầy Đủ Bằng JavaScript ES6+',
      summary: 'Thêm mới (push/unshift), Đánh dấu hoàn thành (.map), Chỉnh sửa (.find) và Xóa (.filter).',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <p>Tận dụng các phương thức mảng hiện đại của ES6 để code ngắn gọn, rõ ràng:</p>
          <div className="space-y-2 text-xs">
            <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
              <span className="font-bold text-slate-800">[CREATE] Thêm mới:</span>
              <p className="text-slate-600">Dùng <code className="font-mono text-indigo-600">todos.unshift(newTodo)</code> để đưa công việc mới vào đầu danh sách.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
              <span className="font-bold text-slate-800">[READ / FILTER] Hiển thị & Lọc:</span>
              <p className="text-slate-600">Dùng <code className="font-mono text-indigo-600">todos.filter(t =&gt; !t.completed)</code> khi người dùng chọn tab "Đang làm".</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
              <span className="font-bold text-slate-800">[UPDATE] Hoàn thành & Chỉnh sửa:</span>
              <p className="text-slate-600">Dùng <code className="font-mono text-indigo-600">todos.map()</code> để tạo mảng mới với thuộc tính <code className="font-mono text-indigo-600">completed: !todo.completed</code>.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
              <span className="font-bold text-slate-800">[DELETE] Xóa việc:</span>
              <p className="text-slate-600">Dùng <code className="font-mono text-indigo-600">todos.filter(t =&gt; t.id !== id)</code> để loại bỏ công việc có ID tương ứng.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'step-6',
      stepNumber: 'BƯỚC 6',
      title: 'Phòng Ngừa Lỗ Hổng XSS & Mẹo UX Tinh Tế',
      summary: 'Bảo vệ ứng dụng khỏi mã độc và tối ưu trải nghiệm người dùng.',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-rose-950">Lưu ý bảo mật XSS (Cross-Site Scripting):</strong>
              <p className="mt-0.5">
                Nếu người dùng nhập vào ô text: <code className="bg-rose-100 text-rose-800 font-mono">{'<img src=x onerror=alert(1)>'}</code> và bạn dùng <code className="font-mono">innerHTML</code> trực tiếp, trình duyệt sẽ bị chạy mã script nguy hiểm! Luôn chạy hàm <code className="font-mono font-bold">escapeHTML()</code> để biến đổi các ký tự <code className="font-mono">&lt; &gt; " ' &</code> thành thực thể an toàn.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-emerald-950">Các mẹo UX chuyên nghiệp:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                <li>Sử dụng <code className="font-mono">event.preventDefault()</code> khi submit form để tránh trang web bị giật/tải lại.</li>
                <li>Tự động <code className="font-mono">todoInput.focus()</code> sau khi thêm để người dùng gõ việc tiếp theo mà không cần click chuột.</li>
                <li>Hiển thị thông báo thân thiện (Empty State) khi danh sách chưa có công việc nào.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'step-7',
      stepNumber: 'BƯỚC 7',
      title: 'Xuất Dữ Liệu Ra File JSON & CSV Không Cần Server',
      summary: 'Sử dụng Web API Blob, URL.createObjectURL và xử lý UTF-8 BOM cho Excel.',
      details: (
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            Trình duyệt hiện đại cho phép bạn tạo và tải file trực tiếp trên Client mà không cần Backend hay Database trung gian:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1.5">
              <span className="font-bold text-indigo-900 block">1. Xuất file JSON:</span>
              <p className="text-slate-600">Dùng <code className="bg-indigo-100 font-mono text-indigo-800">new Blob([JSON.stringify(todos, null, 2)], {'{'}type: 'application/json'{'}'})</code>. Trình duyệt lưu giữ nguyên cấu trúc object để có thể import lại bất kỳ lúc nào.</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <span className="font-bold text-emerald-900 block">2. Xuất CSV cho Excel:</span>
              <p className="text-slate-600">Nối các trường bằng dấu phẩy. <strong>Bí quyết sống còn:</strong> thêm ký tự BOM <code className="bg-emerald-100 font-mono text-emerald-800">'\uFEFF'</code> ở đầu file để Microsoft Excel hiển thị đúng tiếng Việt có dấu 100%.</p>
            </div>
          </div>
          <div className="p-2.5 bg-slate-900 text-slate-300 rounded-xl text-xs font-mono">
            <span className="text-emerald-400 font-bold block">// Cơ chế tải tự động bằng JS:</span>
            const a = document.createElement('a');<br/>
            a.href = URL.createObjectURL(blob);<br/>
            a.download = 'todolist-backup.json';<br/>
            a.click();
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Banner giới thiệu lộ trình */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-7 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
            Giáo Trình Từng Bước
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Lộ Trình Phát Triển TodoList Dành Cho Người Mới
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Từng bước nắm vững tư duy cấu trúc từ HTML5 Semantic, cách style với Tailwind CSS đến toàn bộ thuật toán JavaScript ES6+, LocalStorage và xuất sao lưu dữ liệu.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 text-center shrink-0">
          <p className="text-2xl font-black text-emerald-400">7</p>
          <p className="text-[11px] text-slate-300 uppercase font-semibold">Bước cốt lõi</p>
        </div>
      </div>

      {/* Accordion danh sách các bước */}
      <div className="space-y-3">
        {sections.map((sec) => {
          const isOpen = openSectionId === sec.id;

          return (
            <div
              key={sec.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen 
                  ? 'bg-white border-indigo-300 shadow-md ring-1 ring-indigo-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                      {sec.stepNumber}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base">
                      {sec.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 pl-0.5">
                    {sec.summary}
                  </p>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 mt-1 shrink-0">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 animate-fadeIn">
                  {sec.details}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
