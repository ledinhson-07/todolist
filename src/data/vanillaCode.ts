/**
 * Mã nguồn mẫu chuẩn HTML5 + Tailwind CSS + Vanilla JavaScript (ES6+)
 * Kèm chú thích tiếng Việt cực kỳ chi tiết cho từng dòng/khối code.
 */

export const singleFileCode = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ứng dụng TodoList Đơn Giản - Vanilla JS</title>
  
  <!-- 1. TÍCH HỢP TAILWIND CSS QUA CDN (Không cần cài đặt phức tạp) -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Font chữ Inter thanh lịch và FontAwesome icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    /* Hiệu ứng gạch ngang khi hoàn thành */
    .task-completed {
      text-decoration: line-through;
      color: #9ca3af; /* text-gray-400 */
    }
  </style>
</head>

<body class="bg-slate-100 min-h-screen py-8 px-4 sm:px-6 flex flex-col items-center">

  <!-- KHUNG CHÍNH CỦA ỨNG DỤNG -->
  <main class="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
    
    <!-- PHẦN HEADER TIÊU ĐỀ -->
    <header class="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white text-center">
      <h1 class="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
        <i class="fa-solid fa-clipboard-check"></i>
        <span>Danh Sách Công Việc</span>
      </h1>
      <p class="text-indigo-100 text-sm mt-1">Đơn giản • Hiện đại • Tự động lưu LocalStorage</p>
    </header>

    <div class="p-6">
      
      <!-- FORM NHẬP CÔNG VIỆC MỚI -->
      <form id="todo-form" class="flex gap-2 mb-6">
        <input 
          type="text" 
          id="todo-input" 
          placeholder="Bạn cần làm gì hôm nay? (Nhấn Enter để thêm)" 
          autocomplete="off"
          class="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
          required
        />
        <button 
          type="submit" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-200 flex items-center gap-2 active:scale-95"
        >
          <i class="fa-solid fa-plus"></i>
          <span class="hidden sm:inline">Thêm</span>
        </button>
      </form>

      <!-- THANH BỘ LỌC (FILTER TABS) -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
        <div class="flex gap-1" id="filter-tabs">
          <button data-filter="all" class="filter-btn active-tab px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-indigo-50 text-indigo-700">
            Tất cả
          </button>
          <button data-filter="active" class="filter-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            Đang làm
          </button>
          <button data-filter="completed" class="filter-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            Đã xong
          </button>
        </div>

        <!-- Nút xóa nhanh các việc đã tick -->
        <button 
          id="clear-completed-btn" 
          class="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1 transition-all"
          title="Xóa tất cả các công việc đã hoàn thành"
        >
          <i class="fa-regular fa-trash-can"></i>
          <span>Xóa đã xong</span>
        </button>
      </div>

      <!-- KHU VỰC HIỂN THỊ DANH SÁCH TODO -->
      <ul id="todo-list" class="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        <!-- Các thẻ công việc sẽ được render bằng JavaScript tại đây -->
      </ul>

      <!-- THÔNG BÁO KHI DANH SÁCH TRỐNG -->
      <div id="empty-state" class="hidden text-center py-10 px-4">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl mb-3">
          <i class="fa-solid fa-check-double"></i>
        </div>
        <p class="text-slate-600 font-medium">Chưa có công việc nào!</p>
        <p class="text-slate-400 text-xs mt-1">Hãy thêm một công việc mới để bắt đầu ngày làm việc hiệu quả.</p>
      </div>

    </div>

    <!-- PHẦN FOOTER: ĐẾM SỐ LƯỢNG & NÚT XUẤT DỮ LIỆU -->
    <footer class="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
      <span id="items-left">
        <strong>0</strong> công việc chưa hoàn thành
      </span>
      
      <!-- CÁC NÚT XUẤT SAO LƯU DỮ LIỆU (JSON / CSV) -->
      <div class="flex items-center gap-1.5">
        <button 
          id="export-json-btn"
          class="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          title="Xuất dữ liệu ra file JSON để sao lưu"
        >
          <i class="fa-solid fa-file-code"></i>
          <span>Xuất JSON</span>
        </button>

        <button 
          id="export-csv-btn"
          class="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          title="Xuất bảng tính CSV mở được bằng Excel"
        >
          <i class="fa-solid fa-file-csv"></i>
          <span>Xuất CSV</span>
        </button>
      </div>
    </footer>

  </main>

  <!-- ========================================== -->
  <!-- 2. PHẦN MÃ JAVASCRIPT (ES6+ VANILLA JS)    -->
  <!-- ========================================== -->
  <script>
    // ==========================================
    // BƯỚC 1: KHAI BÁO CÁC BIẾN VÀ LẤY PHẦN TỬ DOM
    // ==========================================
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const exportJsonBtn = document.getElementById('export-json-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');

    // Khóa (Key) dùng để lưu dữ liệu vào LocalStorage của trình duyệt
    const STORAGE_KEY = 'VANILLA_TODOLIST_ITEMS';

    // Biến lưu trạng thái lọc hiện tại: 'all' | 'active' | 'completed'
    let currentFilter = 'all';

    // Mảng chứa danh sách các công việc. Cấu trúc mỗi phần tử:
    // { id: 1713123456789, text: "Học JavaScript", completed: false }
    let todos = [];

    // ==========================================
    // BƯỚC 2: CÁC HÀM XỬ LÝ DỮ LIỆU LOCALSTORAGE
    // ==========================================

    // Hàm đọc dữ liệu từ LocalStorage khi trang vừa tải xong
    function loadTodosFromStorage() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          // JSON.parse chuyển chuỗi JSON thành mảng JavaScript
          todos = JSON.parse(stored);
        } catch (e) {
          console.error("Lỗi khi đọc LocalStorage:", e);
          todos = [];
        }
      } else {
        // Dữ liệu mẫu ban đầu nếu người dùng mới mở lần đầu
        todos = [
          { id: 1, text: "Tìm hiểu cấu trúc HTML5 Semantic", completed: true },
          { id: 2, text: "Thực hành dàn trang với TailwindCSS", completed: false },
          { id: 3, text: "Viết logic lưu trữ LocalStorage bằng JS", completed: false }
        ];
        saveTodosToStorage();
      }
    }

    // Hàm lưu mảng todos vào LocalStorage
    function saveTodosToStorage() {
      // JSON.stringify chuyển mảng JavaScript thành chuỗi văn bản JSON
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    // ==========================================
    // BƯỚC 3: HÀM HIỂN THỊ (RENDER) DANH SÁCH RA MÀN HÌNH
    // ==========================================
    function renderTodos() {
      // 1. Lọc danh sách theo tab đang chọn
      let filteredTodos = todos;
      if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
      } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
      }

      // 2. Xử lý hiển thị thông báo rỗng khi không có việc nào
      if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        todoList.innerHTML = '';
      } else {
        emptyState.classList.add('hidden');
        // Tạo chuỗi HTML cho danh sách công việc
        todoList.innerHTML = filteredTodos.map(todo => {
          return \`
            <li class="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group" data-id="\${todo.id}">
              <!-- Khu vực checkbox và nội dung văn bản -->
              <div class="flex items-center gap-3 flex-1 min-w-0 pr-2 cursor-pointer" onclick="toggleTodo(\${todo.id})">
                <input 
                  type="checkbox" 
                  \${todo.completed ? 'checked' : ''} 
                  class="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer pointer-events-none"
                />
                <span class="text-sm font-medium break-words select-none \${todo.completed ? 'task-completed' : 'text-slate-700'}">
                  \${escapeHTML(todo.text)}
                </span>
              </div>

              <!-- Khu vực các nút Thao tác (Sửa, Xóa) -->
              <div class="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <!-- Nút Sửa -->
                <button 
                  onclick="editTodo(\${todo.id})" 
                  class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                  title="Chỉnh sửa công việc"
                >
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <!-- Nút Xóa -->
                <button 
                  onclick="deleteTodo(\${todo.id})" 
                  class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                  title="Xóa công việc"
                >
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </li>
          \`;
        }).join('');
      }

      // 3. Cập nhật số lượng công việc chưa hoàn thành
      const activeCount = todos.filter(t => !t.completed).length;
      itemsLeft.innerHTML = \`<strong>\${activeCount}</strong> công việc chưa hoàn thành\`;
    }

    // Hàm chống lỗ hổng bảo mật XSS khi người dùng nhập thẻ HTML
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }

    // ==========================================
    // BƯỚC 4: CÁC THAO TÁC CRUD (Create, Update, Delete)
    // ==========================================

    // [CREATE] Thêm công việc mới
    function addTodo(text) {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      const newTodo = {
        id: Date.now(), // Sử dụng timestamp làm ID duy nhất
        text: trimmedText,
        completed: false
      };

      // Thêm vào đầu danh sách
      todos.unshift(newTodo);
      saveTodosToStorage();
      renderTodos();
    }

    // [UPDATE 1] Đánh dấu hoàn thành / chưa hoàn thành
    function toggleTodo(id) {
      todos = todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      saveTodosToStorage();
      renderTodos();
    }

    // [UPDATE 2] Chỉnh sửa nội dung công việc
    function editTodo(id) {
      const targetTodo = todos.find(t => t.id === id);
      if (!targetTodo) return;

      // Dùng hàm prompt đơn giản của trình duyệt (thân thiện cho người mới bắt đầu)
      const updatedText = prompt("Chỉnh sửa nội dung công việc:", targetTodo.text);
      if (updatedText !== null && updatedText.trim() !== '') {
        targetTodo.text = updatedText.trim();
        saveTodosToStorage();
        renderTodos();
      }
    }

    // [DELETE] Xóa một công việc
    function deleteTodo(id) {
      if (confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
        todos = todos.filter(t => t.id !== id);
        saveTodosToStorage();
        renderTodos();
      }
    }

    // [DELETE ALL] Xóa tất cả công việc đã hoàn thành
    function clearCompleted() {
      const completedCount = todos.filter(t => t.completed).length;
      if (completedCount === 0) {
        alert("Hiện không có công việc nào đã hoàn thành để xóa.");
        return;
      }

      if (confirm(\`Bạn có muốn xóa \${completedCount} công việc đã xong?\`)) {
        todos = todos.filter(t => !t.completed);
        saveTodosToStorage();
        renderTodos();
      }
    }

    // ==========================================
    // BƯỚC 4.1: XUẤT SAO LƯU DỮ LIỆU (JSON & CSV)
    // ==========================================

    // [EXPORT JSON] Xuất toàn bộ dữ liệu ra tệp JSON
    function exportTodosToJSON() {
      if (todos.length === 0) {
        alert("Danh sách công việc đang trống, không có dữ liệu để xuất!");
        return;
      }

      // 1. Chuyển đổi mảng todos thành chuỗi JSON có thụt dòng đẹp (indent 2 spaces)
      const jsonString = JSON.stringify(todos, null, 2);
      
      // 2. Tạo đối tượng Blob nhị phân dạng text/json
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // 3. Tạo đường dẫn tạm thời (ObjectURL) từ Blob
      const url = URL.createObjectURL(blob);
      
      // 4. Tạo thẻ <a> ảo để kích hoạt tải file xuống máy tính
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = \`todolist-\${new Date().toISOString().slice(0, 10)}.json\`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // 5. Dọn dẹp thẻ <a> và giải phóng bộ nhớ
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }

    // [EXPORT CSV] Xuất danh sách dạng bảng tính Excel
    function exportTodosToCSV() {
      if (todos.length === 0) {
        alert("Danh sách công việc đang trống, không có dữ liệu để xuất!");
        return;
      }

      // Tiêu đề các cột trong file CSV
      const headers = ['ID', 'Nội Dung Công Việc', 'Trạng Thái', 'Thời Gian'];
      
      // Hàm xử lý chuỗi: bao bọc dấu ngoặc kép và escape ký tự "
      const safeCSV = (text) => \`"\${String(text || '').replace(/"/g, '""')}"\`;

      // Tạo các dòng dữ liệu
      const rows = todos.map(todo => [
        safeCSV(todo.id),
        safeCSV(todo.text),
        safeCSV(todo.completed ? 'Đã xong' : 'Đang làm'),
        safeCSV(new Date(todo.id).toLocaleString('vi-VN'))
      ].join(','));

      // Thêm ký tự BOM (\uFEFF) ở đầu để Microsoft Excel hiển thị đúng tiếng Việt có dấu
      const csvContent = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = \`todolist-\${new Date().toISOString().slice(0, 10)}.csv\`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }

    // ==========================================
    // BƯỚC 5: GẮN SỰ KIỆN (EVENT LISTENERS)
    // ==========================================

    // 1. Lắng nghe sự kiện Submit Form (Thêm Todo)
    todoForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Ngăn trình duyệt reload lại trang
      addTodo(todoInput.value);
      todoInput.value = ''; // Xóa trắng ô input sau khi thêm
      todoInput.focus();
    });

    // 2. Lắng nghe sự kiện click nút "Clear Completed"
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // 3. Lắng nghe sự kiện click nút "Xuất JSON" và "Xuất CSV"
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportTodosToJSON);
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportTodosToCSV);

    // 4. Lắng nghe sự kiện chuyển đổi giữa các Tab Bộ Lọc
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Cập nhật giao diện nút đang active
        filterButtons.forEach(b => {
          b.classList.remove('bg-indigo-50', 'text-indigo-700');
          b.classList.add('text-slate-600');
        });
        btn.classList.add('bg-indigo-50', 'text-indigo-700');
        btn.classList.remove('text-slate-600');

        // Cập nhật bộ lọc và render lại
        currentFilter = btn.getAttribute('data-filter');
        renderTodos();
      });
    });

    // ==========================================
    // BƯỚC 6: KHỞI TẠO ỨNG DỤNG LẦN ĐẦU TIÊN
    // ==========================================
    loadTodosFromStorage();
    renderTodos();
  </script>

</body>
</html>`;

export const splitFiles = {
  html: `<!-- ============================================== -->
<!-- FILE 1: index.html - Cấu trúc giao diện HTML5 -->
<!-- ============================================== -->
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TodoList Hiện Đại - Vanilla JS</title>
  
  <!-- Nhúng TailwindCSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Nhúng FontAwesome Icon -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Nhúng file CSS tùy chỉnh riêng -->
  <link rel="stylesheet" href="style.css">
</head>

<body class="bg-slate-100 min-h-screen py-10 px-4 flex flex-col items-center">

  <main class="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
    
    <!-- Tiêu đề Header -->
    <header class="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white text-center">
      <h1 class="text-2xl font-bold flex items-center justify-center gap-2">
        <i class="fa-solid fa-list-check"></i>
        <span>Kế Hoạch Của Tôi</span>
      </h1>
      <p class="text-indigo-100 text-sm mt-1">Quản lý mục tiêu hàng ngày dễ dàng</p>
    </header>

    <div class="p-6">
      <!-- Form nhập việc -->
      <form id="todo-form" class="flex gap-2 mb-6">
        <input 
          type="text" 
          id="todo-input" 
          placeholder="Bạn muốn hoàn thành việc gì hôm nay?" 
          class="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          required
        />
        <button 
          type="submit" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1"
        >
          <i class="fa-solid fa-plus"></i>
          <span>Thêm</span>
        </button>
      </form>

      <!-- Thanh bộ lọc (Tabs) -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
        <div class="flex gap-1" id="filter-tabs">
          <button data-filter="all" class="filter-btn active-tab px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700">Tất cả</button>
          <button data-filter="active" class="filter-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100">Đang làm</button>
          <button data-filter="completed" class="filter-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100">Đã xong</button>
        </div>

        <button id="clear-completed-btn" class="text-xs text-red-600 hover:underline font-medium">
          Xóa đã xong
        </button>
      </div>

      <!-- Danh sách Todo Items -->
      <ul id="todo-list" class="space-y-2.5 max-h-[380px] overflow-y-auto"></ul>

      <!-- Trạng thái trống (Empty state) -->
      <div id="empty-state" class="hidden text-center py-10">
        <p class="text-slate-500 font-medium">Chưa có công việc nào!</p>
      </div>
    </div>

    <!-- Chân trang & Các nút xuất sao lưu -->
    <footer class="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
      <span id="items-left"><strong>0</strong> công việc chưa xong</span>
      <div class="flex items-center gap-1.5">
        <button id="export-json-btn" class="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer">
          <i class="fa-solid fa-file-code"></i> Xuất JSON
        </button>
        <button id="export-csv-btn" class="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer">
          <i class="fa-solid fa-file-csv"></i> Xuất CSV
        </button>
      </div>
    </footer>

  </main>

  <!-- Nhúng file logic JavaScript -->
  <script src="app.js"></script>
</body>
</html>`,

  css: `/* ============================================== */
/* FILE 2: style.css - Định kiểu CSS bổ trợ      */
/* ============================================== */

/* Font chữ mặc định */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Định kiểu cho việc đã hoàn thành: gạch ngang và chữ mờ đi */
.task-completed {
  text-decoration: line-through;
  color: #94a3b8 !important;
}

/* Tùy chỉnh thanh cuộn đẹp mắt cho danh sách */
#todo-list::-webkit-scrollbar {
  width: 6px;
}

#todo-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

#todo-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

#todo-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}`,

  js: `// ==============================================
// FILE 3: app.js - Toàn bộ Logic ES6+ Vanilla JS
// ==============================================

// 1. Khởi tạo truy xuất các phần tử DOM
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

// 2. Biến trạng thái toàn cục (State)
const STORAGE_KEY = 'VANILLA_TODOLIST_ITEMS';
let currentFilter = 'all';
let todos = [];

// 3. Hàm tải dữ liệu từ LocalStorage
function loadTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      todos = JSON.parse(data);
    } catch (e) {
      todos = [];
    }
  } else {
    // Dữ liệu mẫu khởi đầu
    todos = [
      { id: 1, text: "Học cú pháp JavaScript ES6+", completed: true },
      { id: 2, text: "Thao tác DOM và gán Event Listener", completed: false },
      { id: 3, text: "Lưu dữ liệu với LocalStorage", completed: false }
    ];
    saveTodos();
  }
}

// 4. Hàm lưu dữ liệu vào LocalStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 5. Hàm lọc và hiển thị danh sách (Render)
function render() {
  // Lọc theo tab hiện tại
  let filtered = todos;
  if (currentFilter === 'active') filtered = todos.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = todos.filter(t => t.completed);

  // Hiển thị trạng thái rỗng
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    todoList.innerHTML = '';
  } else {
    emptyState.classList.add('hidden');
    todoList.innerHTML = filtered.map(todo => \`
      <li class="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group" data-id="\${todo.id}">
        <div class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onclick="toggleTodo(\${todo.id})">
          <input type="checkbox" \${todo.completed ? 'checked' : ''} class="w-5 h-5 text-indigo-600 rounded pointer-events-none" />
          <span class="text-sm font-medium \${todo.completed ? 'task-completed' : 'text-slate-700'}">
            \${escapeHTML(todo.text)}
          </span>
        </div>
        <div class="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button onclick="editTodo(\${todo.id})" class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button onclick="deleteTodo(\${todo.id})" class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </li>
    \`).join('');
  }

  // Cập nhật số việc chưa xong
  const count = todos.filter(t => !t.completed).length;
  itemsLeft.innerHTML = \`<strong>\${count}</strong> công việc chưa xong\`;
}

// 6. Hàm chống XSS Injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c] || c));
}

// 7. Thao tác CRUD
function addTodo(text) {
  if (!text.trim()) return;
  todos.unshift({
    id: Date.now(),
    text: text.trim(),
    completed: false
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTodos();
  render();
}

function editTodo(id) {
  const item = todos.find(t => t.id === id);
  if (!item) return;
  const newText = prompt("Sửa nội dung việc:", item.text);
  if (newText && newText.trim()) {
    item.text = newText.trim();
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  if (confirm("Bạn có muốn xóa công việc này?")) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
  }
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
}

// 7.1 Xuất dữ liệu ra file JSON & CSV
function exportJSON() {
  if (todos.length === 0) return alert("Danh sách đang trống!");
  const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = \`todolist-\${new Date().toISOString().slice(0, 10)}.json\`;
  a.click();
}

function exportCSV() {
  if (todos.length === 0) return alert("Danh sách đang trống!");
  const headers = ['ID', 'Nội Dung', 'Trạng Thái'];
  const safe = (t) => \`"\${String(t || '').replace(/"/g, '""')}"\`;
  const rows = todos.map(t => [safe(t.id), safe(t.text), safe(t.completed ? 'Đã xong' : 'Đang làm')].join(','));
  const csv = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = \`todolist-\${new Date().toISOString().slice(0, 10)}.csv\`;
  a.click();
}

// 8. Đăng ký sự kiện
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
});

clearCompletedBtn.addEventListener('click', clearCompleted);

const exportJsonBtn = document.getElementById('export-json-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');
if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJSON);
if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportCSV);

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('bg-indigo-50', 'text-indigo-700');
      b.classList.add('text-slate-600');
    });
    btn.classList.add('bg-indigo-50', 'text-indigo-700');
    btn.classList.remove('text-slate-600');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// 9. Khởi chạy khi load trang
loadTodos();
render();`
};
