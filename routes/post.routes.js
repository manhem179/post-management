const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controller');
const upload = require('../middlewares/upload');

router.get('/', postCtrl.getPosts);
router.get('/export', postCtrl.exportCSV);
router.get('/:id', postCtrl.getPost);
router.post('/', upload.single('thumbnail'), postCtrl.createPost);
router.put('/:id', upload.single('thumbnail'), postCtrl.updatePost);
router.delete('/:id', postCtrl.deletePost);

module.exports = router;
