require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');

async function transferPosts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Tìm user hiện tại (user mới nhất)
        const currentUser = await User.findOne().sort({ createdAt: -1 });
        if (!currentUser) {
            console.log('❌ No user found');
            return;
        }

        console.log(`👤 Current user: ${currentUser.username} (${currentUser._id})`);

        // Lấy tất cả bài viết
        const posts = await Post.find().populate('author', 'username');
        console.log(`📝 Found ${posts.length} posts`);

        // Chuyển quyền sở hữu tất cả bài viết cho user hiện tại
        let updatedCount = 0;
        for (const post of posts) {
            if (post.author._id.toString() !== currentUser._id.toString()) {
                console.log(`🔄 Transferring post: "${post.title}" from ${post.author.username} to ${currentUser.username}`);
                
                await Post.findByIdAndUpdate(post._id, {
                    author: currentUser._id
                });
                
                updatedCount++;
            }
        }

        console.log(`✅ Transferred ${updatedCount} posts to ${currentUser.username}`);

        // Hiển thị lại danh sách bài viết sau khi chuyển
        const updatedPosts = await Post.find().populate('author', 'username');
        console.log('\n📋 Updated posts list:');
        updatedPosts.forEach(post => {
            console.log(`- "${post.title}" by ${post.author.username}`);
        });

        console.log('\n🎉 Transfer completed!');
        console.log(`💡 You can now edit all posts with account: ${currentUser.username}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

transferPosts(); 