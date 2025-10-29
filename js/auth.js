// 简单的认证逻辑
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            // 简单的演示认证
            if ((username === 'student1' && password === '123' && role === 'student') ||
                (username === 'teacher1' && password === '123' && role === 'teacher')) {
                
                // 存储登录状态
                localStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    role: role
                }));
                
                // 跳转到对应页面
                if (role === 'student') {
                    window.location.href = 'student.html';
                } else {
                    window.location.href = 'teacher.html';
                }
            } else {
                alert('账号或密码错误！请使用演示账号登录。');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // 检查登录状态
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
});