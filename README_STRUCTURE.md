# Birthday Time Counter 💗

Ứng dụng đếm thời gian với giao diện kawaii đáng yêu!

## 📁 Cấu trúc thư mục

```
birthday-time-count/
├── modules/
│   ├── birthday/          # Module Birthday Counter
│   │   └── birthday.js    # Logic đếm thời gian từ ngày sinh
│   └── daily/             # Module Daily Counter
│       └── daily.js       # Logic đếm số ngày từ ngày bắt đầu
├── index.html             # Giao diện chính với tab navigation
├── style.css              # Tất cả CSS styling
├── script.js              # Logic chuyển tab
├── server.js              # Node.js server
├── package.json           # Config
└── README_STRUCTURE.md    # File này
```

## 🎯 Tính năng

### Tab Birthday 🎂
- Đếm thời gian từ ngày sinh đến hiện tại
- Hiển thị: Năm, Tháng, Ngày, Giờ, Phút, Giây
- Ngày mặc định: 4/8/2002
- Animation đẹp mắt, real-time update

### Tab Daily 📅
- Đếm số ngày từ một ngày bắt đầu bất kỳ
- Hiển thị: Tổng số ngày, tuần, tháng
- Chi tiết: Giờ, phút, giây
- Thích hợp để đếm ngày kỷ niệm, sự kiện

## 🚀 Chạy ứng dụng

```bash
# Khởi động server
node server.js

# Hoặc
npm start
```

Truy cập: `http://localhost:3002`

## 🎨 Thiết kế

- **Màu sắc**: Tone hồng pastel chủ đạo
- **Font chữ**: Nunito (Google Fonts)
- **Phong cách**: Kawaii, dễ thương, nhẹ nhàng
- **Animation**: Smooth transitions, bounce effects
- **Responsive**: Hoạt động tốt trên mobile

## 💡 Module Organization

Mỗi tab được tách thành một module riêng trong thư mục `modules/`:
- Dễ bảo trì và mở rộng
- Code sạch và có tổ chức
- Có thể thêm tab mới dễ dàng

## 🌟 Thêm tab mới

1. Tạo thư mục mới trong `modules/`
2. Tạo file JavaScript logic
3. Thêm tab button trong `index.html`
4. Thêm tab content trong `index.html`
5. Import script trong `<script>` tags
6. Cập nhật `switchTab()` function nếu cần

Enjoy! 💕✨
