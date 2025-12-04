# Project Structure - Separated HTML Pages 📁

## Cấu trúc mới

Dự án đã được phân tách thành các trang HTML riêng biệt cho mỗi tab:

```
birthday-time-count/
├── index.html                  # Trang chủ với navigation
├── style.css                   # Shared CSS cho tất cả pages
├── script.js                   # Shared JavaScript (không còn dùng switchTab)
├── server.js                   # Server với routes mới
├── modules/
│   ├── daily/
│   │   ├── daily.html         # ✨ Daily Counter page
│   │   ├── daily.js           # Daily logic
│   │   └── dailyDB.js         # Daily database
│   └── birthday/
│       ├── birthday.html      # ✨ Birthday Counter page
│       └── birthday.js        # Birthday logic
└── daily.db                   # SQLite database
```

## 📄 Các trang HTML

### 1. **index.html** (Trang chủ)
- Hiển thị 2 button lớn để chọn counter type
- Navigation với description cho mỗi option
- Auto-redirect có thể bật (đang comment)

**URL**: `http://localhost:3002/`

### 2. **modules/daily/daily.html**
- Calendar với mood tracking
- Mood jar animation
- Mood selector (7 levels)
- Mood trend chart
- Full standalone page với navigation

**URL**: `http://localhost:3002/modules/daily/daily.html`

### 3. **modules/birthday/birthday.html**
- Birthday time counter
- Real-time countdown
- Years, months, days, hours, minutes, seconds
- Full standalone page với navigation

**URL**: `http://localhost:3002/modules/birthday/birthday.html`

## 🔧 Server Routes

### Static Files
- `/` → `index.html`
- `/index.html` → `index.html`
- `/modules/daily/daily.html` → `modules/daily/daily.html`
- `/modules/birthday/birthday.html` → `modules/birthday/birthday.html`
- `/style.css` → `style.css` (shared)
- `/modules/daily/daily.js` → `modules/daily/daily.js`
- `/modules/birthday/birthday.js` → `modules/birthday/birthday.js`

### API Endpoints
- `POST /api/daily/start-date` - Lưu ngày bắt đầu
- `GET /api/daily/start-date` - Lấy ngày bắt đầu
- `POST /api/daily/mood` - Lưu mood
- `GET /api/daily/moods?year=X&month=Y` - Lấy moods theo tháng
- `GET /api/daily/mood-by-date?date=YYYY-MM-DD` - Lấy mood theo ngày

## 🎨 Navigation

Mỗi trang có navigation bar với 2 buttons:
- **Daily**: Click để đến daily.html
- **Birthday**: Click để đến birthday.html

Navigation sử dụng `window.location.href` để chuyển trang.

## 💡 Lợi ích của cấu trúc mới

### ✅ Ưu điểm:
1. **Tách biệt logic**: Mỗi page tự quản lý logic riêng
2. **Dễ maintain**: Sửa một page không ảnh hưởng page khác
3. **Performance**: Chỉ load code cần thiết cho page hiện tại
4. **SEO friendly**: Mỗi page có URL riêng
5. **Scalable**: Dễ dàng thêm page mới (ví dụ: /modules/notes/notes.html)
6. **Clean code**: Không còn tab switching logic phức tạp

### ⚠️ Lưu ý:
- CSS vẫn được share qua `/style.css`
- Mỗi page tự load JavaScript riêng của mình
- Database SQLite được share giữa các pages
- Navigation bar giống nhau trên mọi page

## 🚀 Cách sử dụng

1. **Khởi động server**:
```bash
npm start
```

2. **Truy cập**:
- Trang chủ: `http://localhost:3002/`
- Daily: `http://localhost:3002/modules/daily/daily.html`
- Birthday: `http://localhost:3002/modules/birthday/birthday.html`

3. **Navigation**:
- Click vào button trên navigation bar để chuyển trang
- Hoặc bookmark trực tiếp URL của page muốn dùng

## 📦 Deploy

Khi deploy lên production:
1. Đảm bảo tất cả file HTML được serve đúng
2. Cấu hình routing cho các path `/modules/*`
3. Check MIME types cho .html, .css, .js files
4. SQLite database tự động tạo ở server

## 🔮 Mở rộng tương lai

Dễ dàng thêm pages mới:
1. Tạo folder mới: `modules/newfeature/`
2. Tạo file: `newfeature.html`, `newfeature.js`
3. Thêm route trong `server.js`
4. Thêm button trong navigation bar

---

**Cấu trúc này giúp dự án dễ maintain và mở rộng hơn! 💗**
