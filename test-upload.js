require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Kiểm tra thư mục uploads
function checkUploadsDirectory() {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    console.log('📁 Checking uploads directory...');
    console.log('Path:', uploadsDir);
    
    if (!fs.existsSync(uploadsDir)) {
        console.log('❌ Uploads directory does not exist!');
        console.log('Creating uploads directory...');
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('✅ Created uploads directory');
    } else {
        console.log('✅ Uploads directory exists');
    }
    
    // Liệt kê files trong uploads
    const files = fs.readdirSync(uploadsDir);
    console.log(`📄 Found ${files.length} files in uploads:`);
    files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${stats.size} bytes)`);
    });
}

// Test tạo file ảnh mẫu
function createSampleImage() {
    const uploadsDir = path.join(__dirname, 'uploads');
    const sampleFile = path.join(uploadsDir, 'test-image.txt');
    
    console.log('\n🧪 Creating sample file...');
    fs.writeFileSync(sampleFile, 'This is a test file for uploads directory');
    console.log('✅ Created sample file');
}

// Kiểm tra quyền ghi
function checkWritePermission() {
    const uploadsDir = path.join(__dirname, 'uploads');
    const testFile = path.join(uploadsDir, 'write-test.txt');
    
    console.log('\n🔐 Testing write permission...');
    try {
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('✅ Write permission OK');
    } catch (error) {
        console.log('❌ Write permission failed:', error.message);
    }
}

// Main function
function main() {
    console.log('🧪 Testing upload functionality...\n');
    
    checkUploadsDirectory();
    createSampleImage();
    checkWritePermission();
    
    console.log('\n🎉 Upload test completed!');
}

main(); 