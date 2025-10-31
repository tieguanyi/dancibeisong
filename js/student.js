// 学生页面基础逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 页面元素
    const logoutBtn = document.getElementById('logoutBtn');
    const pendingTasksCount = document.getElementById('pendingTasksCount');
    const taskCompletionRate = document.getElementById('taskCompletionRate');
    const recentTasks = document.getElementById('recentTasks');

    // 初始化事件监听
    function initEventListeners() {
        // 退出登录
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }

    // 初始化显示
    function initDisplay() {
        // 更新任务统计
        updateTaskStats();
        
        // 更新学习数据
        updateLearningStats();
    }

    // 更新任务统计
    function updateTaskStats() {
        const tasks = getStudentTasks();
        const pendingTasks = tasks.filter(task => 
            task.status === 'not_started' || task.status === 'in_progress'
        ).length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
        
        pendingTasksCount.textContent = pendingTasks;
        taskCompletionRate.textContent = `${completionRate}%`;
        
        // 更新近期任务列表
        updateRecentTasks();
    }

    // 获取学生任务
    function getStudentTasks() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const allTasks = JSON.parse(localStorage.getItem('teacherTasks')) || [];
        const studentProgress = JSON.parse(localStorage.getItem('studentTaskProgress')) || {};
        
        const studentId = currentUser.username;
        const progress = studentProgress[studentId] || {};

        const studentTasks = allTasks.map(task => {
            const taskProgress = progress[task.id] || {
                status: 'not_started',
                progress: 0,
                score: null,
                startedAt: null,
                completedAt: null
            };

            // 检查任务是否逾期
            const now = new Date();
            const endTime = new Date(task.endTime);
            let status = taskProgress.status;
            
            if (status !== 'completed' && now > endTime) {
                status = 'overdue';
            }

            return {
                ...task,
                status: status,
                progress: taskProgress.progress,
                score: taskProgress.score,
                startedAt: taskProgress.startedAt,
                completedAt: taskProgress.completedAt,
                isOverdue: now > endTime
            };
        });

        return studentTasks;
    }

    // 更新近期任务列表
    function updateRecentTasks() {
        const tasks = getStudentTasks();
        const recentTasksList = tasks
            .sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
            .slice(0, 3); // 只显示最近3个任务
        
        if (recentTasksList.length === 0) {
            recentTasks.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>暂无任务</p>
                    <p>等待老师发布新任务</p>
                </div>
            `;
            return;
        }
        
        recentTasks.innerHTML = recentTasksList.map(task => {
            const progressPercent = task.progress || 0;
            
            return `
                <div class="task-item" onclick="location.href='tasks.html'">
                    <div class="task-header">
                        <div class="task-name">${task.name}</div>
                        <span class="task-status status-${task.status}">${getStatusText(task.status)}</span>
                    </div>
                    <div class="task-time">截止: ${formatDate(task.endTime)}</div>
                    ${task.status !== 'completed' ? `
                        <div class="task-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // 更新学习统计
    function updateLearningStats() {
        // 这里可以从localStorage获取学习数据
        // 目前使用模拟数据
        const learningStats = JSON.parse(localStorage.getItem('learningStats')) || {
            weeklyDays: 5,
            weeklyWords: 87,
            streakDays: 12,
            wrongWords: 23
        };
        
        // 更新显示
        document.querySelectorAll('.learning-stats .stat-value').forEach((element, index) => {
            const values = Object.values(learningStats);
            if (values[index] !== undefined) {
                element.textContent = values[index];
            }
        });
    }

    // 工具函数
    function getStatusText(status) {
        const statusMap = {
            'not_started': '未开始',
            'in_progress': '进行中',
            'completed': '已完成',
            'overdue': '已逾期'
        };
        return statusMap[status] || status;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const timeDiff = date - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) {
            return `逾期 ${Math.abs(daysDiff)} 天`;
        } else if (daysDiff === 0) {
            return '今天截止';
        } else if (daysDiff === 1) {
            return '明天截止';
        } else {
            return `${daysDiff} 天后截止`;
        }
    }

    // 初始化应用
    initEventListeners();
    initDisplay();
    
    // 定期更新数据（每5分钟）
    setInterval(updateTaskStats, 300000);
});