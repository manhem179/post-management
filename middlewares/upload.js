const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = './uploads/';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Upload destination:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('📄 Upload filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 File filter - Original name:', file.originalname);
  console.log('🔍 File filter - Mime type:', file.mimetype);
  
  const ext = path.extname(file.originalname).toLowerCase();
  console.log('🔍 File filter - Extension:', ext);
  
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    console.log('❌ File filter - Invalid extension:', ext);
    return cb(new Error('Chỉ chấp nhận file .png, .jpg, .jpeg'), false);
  }
  
  console.log('✅ File filter - Valid file');
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Middleware để xử lý lỗi upload
const handleUploadError = (error, req, res, next) => {
  console.error('❌ Upload error:', error.message);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File quá lớn! Kích thước tối đa là 2MB.' });
    }
  }
  
  if (error.message.includes('Chỉ chấp nhận file')) {
    return res.status(400).json({ message: error.message });
  }
  
  return res.status(500).json({ message: 'Lỗi upload file' });
};

module.exports = upload;
module.exports.handleUploadError = handleUploadError;
