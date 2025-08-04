require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');

async function fixPosts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Lấy tất cả bài viết
        const posts = await Post.find().populate('author', 'username');
        console.log(`📝 Found ${posts.length} posts`);

        // Kiểm tra từng bài viết
        for (const post of posts) {
            console.log(`\n--- Post: ${post.title} ---`);
            console.log(`ID: ${post._id}`);
            console.log(`Author: ${post.author?.username} (${post.author?._id})`);
            console.log(`Thumbnail: ${post.thumbnail || 'No thumbnail'}`);
            console.log(`Created: ${post.createdAt}`);
            
            // Kiểm tra xem có thumbnail không
            if (!post.thumbnail) {
                console.log('⚠️ No thumbnail found');
            }
        }

        // Tạo một bài viết test mới để kiểm tra
        const testUser = await User.findOne({ username: 'admin' });
        if (testUser) {
            console.log('\n🧪 Creating test post...');
            const testPost = new Post({
                title: 'Bài viết test với ảnh',
                content: 'Đây là bài viết test để kiểm tra chức năng upload ảnh',
                author: testUser._id,
                category: 'tech',
                thumbnail: null
            });
            await testPost.save();
            console.log('✅ Test post created');
        }

        console.log('\n🎉 Post analysis completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixPosts(); 