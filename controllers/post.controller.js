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
};

exports.updatePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(403).json({ message: 'Not allowed' });

  Object.assign(post, req.body);
  if (req.file) post.thumbnail = req.file.filename;
  await post.save();
  await redis.flushAll();
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(403).json({ message: 'Not allowed' });
  await redis.flushAll();
  res.json({ message: 'Post deleted' });
};

exports.exportCSV = async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  const filePath = await writePostsToCSV(posts);
  res.download(filePath);
};
