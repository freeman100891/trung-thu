# 🏮 Đêm Hội Trung Thu 3D (Mid-Autumn 3D Festival)

Một trải nghiệm web 3D tương tác thuần HTML, CSS, JavaScript kết hợp **Three.js** tái hiện không gian lễ hội Trung Thu huyền ảo với đảo tiên bay, hoa anh đào phát sáng, đàn thỏ ngọc và những cánh đèn trời ước nguyện lung linh.

---

## ✨ Điểm Nổi Bật

- **Không gian 3D huyền ảo (Three.js)**:
  - Bầu trời ngàn sao lấp lánh (Starfield).
  - Đảo đá thần tiên lơ lửng bồng bềnh giữa không gian.
  - Cây Thần Thụ (Hoa anh đào phát sáng) với hơn 8.000 hạt phát sáng (particle bloom) chuyển động mềm mại theo gió cùng những cánh hoa rơi chầm chậm.
  - Đàn Thỏ Ngọc (Moon Rabbits) đáng yêu với đôi tai lắc lư và nhịp nhảy nhót tinh nghịch dưới gốc cây.
  - Hơn 20 chiếc đèn lồng trời (thiên đăng / khổng minh đăng) phát ánh sáng vàng ấm áp, đung đưa và bay dần lên bầu trời đêm.

- **Tương tác chạm / nhấp lồng đèn**:
  - Rê chuột / chạm vào lồng đèn: Lồng đèn phát sáng to hơn, con trỏ đổi thành bàn tay.
  - Nhấp vào lồng đèn: Hiệu ứng vỡ hạt ánh sao lấp lánh (sparkle burst), tiếng chuông gió trong trẻo vang lên và tấm thiệp chúc Trung Thu mở ra mượt mà.
  - Bộ sưu tập các câu chúc Trung Thu lãng mạn và ý nghĩa.

- **Tính năng Thả Đèn Ước Nguyện ("✦ Thả đèn ước nguyện")**:
  - Cho phép người dùng tự nhập tên người nhận và lời chúc riêng để thắp sáng và thả một chiếc lồng đèn mới bay lên trời.

- **Âm thanh & Điều khiển**:
  - Nhạc nền Trung Thu du dương trích xuất chất lượng cao, tích hợp nút Bật/Tắt nhạc.
  - Nút xem toàn màn hình (Fullscreen).
  - Hỗ trợ xoay 360 độ và thu phóng linh hoạt trên cả máy tính lẫn điện thoại di động.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local)

Dự án được xây dựng hoàn toàn bằng **HTML, CSS và JavaScript thuần** (đã tích hợp sẵn thư viện Three.js ngoại tuyến trong thư mục `libs/`), không cần cài đặt hay build phức tạp:

1. **Cách 1: Mở trực tiếp**
   - Nhấp đúp vào file `index.html` để mở trong trình duyệt.

2. **Cách 2: Sử dụng VS Code Live Server**
   - Chuột phải vào `index.html` -> Chọn **Open with Live Server**.

3. **Cách 3: Sử dụng Python Server**
   ```bash
   python -m http.server 5500
   ```
   Sau đó truy cập [http://127.0.0.1:5500](http://127.0.0.1:5500) trên trình duyệt.

---

## 🌐 Triển Khai Lên GitHub Pages

Để chia sẻ website cho bạn bè và người thương truy cập trực tiếp:
1. Vào repository trên GitHub -> Chọn **Settings** -> **Pages**.
2. Tại mục **Branch**, chọn nhánh `main` (hoặc `master`) và thư mục `/(root)`.
3. Nhấn **Save**. Website sẽ có địa chỉ truy cập công khai dạng:  
   `https://<username>.github.io/trung-thu/`
