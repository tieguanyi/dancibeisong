// 老师页面功能逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 页面元素
    const logoutBtn = document.getElementById('logoutBtn');
    const teacherName = document.getElementById('teacherName');
    
    // 统计元素
    const activeTasks = document.getElementById('activeTasks');
    const totalTasks = document.getElementById('totalTasks');
    const studentParticipation = document.getElementById('studentParticipation');
    const averageCompletion = document.getElementById('averageCompletion');
    
    // 列表元素
    const recentTasks = document.getElementById('recentTasks');
    const classesOverview = document.getElementById('classesOverview');
    const activityList = document.getElementById('activityList');

    // 模拟数据
    const classesData = [
        { id: 'class1', name: '计算机科学与技术1班', studentCount: 35, completionRate: 85 },
        { id: 'class2', name: '计算机科学与技术2班', studentCount: 32, completionRate: 78 },
        { id: 'class3', name: '软件工程1班', studentCount: 40, completionRate: 92 },
        { id: 'class4', name: '软件工程2班', studentCount: 38, completionRate: 65 },
        { id: 'class5', name: '人工智能1班', studentCount: 28, completionRate: 88 }
    ];

    const activityData = [
        {
            type: 'task_published',
            text: '发布了新任务 "第四单元单词测试"',
            time: '2小时前',
            icon: '📝'
        },
        {
            type: 'task_completed',
            text: '计算机1班完成了 "第三单元单词背诵"',
            time: '5小时前',
            icon: '✅'
        },
        {
            type: 'student_joined',
            text: '新学生 张三 加入了 软件工程2班',
            time: '昨天',
            icon: '👤'
        },
        {
            type: 'task_created',
            text: '创建了任务草稿 "期中复习单词"',
            time: '昨天',
            icon: '📋'
        },
        {
            type: 'class_created',
            text: '创建了新班级 "人工智能2班"',
            time: '2天前',
            icon: '👥'
        }
    ];

    // 初始化事件监听
    function initEventListeners() {
        // 退出登录
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });

        // 页面加载时更新数据
        window.addEventListener('load', updateDashboard);
    }

    // 初始化显示
    function initDisplay() {
        // 显示教师姓名
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.username) {
            teacherName.textContent = `欢迎，${currentUser.username}老师`;
        }

        updateDashboard();
    }

    // 更新仪表板
    function updateDashboard() {
        updateStatistics();
        updateRecentTasks();
        updateClassesOverview();
        updateActivityList();
    }

    // 更新统计信息
    function updateStatistics() {
        const tasks = JSON.parse(localStorage.getItem('teacherTasks')) || [];
        const now = new Date();
        
        // 进行中任务
        const activeTasksCount = tasks.filter(task => {
            const startTime = new Date(task.startTime);
            const endTime = new Date(task.endTime);
            return startTime <= now && endTime >= now;
        }).length;
        
        // 总任务数
        const totalTasksCount = tasks.length;
        
        // 计算学生参与率和平均完成率（模拟数据）
        const participationRate = calculateParticipationRate(tasks);
        const avgCompletionRate = calculateAverageCompletionRate(tasks);
        
        // 更新显示
        activeTasks.textContent = activeTasksCount;
        totalTasks.textContent = totalTasksCount;
        studentParticipation.textContent = `${participationRate}%`;
        averageCompletion.textContent = `${avgCompletionRate}%`;
    }

    // 计算学生参与率（模拟）
    function calculateParticipationRate(tasks) {
        if (tasks.length === 0) return 0;
        
        // 模拟计算 - 实际项目中应该从服务器获取真实数据
        let totalParticipation = 0;
        tasks.forEach(task => {
            // 基于任务状态和时间模拟参与率
            const now = new Date();
            const endTime = new Date(task.endTime);
            const timePassed = (now - new Date(task.startTime)) / (endTime - new Date(task.startTime));
            
            if (timePassed < 0) timePassed = 0;
            if (timePassed > 1) timePassed = 1;
            
            const baseRate = 70; // 基础参与率
            const randomFactor = Math.random() * 20 - 10; // -10 到 +10 的随机变化
            const taskParticipation = Math.min(100, Math.max(0, baseRate + randomFactor));
            
            totalParticipation += taskParticipation;
        });
        
        return Math.round(totalParticipation / tasks.length);
    }

    // 计算平均完成率（模拟）
    function calculateAverageCompletionRate(tasks) {
        if (tasks.length === 0) return 0;
        
        // 模拟计算 - 实际项目中应该从服务器获取真实数据
        let totalCompletion = 0;
        tasks.forEach(task => {
            // 基于任务难度和类型模拟完成率
            let baseRate;
            switch (task.type) {
                case 'reciting':
                    baseRate = 75;
                    break;
                case 'testing':
                    baseRate = 65;
                    break;
                case 'review':
                    baseRate = 60;
                    break;
                default:
                    baseRate = 70;
            }
            
            const randomFactor = Math.random() * 20 - 10; // -10 到 +10 的随机变化
            const taskCompletion = Math.min(100, Math.max(0, baseRate + randomFactor));
            
            totalCompletion += taskCompletion;
        });
        
        return Math.round(totalCompletion / tasks.length);
    }

    // 更新近期任务列表
    function updateRecentTasks() {
        const tasks = JSON.parse(localStorage.getItem('teacherTasks')) || [];
        
        // 按发布时间排序，取最近5个
        const recentTasksList = tasks
            .sort((a, b) => new Date(b.publishTime || b.createdTime) - new Date(a.publishTime || a.createdTime))
            .slice(0, 5);
        
        if (recentTasksList.length === 0) {
            recentTasks.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>暂无任务</p>
                    <button onclick="location.href='task-publish.html'" class="primary-btn">发布第一个任务</button>
                </div>
            `;
            return;
        }
        
        recentTasks.innerHTML = recentTasksList.map(task => {
            const status = getTaskStatus(task);
            const progress = calculateTaskProgress(task);
            const classNames = getTaskClassNames(task.classes);
            
            return `
                <div class="task-item">
                    <div class="task-header">
                        <div>
                            <div class="task-name">${task.name}</div>
                            <div class="task-classes">${classNames}</div>
                        </div>
                        <span class="status-badge status-${status}">${getStatusText(status)}</span>
                    </div>
                    <div class="task-time">
                        ${formatTaskTime(task.startTime, task.endTime)}
                    </div>
                    <div class="task-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">完成率: ${progress}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 更新班级概览
    function updateClassesOverview() {
        if (classesData.length === 0) {
            classesOverview.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <p>暂无班级</p>
                    <button onclick="location.href='class-management.html'" class="primary-btn">创建班级</button>
                </div>
            `;
            return;
        }
        
        classesOverview.innerHTML = classesData.map(cls => {
            return `
                <div class="task-item">
                    <div class="task-header">
                        <div class="task-name">${cls.name}</div>
                        <span class="task-classes">${cls.studentCount}人</span>
                    </div>
                    <div class="task-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${cls.completionRate}%"></div>
                        </div>
                        <div class="progress-text">平均完成率: ${cls.completionRate}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 更新活动列表
    function updateActivityList() {
        if (activityData.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>暂无活动记录</p>
                </div>
            `;
            return;
        }
        
        activityList.innerHTML = activityData.map(activity => {
            return `
                <div class="activity-item">
                    <div class="activity-icon">${activity.icon}</div>
                    <div class="activity-content">
                        <div class="activity-text">${activity.text}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 工具函数
    function getTaskStatus(task) {
        const now = new Date();
        const startTime = new Date(task.startTime);
        const endTime = new Date(task.endTime);
        
        if (task.status === 'draft') {
            return 'draft';
        } else if (now < startTime) {
            return 'scheduled';
        } else if (now > endTime) {
            return 'ended';
        } else {
            return 'published';
        }
    }

    function getStatusText(status) {
        const statusMap = {
            'draft': '草稿',
            'scheduled': '未开始',
            'published': '进行中',
            'ended': '已结束'
        };
        return statusMap[status] || status;
    }

    function calculateTaskProgress(task) {
        // 模拟任务进度 - 实际项目中应该从服务器获取真实数据
        const now = new Date();
        const startTime = new Date(task.startTime);
        const endTime = new Date(task.endTime);
        
        // 时间进度
        const totalTime = endTime - startTime;
        const elapsedTime = now - startTime;
        const timeProgress = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
        
        // 基于时间进度和随机因素计算完成率
        const randomFactor = Math.random() * 20 - 10; // -10 到 +10 的随机变化
        let completionRate = timeProgress + randomFactor;
        
        // 确保在合理范围内
        completionRate = Math.min(100, Math.max(0, completionRate));
        
        return Math.round(completionRate);
    }

    function getTaskClassNames(classIds) {
        if (!classIds || classIds.length === 0) return '未选择班级';
        
        const names = classIds.map(classId => {
            const cls = classesData.find(c => c.id === classId);
            return cls ? cls.name : '未知班级';
        });
        
        return names.length > 2 ? `${names.length}个班级` : names.join('、');
    }

    function formatTaskTime(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        
        const startStr = start.toLocaleDateString('zh-CN');
        const endStr = end.toLocaleDateString('zh-CN');
        
        return `${startStr} - ${endStr}`;
    }

    // 初始化应用
    initEventListeners();
    initDisplay();
    
    // 定期更新数据（每2分钟）
    setInterval(updateDashboard, 120000);
});