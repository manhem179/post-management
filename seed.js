require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

async function seedData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Create sample users
        const users = await User.create([
            { username: 'admin', password: 'admin123' },
            { username: 'user1', password: 'user123' },
            { username: 'user2', password: 'user123' }
        ]);
        console.log('👥 Created sample users');

        // Create sample posts
        const posts = await Post.create([
            {
                title: 'Giới thiệu về Node.js',
                content: 'Node.js là một runtime environment cho JavaScript, cho phép chạy JavaScript ở server-side. Nó được xây dựng trên V8 JavaScript engine của Chrome.',
                author: users[0]._id,
                category: 'tech',
                createdAt: new Date('2024-01-15')
            },
            {
                title: 'Lợi ích của MongoDB',
                content: 'MongoDB là một NoSQL database, cung cấp hiệu suất cao và khả năng mở rộng tốt. Nó sử dụng JSON-like documents để lưu trữ dữ liệu.',
                author: users[1]._id,
                category: 'tech',
                createdAt: new Date('2024-01-16')
            },
            {
                title: 'Cách sống lành mạnh',
                content: 'Sống lành mạnh bao gồm việc ăn uống đầy đủ, tập thể dục thường xuyên và ngủ đủ giấc. Điều này giúp cải thiện sức khỏe và tinh thần.',
                author: users[2]._id,
                category: 'lifestyle',
                createdAt: new Date('2024-01-17')
            },
            {
                title: 'Chiến lược kinh doanh hiệu quả',
                content: 'Một chiến lược kinh doanh hiệu quả cần có mục tiêu rõ ràng, phân tích thị trường và kế hoạch thực hiện cụ thể.',
                author: users[0]._id,
                category: 'business',
                createdAt: new Date('2024-01-18')
            },
            {
                title: 'Bóng đá Việt Nam',
                content: 'Bóng đá Việt Nam đã có những bước tiến đáng kể trong những năm gần đây, với nhiều thành tích quốc tế ấn tượng.',
                author: users[1]._id,
                category: 'sports',
                createdAt: new Date('2024-01-19')
            },
            {
                title: 'React vs Vue.js',
                content: 'Cả React và Vue.js đều là những framework JavaScript mạnh mẽ. React được phát triển bởi Facebook, trong khi Vue.js được tạo bởi Evan You.',
                author: users[2]._id,
                category: 'tech',
                createdAt: new Date('2024-01-20')
            }
        ]);
        console.log('📝 Created sample posts');

        console.log('✅ Seed data completed successfully!');
        console.log(`📊 Created ${users.length} users and ${posts.length} posts`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData(); 