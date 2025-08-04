const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🧪 Testing Post Management API...\n');

    try {
        // Test 1: Register
        console.log('1. Testing Register...');
        const registerResponse = await axios.post(`${BASE_URL}/register`, {
            username: 'testuser2',
            password: 'testpass123'
        });
        console.log('✅ Register successful');

        // Test 2: Login
        console.log('\n2. Testing Login...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            username: 'testuser2',
            password: 'testpass123'
        });
        const token = loginResponse.data.token;
        console.log('✅ Login successful, got token');

        // Test 3: Get Posts (without token - should work)
        console.log('\n3. Testing Get Posts (public)...');
        const postsResponse = await axios.get(`${BASE_URL}/posts`);
        console.log(`✅ Got ${postsResponse.data.length} posts`);

        // Test 4: Create Post (with token)
        console.log('\n4. Testing Create Post...');
        const createPostResponse = await axios.post(`${BASE_URL}/posts`, {
            title: 'Test Post from API',
            content: 'This is a test post created via API testing',
            category: 'tech'
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Post created successfully');

        // Test 5: Get Posts with filters
        console.log('\n5. Testing Get Posts with filters...');
        const filteredPostsResponse = await axios.get(`${BASE_URL}/posts?category=tech&sortBy=createdAt&page=1&limit=5`);
        console.log(`✅ Got ${filteredPostsResponse.data.length} filtered posts`);

        // Test 6: Export CSV
        console.log('\n6. Testing Export CSV...');
        const csvResponse = await axios.get(`${BASE_URL}/posts/export`, {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'stream'
        });
        console.log('✅ CSV export successful');

        console.log('\n🎉 All API tests passed successfully!');
        console.log('\n📋 Test Summary:');
        console.log('- ✅ Register: Working');
        console.log('- ✅ Login: Working');
        console.log('- ✅ Get Posts (public): Working');
        console.log('- ✅ Create Post (with auth): Working');
        console.log('- ✅ Filter Posts: Working');
        console.log('- ✅ Export CSV: Working');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run tests
testAPI(); 