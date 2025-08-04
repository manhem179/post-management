// Post Management System Frontend

const API_BASE = '/api';
let currentUser = null;
let currentPage = 1;
let totalPages = 1;
let totalPosts = 0;
let editingPostId = null;
let currentImageFile = null; // Lưu trạng thái ảnh hiện tại

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    showLoginForm();
});

// Setup event listeners
function setupEventListeners() {
    // Auth forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', () => {
        currentPage = 1; // Reset về trang 1 khi filter
        loadPosts();
    });
    document.getElementById('sortBy').addEventListener('change', () => {
        currentPage = 1; // Reset về trang 1 khi sort
        loadPosts();
    });
}

// Image preview functions
function previewImage(input) {
    const file = input.files[0];
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (file) {
        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            showAlert('File quá lớn! Kích thước tối đa là 2MB.', 'danger');
            input.value = '';
            currentImageFile = null;
            return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showAlert('Chỉ chấp nhận file .jpg, .jpeg, .png!', 'danger');
            input.value = '';
            currentImageFile = null;
            return;
        }
        
        // Lưu file để sử dụng sau
        currentImageFile = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        currentImageFile = null;
    }
}

function removeImage() {
    const input = document.querySelector('input[name="thumbnail"]');
    const preview = document.getElementById('imagePreview');
    
    input.value = '';
    preview.style.display = 'none';
    currentImageFile = null;
}

// Auth functions
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', result.token);
            currentUser = { username: data.username };
            showMainContent();
            loadPosts();
            showAlert('Đăng nhập thành công!', 'success');
        } else {
            showAlert(result.message || 'Đăng nhập thất bại!', 'danger');
        }
    } catch (error) {
        showAlert('Lỗi kết nối!', 'danger');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            showLoginForm();
        } else {
            showAlert(result.message || 'Đăng ký thất bại!', 'danger');
        }
    } catch (error) {
        showAlert('Lỗi kết nối!', 'danger');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    showLoginForm();
    showAlert('Đã đăng xuất!', 'info');
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        currentUser = { username: 'User' }; // Simplified
        showMainContent();
        loadPosts();
    }
}

// UI functions
function showLoginForm() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showMainContent() {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Posts functions
async function loadPosts(page = 1) {
    currentPage = page;
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    const params = new URLSearchParams({
        page: page,
        limit: 6,
        sortBy: sortBy
    });
    
    if (category) params.append('category', category);

    try {
        const response = await fetch(`${API_BASE}/posts?${params}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts);
            
            // Tính toán phân trang
            await calculatePagination(category, sortBy);
        } else {
            showAlert('Không thể tải danh sách bài viết!', 'danger');
        }
    } catch (error) {
        showAlert('Lỗi kết nối!', 'danger');
    }
}

// Tính toán phân trang
async function calculatePagination(category, sortBy) {
    try {
        const params = new URLSearchParams({
            page: 1,
            limit: 1000, // Lấy tất cả để đếm
            sortBy: sortBy
        });
        
        if (category) params.append('category', category);

        const response = await fetch(`${API_BASE}/posts?${params}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const allPosts = await response.json();
            totalPosts = allPosts.length;
            totalPages = Math.ceil(totalPosts / 6);
            displayPagination();
        }
    } catch (error) {
        console.error('Error calculating pagination:', error);
    }
}

// Hiển thị phân trang
function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) {
        return; // Không hiển thị phân trang nếu chỉ có 1 trang
    }

    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <button class="page-link" onclick="loadPosts(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Trước
        </button>
    `;
    paginationContainer.appendChild(prevLi);

    // Các nút số trang
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `
            <button class="page-link" onclick="loadPosts(${i})">${i}</button>
        `;
        paginationContainer.appendChild(pageLi);
    }

    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <button class="page-link" onclick="loadPosts(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Tiếp <i class="fas fa-chevron-right"></i>
        </button>
    `;
    paginationContainer.appendChild(nextLi);

    // Hiển thị thông tin trang
    const infoDiv = document.createElement('div');
    infoDiv.className = 'text-center mt-2 text-muted';
    infoDiv.innerHTML = `Trang ${currentPage} / ${totalPages} (${totalPosts} bài viết)`;
    paginationContainer.parentNode.appendChild(infoDiv);
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('postsList');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Không có bài viết nào.</p>
            </div>
        `;
        return;
    }

    posts.forEach(post => {
        const postCard = createPostCard(post);
        postsContainer.appendChild(postCard);
    });
}

function createPostCard(post) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const thumbnailUrl = post.thumbnail ? `/uploads/${post.thumbnail}` : 'https://via.placeholder.com/300x200?text=No+Image';
    const categoryClass = getCategoryClass(post.category);
    const formattedDate = new Date(post.createdAt).toLocaleDateString('vi-VN');
    
    col.innerHTML = `
        <div class="card post-card h-100">
            <img src="${thumbnailUrl}" class="card-img-top post-thumbnail" alt="${post.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="card-body d-flex flex-column">
                <div class="mb-2">
                    <span class="badge ${categoryClass} category-badge">${getCategoryName(post.category)}</span>
                </div>
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text post-content">${post.content}</p>
                <div class="mt-auto">
                    <small class="author-info">
                        <i class="fas fa-user me-1"></i>${post.author?.username || 'Unknown'}
                    </small>
                    <br>
                    <small class="text-muted">
                        <i class="fas fa-calendar me-1"></i>${formattedDate}
                    </small>
                </div>
            </div>
            <div class="card-footer bg-transparent">
                <div class="btn-group w-100" role="group">
                    <button class="btn btn-outline-primary btn-sm" onclick="viewPost('${post._id}')">
                        <i class="fas fa-eye me-1"></i>Xem
                    </button>
                    <button class="btn btn-outline-warning btn-sm" onclick="editPost('${post._id}')">
                        <i class="fas fa-edit me-1"></i>Sửa
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deletePost('${post._id}')">
                        <i class="fas fa-trash me-1"></i>Xóa
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

