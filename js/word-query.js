// 生词查询功能逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 页面元素
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionsList = document.getElementById('suggestionsList');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const searchHistory = document.getElementById('searchHistory');
    const historyList = document.getElementById('historyList');
    const wordBookSection = document.getElementById('wordBookSection');
    const wordBookList = document.getElementById('wordBookList');
    const backBtn = document.getElementById('backBtn');
    
    // 结果展示元素
    const resultWord = document.getElementById('resultWord');
    const wordSoundBtn = document.getElementById('wordSoundBtn');
    const addToWordBook = document.getElementById('addToWordBook');
    const resultPhonetic = document.getElementById('resultPhonetic');
    const resultDifficulty = document.getElementById('resultDifficulty');
    const meaningsList = document.getElementById('meaningsList');
    const examplesList = document.getElementById('examplesList');
    const relatedWords = document.getElementById('relatedWords');
    
    // 切换按钮
    const toggleHistory = document.getElementById('toggleHistory');
    const toggleWordBook = document.getElementById('toggleWordBook');

    // 模拟单词数据库
    const wordDatabase = [
        {
            word: "abandon",
            phonetic: "/əˈbændən/",
            difficulty: "中等",
            meanings: [
                {
                    partOfSpeech: "v.",
                    meaning: "放弃，遗弃",
                    examples: [
                        "He abandoned his car and ran away.",
                        "他弃车逃跑了。"
                    ]
                },
                {
                    partOfSpeech: "n.",
                    meaning: "放纵，放任",
                    examples: [
                        "They danced with wild abandon.",
                        "他们疯狂地跳舞。"
                    ]
                }
            ],
            related: ["abandoned", "abandonment", "forsake"]
        },
        {
            word: "ability",
            phonetic: "/əˈbɪləti/",
            difficulty: "简单",
            meanings: [
                {
                    partOfSpeech: "n.",
                    meaning: "能力，才能",
                    examples: [
                        "She has the ability to speak three languages.",
                        "她有说三种语言的能力。"
                    ]
                }
            ],
            related: ["able", "capability", "skill"]
        },
        {
            word: "abnormal",
            phonetic: "/æbˈnɔːrml/",
            difficulty: "中等",
            meanings: [
                {
                    partOfSpeech: "adj.",
                    meaning: "反常的，异常的",
                    examples: [
                        "Such cold weather is abnormal for June.",
                        "这样冷的天气在六月份是不正常的。"
                    ]
                }
            ],
            related: ["normal", "abnormality", "unusual"]
        },
        {
            word: "abolish",
            phonetic: "/əˈbɑːlɪʃ/",
            difficulty: "困难",
            meanings: [
                {
                    partOfSpeech: "v.",
                    meaning: "废除，取消",
                    examples: [
                        "Slavery was abolished in the 19th century.",
                        "奴隶制在19世纪被废除。"
                    ]
                }
            ],
            related: ["abolition", "cancel", "eliminate"]
        },
        {
            word: "abroad",
            phonetic: "/əˈbrɔːd/",
            difficulty: "简单",
            meanings: [
                {
                    partOfSpeech: "adv.",
                    meaning: "在国外，到国外",
                    examples: [
                        "She plans to study abroad next year.",
                        "她计划明年出国留学。"
                    ]
                }
            ],
            related: ["overseas", "foreign", "domestic"]
        },
        {
            word: "apple",
            phonetic: "/ˈæpl/",
            difficulty: "简单",
            meanings: [
                {
                    partOfSpeech: "n.",
                    meaning: "苹果",
                    examples: [
                        "She ate a red apple for lunch.",
                        "她午餐吃了一个红苹果。"
                    ]
                }
            ],
            related: ["fruit", "orange", "banana"]
        }
    ];

    // 应用状态
    let currentState = {
        searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
        wordBook: JSON.parse(localStorage.getItem('wordBook')) || [],
        currentWord: null
    };

    // 初始化事件监听
    function initEventListeners() {
        // 搜索功能
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('input', handleInput);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 语音搜索（模拟）
        voiceSearchBtn.addEventListener('click', simulateVoiceSearch);

        // 清除历史
        clearHistoryBtn.addEventListener('click', clearSearchHistory);

        // 单词操作
        wordSoundBtn.addEventListener('click', playWordSound);
        addToWordBook.addEventListener('click', toggleWordBookStatus);

        // 导航和切换
        backBtn.addEventListener('click', () => {
            window.location.href = 'student.html';
        });

        toggleHistory.addEventListener('click', () => {
            searchHistory.classList.toggle('collapsed');
            toggleHistory.textContent = searchHistory.classList.contains('collapsed') ? '展开' : '收起';
        });

        toggleWordBook.addEventListener('click', () => {
            wordBookSection.classList.toggle('collapsed');
            toggleWordBook.textContent = wordBookSection.classList.contains('collapsed') ? '展开' : '收起';
        });
    }

    // 处理输入事件
    function handleInput() {
        const query = searchInput.value.trim();
        
        if (query.length === 0) {
            searchSuggestions.classList.add('hidden');
            return;
        }

        // 显示搜索建议
        showSearchSuggestions(query);
    }

    // 显示搜索建议
    function showSearchSuggestions(query) {
        const suggestions = wordDatabase.filter(word => 
            word.word.toLowerCase().includes(query.toLowerCase()) ||
            word.meanings.some(meaning => 
                meaning.meaning.includes(query)
            )
        ).slice(0, 5); // 最多显示5个建议

        if (suggestions.length > 0) {
            suggestionsList.innerHTML = suggestions.map(word => `
                <div class="suggestion-item" data-word="${word.word}">
                    <strong>${word.word}</strong> - ${word.meanings[0].meaning}
                </div>
            `).join('');

            // 添加建议项点击事件
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    searchInput.value = this.dataset.word;
                    performSearch();
                });
            });

            searchSuggestions.classList.remove('hidden');
        } else {
            searchSuggestions.classList.add('hidden');
        }
    }

    // 执行搜索
    function performSearch() {
        const query = searchInput.value.trim();
        
        if (query.length === 0) {
            alert('请输入要查询的单词或释义');
            return;
        }

        // 隐藏建议
        searchSuggestions.classList.add('hidden');

        // 搜索单词
        const result = wordDatabase.find(word => 
            word.word.toLowerCase() === query.toLowerCase() ||
            word.meanings.some(meaning => 
                meaning.meaning === query
            )
        );

        if (result) {
            displayWordResult(result);
            addToSearchHistory(result.word);
        } else {
            showNoResults();
        }

        updateDisplay();
    }

    // 显示单词结果
    function displayWordResult(word) {
        currentState.currentWord = word;
        
        // 更新基本信息
        resultWord.textContent = word.word;
        resultPhonetic.textContent = word.phonetic;
        resultDifficulty.textContent = word.difficulty;

        // 更新释义
        meaningsList.innerHTML = word.meanings.map(meaning => `
            <div class="meaning-item">
                <span class="part-of-speech">${meaning.partOfSpeech}</span>
                <span class="meaning-text">${meaning.meaning}</span>
            </div>
        `).join('');

        // 更新例句
        examplesList.innerHTML = word.meanings.flatMap(meaning => 
            meaning.examples.filter((_, index) => index % 2 === 0).map((example, i) => {
                const translation = meaning.examples[i * 2 + 1];
                return `
                    <div class="example-item">
                        <div class="example-english">${example}</div>
                        <div class="example-chinese">${translation}</div>
                    </div>
                `;
            })
        ).join('');

        // 更新相关词汇
        relatedWords.innerHTML = word.related.map(relatedWord => `
            <div class="related-word" data-word="${relatedWord}">${relatedWord}</div>
        `).join('');

        // 添加相关词汇点击事件
        document.querySelectorAll('.related-word').forEach(item => {
            item.addEventListener('click', function() {
                searchInput.value = this.dataset.word;
                performSearch();
            });
        });

        // 更新生词本按钮状态
        updateBookmarkButton();

        // 显示结果
        searchResults.classList.remove('hidden');
        noResults.classList.add('hidden');
    }

    // 显示无结果
    function showNoResults() {
        searchResults.classList.add('hidden');
        noResults.classList.remove('hidden');
    }

    // 添加到搜索历史
    function addToSearchHistory(word) {
        // 移除重复项
        currentState.searchHistory = currentState.searchHistory.filter(
            item => item.word !== word
        );
        
        // 添加到历史开头
        currentState.searchHistory.unshift({
            word: word,
            timestamp: new Date().toLocaleString()
        });

        // 限制历史记录数量
        if (currentState.searchHistory.length > 10) {
            currentState.searchHistory = currentState.searchHistory.slice(0, 10);
        }

        // 保存到本地存储
        localStorage.setItem('searchHistory', JSON.stringify(currentState.searchHistory));
    }

    // 更新生词本按钮状态
    function updateBookmarkButton() {
        if (!currentState.currentWord) return;

        const isInWordBook = currentState.wordBook.some(
            item => item.word === currentState.currentWord.word
        );

        if (isInWordBook) {
            addToWordBook.textContent = '⭐ 已添加';
            addToWordBook.classList.add('added');
        } else {
            addToWordBook.textContent = '⭐ 加入生词本';
            addToWordBook.classList.remove('added');
        }
    }

    // 切换生词本状态
    function toggleWordBookStatus() {
        if (!currentState.currentWord) return;

        const wordIndex = currentState.wordBook.findIndex(
            item => item.word === currentState.currentWord.word
        );

        if (wordIndex === -1) {
            // 添加到生词本
            currentState.wordBook.push({
                word: currentState.currentWord.word,
                phonetic: currentState.currentWord.phonetic,
                meaning: currentState.currentWord.meanings[0].meaning,
                addedAt: new Date().toLocaleString()
            });
        } else {
            // 从生词本移除
            currentState.wordBook.splice(wordIndex, 1);
        }

        // 保存到本地存储
        localStorage.setItem('wordBook', JSON.stringify(currentState.wordBook));
        
        // 更新显示
        updateBookmarkButton();
        updateDisplay();
    }

    // 播放单词发音
    function playWordSound() {
        if (!currentState.currentWord) return;

        const utterance = new SpeechSynthesisUtterance(currentState.currentWord.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }

    // 模拟语音搜索
    function simulateVoiceSearch() {
        const sampleWords = ['apple', 'ability', 'abandon', 'abnormal'];
        const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
        
        searchInput.value = randomWord;
        performSearch();
    }

    // 清除搜索历史
    function clearSearchHistory() {
        if (confirm('确定要清除所有搜索历史吗？')) {
            currentState.searchHistory = [];
            localStorage.setItem('searchHistory', JSON.stringify(currentState.searchHistory));
            updateDisplay();
        }
    }

    // 更新显示
    function updateDisplay() {
        // 更新搜索历史
        updateHistoryDisplay();
        
        // 更新生词本
        updateWordBookDisplay();
    }

    // 更新历史显示
    function updateHistoryDisplay() {
        if (currentState.searchHistory.length === 0) {
            historyList.innerHTML = '<p style="color: #666; text-align: center;">暂无搜索历史</p>';
            return;
        }

        historyList.innerHTML = currentState.searchHistory.map(item => `
            <div class="history-item">
                <span class="history-word" data-word="${item.word}">${item.word}</span>
                <span class="history-time">${item.timestamp}</span>
            </div>
        `).join('');

        // 添加历史项点击事件
        document.querySelectorAll('.history-word').forEach(item => {
            item.addEventListener('click', function() {
                searchInput.value = this.dataset.word;
                performSearch();
            });
        });
    }

    // 更新生词本显示
    function updateWordBookDisplay() {
        if (currentState.wordBook.length === 0) {
            wordBookList.innerHTML = '<p style="color: #666; text-align: center;">生词本为空，快去添加单词吧！</p>';
            return;
        }

        wordBookList.innerHTML = currentState.wordBook.map(item => `
            <div class="wordbook-item">
                <div>
                    <span class="wordbook-word" data-word="${item.word}">
                        <strong>${item.word}</strong> 
                        <span style="color: #666; margin-left: 10px;">${item.phonetic}</span>
                    </span>
                    <div style="color: #666; font-size: 14px; margin-top: 5px;">${item.meaning}</div>
                </div>
                <button class="remove-btn" data-word="${item.word}">移除</button>
            </div>
        `).join('');

        // 添加生词本单词点击事件
        document.querySelectorAll('.wordbook-word').forEach(item => {
            item.addEventListener('click', function() {
                searchInput.value = this.dataset.word;
                performSearch();
            });
        });

        // 添加移除按钮点击事件
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const wordToRemove = this.dataset.word;
                currentState.wordBook = currentState.wordBook.filter(
                    item => item.word !== wordToRemove
                );
                localStorage.setItem('wordBook', JSON.stringify(currentState.wordBook));
                updateDisplay();
                
                // 如果当前显示的就是被移除的单词，更新按钮状态
                if (currentState.currentWord && currentState.currentWord.word === wordToRemove) {
                    updateBookmarkButton();
                }
            });
        });
    }

    // 初始化显示
    function initDisplay() {
        updateDisplay();
    }

    // 初始化应用
    initEventListeners();
    initDisplay();
});