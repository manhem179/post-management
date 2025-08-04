# Hệ Thống Quản Lý Bài Viết (Post Management System)

## 📋 Mô tả
Hệ thống quản lý bài viết được xây dựng bằng Node.js với đầy đủ chức năng CRUD, authentication, upload ảnh và giao diện web đẹp mắt.

## 🚀 Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Multer** - Upload file
- **Redis** - Caching
- **bcrypt** - Hash password
- **json2csv** - Export CSV

### Frontend
- **HTML5** + **CSS3** + **JavaScript**
- **Bootstrap 5** - UI Framework
- **Font Awesome** - Icons

## 📁 Cấu trúc dự án

```
post-management/
├── app.js                 # Main application file
├── server.js             # Server entry point
├── package.json          # Dependencies
├── .env                  # Environment variables
├── public/               # Frontend files
│   ├── index.html       # Main HTML
│   ├── styles.css       # Custom CSS
│   └── script.js        # Frontend JavaScript
├── models/              # Database models
│   ├── User.js         # User schema
│   └── Post.js         # Post schema
├── controllers/         # Business logic
│   ├── auth.controller.js
│   └── post.controller.js
├── routes/             # API routes
│   ├── auth.routes.js
│   └── post.routes.js
├── middlewares/        # Middleware functions
│   ├── logger.js
│   ├── verifyToken.js
│   └── upload.js
├── cache/              # Redis cache
│   └── redisClient.js
├── utils/              # Utility functions
│   ├── csvExport.js
│   └── emailMock.js
├── events/             # Event handling
│   └── post.event.js
└── uploads/            # Uploaded files
    └── .gitkeep
```

## 🛠️ Cài đặt và chạy

### 1. Clone dự án
```bash
git clone <repository-url>
cd post-management
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` với nội dung:
```env
# MongoDB Atlas URI
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Redis URL
REDIS_URL=redis://localhost:6379

# Server Port
PORT=5000
```

### 4. Cài đặt Redis (tùy chọn)
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows
# Tải Redis từ https://redis.io/download
```

### 5. Chạy ứng dụng
```bash
npm start
```

Truy cập: http://localhost:5000

## 📚 API Documentation

### Authentication
- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập

### Posts
- `GET /api/posts` - Lấy danh sách bài viết (có phân trang, lọc, sắp xếp)
- `GET /api/posts/:id` - Lấy chi tiết bài viết
- `POST /api/posts` - Tạo bài viết mới (cần token)
- `PUT /api/posts/:id` - Cập nhật bài viết (cần token)
- `DELETE /api/posts/:id` - Xóa bài viết (cần token)
- `GET /api/posts/export` - Xuất CSV (cần token)

### Query Parameters
- `page` - Trang hiện tại (mặc định: 1)
- `limit` - Số bài viết mỗi trang (mặc định: 10)
- `sortBy` - Sắp xếp theo (createdAt, title)
- `category` - Lọc theo danh mục (tech, lifestyle, business, sports)

## ✨ Tính năng chính

### ✅ Đã hoàn thành
- [x] Đăng ký/Đăng nhập với JWT
- [x] CRUD bài viết đầy đủ
- [x] Upload ảnh với Multer
- [x] Phân trang, lọc, sắp xếp
- [x] Middleware logger và verifyToken
- [x] EventEmitter cho post:created
- [x] Redis cache cho GET /posts
- [x] Export CSV
- [x] Gửi email mô phỏng
- [x] Giao diện web responsive
- [x] Authentication và authorization
- [x] Upload ảnh với validation

### 🎨 Giao diện
- Responsive design với Bootstrap 5
- Dark/Light theme
- Loading states
- Toast notifications
- Modal forms
- Card layout cho bài viết

## 🔧 Cấu hình deployment

### Render.com
1. Tạo tài khoản tại https://render.com
2. Connect GitHub repository
3. Tạo Web Service
4. Cấu hình:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Thêm các biến từ file `.env`

### Railway.app
1. Tạo tài khoản tại https://railway.app
2. Deploy từ GitHub
3. Thêm MongoDB service
4. Cấu hình environment variables

## 📊 Database Schema

### User
```javascript
{
  username: String (unique, required),
  password: String (hashed, required)
}
```

### Post
```javascript
{
  title: String,
  content: String,
  author: ObjectId (ref: 'User'),
  category: String,
  thumbnail: String,
  createdAt: Date (default: now)
}
```

## 🔐 Bảo mật
- JWT authentication
- Password hashing với bcrypt
- File upload validation
- CORS enabled
- Input validation
- Authorization checks

## 🚀 Performance
- Redis caching cho GET requests
- Pagination để giảm tải
- Image optimization
- Static file serving

## 📝 Logs
- Request logging với timestamp
- Event logging cho post creation
- Error logging
- Email notification logging

## 🤝 Contributing
1. Fork dự án
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License
MIT License

## 👨‍💻 Tác giả
[Your Name]

## 📞 Liên hệ
- Email: your.email@example.com
- GitHub: https://github.com/yourusername 