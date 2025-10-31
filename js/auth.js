// 简单的认证逻辑 - 使用数据库
document.addEventListener('DOMContentLoaded', async function() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // 等待数据库初始化
    await wordUpDB.init();
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            try {
                // 从数据库查询用户
                const user = await wordUpDB.getUserByUsername(username);
                
                if (user && user.password === password && user.role === role) {
                    // 存储登录状态（不存储密码）
                    const { password: _, ...userWithoutPassword } = user;
                    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                    
                    // 跳转到对应页面
                    switch(role) {
                        case 'student':
                            window.location.href = 'student.html';
                            break;
                        case 'teacher':
                            window.location.href = 'teacher.html';
                            break;
                        case 'admin':
                            window.location.href = 'admin.html';
                            break;
                    }
                } else {
                    alert('账号或密码错误！请使用演示账号登录。');
                }
            } catch (error) {
                console.error('登录错误:', error);
                alert('登录过程中发生错误，请重试。');
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