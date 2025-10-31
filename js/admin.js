// 管理员页面功能逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 页面元素
    const logoutBtn = document.getElementById('logoutBtn');
    const adminName = document.getElementById('adminName');
    
    // 统计元素
    const totalUsers = document.getElementById('totalUsers');
    const totalWords = document.getElementById('totalWords');
    const activeTasks = document.getElementById('activeTasks');
    const systemStatus = document.getElementById('systemStatus');
    const recentActivities = document.getElementById('recentActivities');

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
        // 显示管理员姓名
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.username) {
            adminName.textContent = `欢迎，${currentUser.username}管理员`;
        }

        updateDashboard();
    }

    // 更新仪表板
    function updateDashboard() {
        updateStatistics();
        updateRecentActivities();
    }

    // 更新统计信息
    function updateStatistics() {
        // 计算总用户数（模拟数据）
        const users = {
            students: 150,
            teachers: 15,
            admins: 3
        };
        const totalUserCount = users.students + users.teachers + users.admins;
        
        // 计算单词数量
        const wordDatabase = JSON.parse(localStorage.getItem('wordDatabase')) || getDefaultWordDatabase();
        const wordCount = Object.values(wordDatabase).reduce((total, words) => total + words.length, 0);
        
        // 计算活跃任务
        const tasks = JSON.parse(localStorage.getItem('teacherTasks')) || [];
        const now = new Date();
        const activeTasksCount = tasks.filter(task => {
            const startTime = new Date(task.startTime);
            const endTime = new Date(task.endTime);
            return startTime <= now && endTime >= now;
        }).length;

        // 更新显示
        totalUsers.textContent = totalUserCount;
        totalWords.textContent = wordCount;
        activeTasks.textContent = activeTasksCount;
        systemStatus.textContent = '正常';
    }

    // 更新最近活动
    function updateRecentActivities() {
        const activities = [
            {
                type: 'word_added',
                text: '添加了 20 个新单词到四级词库',
                time: '2小时前',
                icon: '📚'
            },
            {
                type: 'user_created',
                text: '新教师账户 "teacher2" 已创建',
                time: '5小时前',
                icon: '👤'
            },
            {
                type: 'system_backup',
                text: '系统自动备份已完成',
                time: '昨天',
                icon: '💾'
            },
            {
                type: 'word_updated',
                text: '更新了 "abandon" 单词的释义',
                time: '2天前',
                icon: '✏️'
            },
            {
                type: 'task_cleaned',
                text: '清理了过期的任务数据',
                time: '3天前',
                icon: '🧹'
            }
        ];

        if (activities.length === 0) {
            recentActivities.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>暂无活动记录</p>
                </div>
            `;
            return;
        }
        
        recentActivities.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // 获取默认单词数据库
    function getDefaultWordDatabase() {
        return {
            cet4: [
                { 
                    word: "abandon", 
                    phonetic: "/əˈbændən/", 
                    difficulty: "medium",
                    meanings: [
                        { partOfSpeech: "v.", meaning: "放弃，遗弃" },
                        { partOfSpeech: "n.", meaning: "放纵，放任" }
                    ],
                    examples: [
                        { english: "He abandoned his car and ran away.", chinese: "他弃车逃跑了。" }
                    ],
                    related: ["abandoned", "abandonment", "forsake"]
                },
                { 
                    word: "ability", 
                    phonetic: "/əˈbɪləti/", 
                    difficulty: "easy",
                    meanings: [
                        { partOfSpeech: "n.", meaning: "能力，才能" }
                    ],
                    examples: [
                        { english: "She has the ability to speak three languages.", chinese: "她有说三种语言的能力。" }
                    ],
                    related: ["able", "capability", "skill"]
                }
            ],
            cet6: [
                { 
                    word: "abbreviation", 
                    phonetic: "/əˌbriːviˈeɪʃn/", 
                    difficulty: "hard",
                    meanings: [
                        { partOfSpeech: "n.", meaning: "缩写，缩写词" }
                    ],
                    examples: [
                        { english: "UN is the abbreviation for United Nations.", chinese: "UN是联合国的缩写。" }
                    ],
                    related: ["abbreviate", "acronym", "short form"]
                }
            ]
        };
    }

    // 初始化应用
    initEventListeners();
    initDisplay();
    
    // 定期更新数据（每2分钟）
    setInterval(updateDashboard, 120000);
});