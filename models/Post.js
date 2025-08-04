const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  thumbnail: String, // Tên file hoặc Base64
  imageData: String, // Lưu ảnh dưới dạng Base64
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
