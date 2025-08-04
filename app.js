require('dotenv').config(); // phải có dòng này ở đầu file app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middlewares/logger');
const verifyToken = require('./middlewares/verifyToken');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const path = require('path');
const { connectRedis } = require('./cache/redisClient');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes); // Đăng ký + Đăng nhập => KHÔNG cần token

// Post routes - GET không cần token, các method khác cần token
app.get('/api/posts', require('./controllers/post.controller').getPosts);
app.get('/api/posts/:id', require('./controllers/post.controller').getPost);
app.get('/api/posts/export', verifyToken, require('./controllers/post.controller').exportCSV);

// Protected routes
app.post('/api/posts', verifyToken, require('./middlewares/upload').single('thumbnail'), require('./controllers/post.controller').createPost);
app.put('/api/posts/:id', verifyToken, require('./middlewares/upload').single('thumbnail'), require('./controllers/post.controller').updatePost);
app.delete('/api/posts/:id', verifyToken, require('./controllers/post.controller').deletePost);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize connections
const initializeApp = async () => {
    // DB + Cache
    console.log('Mongo URI:', process.env.MONGO_URI); // ← Dòng kiểm tra
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }

    // Connect Redis
    await connectRedis();
};

initializeApp();

module.exports = app;
