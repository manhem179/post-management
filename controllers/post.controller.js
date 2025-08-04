const Post = require('../models/Post');
const postEvents = require('../events/post.event');
const { writePostsToCSV } = require('../utils/csvExport');
const { sendMockEmail } = require('../utils/emailMock');
const redis = require('../cache/redisClient');

exports.getPosts = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', category } = req.query;
  const query = category ? { category } : {};
  const cacheKey = `posts:${page}:${limit}:${sortBy}:${category || 'all'}`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const posts = await Post.find(query)
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('author', 'username');

  await redis.set(cacheKey, JSON.stringify(posts), { EX: 30 });
  res.json(posts);
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
};

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user.id,
      thumbnail: req.file?.filename
    });
    await post.save();
    postEvents.emit('post:created', post);
    sendMockEmail(post);
    await redis.flushAll();
    res.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    console.log('Update post - User ID:', req.user.id);
    console.log('Update post - Post ID:', req.params.id);
    
    // Tìm bài viết và kiểm tra quyền
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    
    // Kiểm tra quyền sở hữu
    if (post.author.toString() !== req.user.id) {
      console.log('Permission denied - Post author:', post.author, 'User ID:', req.user.id);
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa bài viết này' });
    }

    // Cập nhật thông tin
    const updateData = { ...req.body };
    if (req.file) {
      updateData.thumbnail = req.file.filename;
      console.log('New thumbnail:', req.file.filename);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    await redis.flushAll();
    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật bài viết' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' });
    }
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    await redis.flushAll();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Lỗi khi xóa bài viết' });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    const filePath = await writePostsToCSV(posts);
    res.download(filePath);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Lỗi khi xuất CSV' });
  }
};