function getCategoryClass(category) {
    const classes = {
        'tech': 'bg-primary',
        'lifestyle': 'bg-success',
        'business': 'bg-warning',
        'sports': 'bg-info'
    };
    return classes[category] || 'bg-secondary';
}

function getCategoryName(category) {
    const names = {
        'tech': 'Công nghệ',
        'lifestyle': 'Lối sống',
        'business': 'Kinh doanh',
        'sports': 'Thể thao'
    };
    return names[category] || category;
}

// Post CRUD functions
function showCreatePostForm() {
    editingPostId = null;
    currentImageFile = null;
    document.getElementById('modalTitle').textContent = 'Tạo bài viết mới';
    document.getElementById('postForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    new bootstrap.Modal(document.getElementById('postModal')).show();
}

function editPost(postId) {
    editingPostId = postId;
    currentImageFile = null;
    document.getElementById('modalTitle').textContent = 'Chỉnh sửa bài viết';
    
    // Load post data
    fetch(`${API_BASE}/posts/${postId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(post => {
        const form = document.getElementById('postForm');
        form.title.value = post.title;
        form.content.value = post.content;
        form.category.value = post.category;
        
        // Show existing image if available
        if (post.thumbnail) {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            previewImg.src = `/uploads/${post.thumbnail}`;
            preview.style.display = 'block';
        }
        
        new bootstrap.Modal(document.getElementById('postModal')).show();
    })
    .catch(error => {
        showAlert('Không thể tải thông tin bài viết!', 'danger');
    });
}

async function savePost() {
    const form = document.getElementById('postForm');
    const formData = new FormData(form);
    
    // Thêm file ảnh nếu có
    if (currentImageFile) {
        formData.set('thumbnail', currentImageFile);
    }
    
    const url = editingPostId 
        ? `${API_BASE}/posts/${editingPostId}`
        : `${API_BASE}/posts`;
    
    const method = editingPostId ? 'PUT' : 'POST';
    
    // Show loading state
    const saveButton = document.querySelector('#postModal .btn-primary');
    const saveButtonText = document.getElementById('saveButtonText');
    const saveButtonSpinner = document.getElementById('saveButtonSpinner');
    
    saveButton.disabled = true;
    saveButtonText.textContent = 'Đang lưu...';
    saveButtonSpinner.style.display = 'inline-block';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const result = await response.json();
        
        if (response.ok) {
            showAlert(editingPostId ? 'Cập nhật thành công!' : 'Tạo bài viết thành công!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('postModal')).hide();
            loadPosts(currentPage);
            currentImageFile = null; // Reset image file
        } else {
            showAlert(result.message || 'Thao tác thất bại!', 'danger');
        }
    } catch (error) {
        console.error('Save post error:', error);
        showAlert('Lỗi kết nối!', 'danger');
    } finally {
        // Reset button state
        saveButton.disabled = false;
        saveButtonText.textContent = 'Lưu';
        saveButtonSpinner.style.display = 'none';
    }
}

async function deletePost(postId) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            showAlert('Xóa bài viết thành công!', 'success');
            loadPosts(currentPage);
        } else {
            const result = await response.json();
            showAlert(result.message || 'Xóa bài viết thất bại!', 'danger');
        }
    } catch (error) {
        showAlert('Lỗi kết nối!', 'danger');
    }
}

function viewPost(postId) {
    // Implement post detail view
    alert('Chức năng xem chi tiết sẽ được phát triển sau!');
}

async function exportCSV() {
    try {
        const response = await fetch(`${API_BASE}/posts/export`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'posts.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showAlert('Xuất CSV thành công!', 'success');
        } else {
            showAlert('Xuất CSV thất bại!', 'danger');
        }
    } catch (error) {
        showAlert('Lỗi kết nối!', 'danger');
    }
} 