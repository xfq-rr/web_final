document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 高技术力：自定义鼠标跟随器 ---
    const createCursor = () => {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorBlur = document.createElement('div');
        cursorBlur.className = 'custom-cursor-blur';
        document.body.appendChild(cursorBlur);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                cursorBlur.style.left = e.clientX + 'px';
                cursorBlur.style.top = e.clientY + 'px';
            }, 50);
        });

        const interactiveElements = document.querySelectorAll('a, button, .book-card, .category-item, .book-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
        document.body.classList.add('has-custom-cursor');
    };
    if (window.innerWidth > 768) createCursor();

    // --- 2. 滚动入场动画 (Scroll Reveal) ---
    const revealElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const targets = document.querySelectorAll('.hero h1, .hero p, .hero .btn, .featured-books h2, .book-item, .category-item, .book-card, .book-detail, .sidebar-widget, .canvas-section, .video-section');
        targets.forEach((el, index) => {
            el.classList.add('reveal');
            if (el.classList.contains('book-item') || el.classList.contains('category-item') || el.classList.contains('book-card')) {
                el.classList.add(`delay-${(index % 4) + 1}`);
            }
            observer.observe(el);
        });
    };
    revealElements();

    // --- 2026.5.20吴改 ---
   // --- 3. 用户状态显示 (localStorage) ---
// --- 3. 用户状态显示 (localStorage) ---
const checkUserStatus = () => {
    const username = localStorage.getItem('library_user');
    const loginLink = document.getElementById('loginLink');
    const navLinks = document.querySelector('.nav-links');
    const userInfo = document.getElementById('userInfo'); // 你现在用的是这个元素
    const currentUsername = document.getElementById('currentUsername');

    // ✅ 删除了不存在的 userDisplay 判断
    if (username && loginLink && navLinks && userInfo && currentUsername) {
        // 已登录：隐藏登录按钮，显示用户名和退出
        loginLink.style.display = 'none';
        userInfo.style.display = 'flex';
        currentUsername.textContent = username;

        // 自动添加"我的借阅"链接
        if (!document.querySelector('a[href="profile.html"]')) {
            const pLi = document.createElement('li');
            pLi.innerHTML = '<a href="profile.html">我的借阅</a>';
            navLinks.insertBefore(pLi, loginLink.parentElement);
        }

        // 绑定退出登录按钮
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('library_user'); // 清除用户名
        localStorage.removeItem('isLogin'); // 清除登录标记
        location.href = 'index.html';
    };
}
    } else {
        // 未登录：显示登录按钮，隐藏用户信息
        if (loginLink) loginLink.style.display = 'list-item';
        if (userInfo) userInfo.style.display = 'none';
        const profileLink = document.querySelector('a[href="profile.html"]');
        if (profileLink) profileLink.parentElement.remove();
    }
};

// 单独提取点击处理函数，方便移除
function handleAvatarClick() {
    const username = localStorage.getItem('library_user');
    // 更严谨的判断：用户名存在且非空
    if (username && username.trim() !== '') {
        // 已登录直接跳个人信息
        window.location.href = 'personal.html';
    } else {
        // 未登录跳登录页，带个标记告诉它要跳个人信息
        alert('您还未登录，请先登录');
        window.location.href = 'login.html?from=personal';
    }
}

// ✅ 头像点击逻辑（移到DOM加载完成后执行）
const initAvatarClick = () => {
    const avatarBtn = document.getElementById('avatarBtn');
    if (!avatarBtn) {
        console.warn('⚠️ 未找到id为「avatarBtn」的头像按钮，请检查页面元素ID！');
        return;
    }

    // 更可靠的方式移除旧事件（避免重复绑定）
    const newAvatarBtn = avatarBtn.cloneNode(true);
    avatarBtn.parentNode.replaceChild(newAvatarBtn, avatarBtn);

    // 绑定新的点击事件
    newAvatarBtn.addEventListener('click', handleAvatarClick);

    // 自定义鼠标效果
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        newAvatarBtn.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        newAvatarBtn.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    }
};

// 页面加载完成后执行所有初始化
checkUserStatus();
initAvatarClick();
/**/
//2026.5.20吴改
    // --- 全局借阅数据管理 ---
    /* const BorrowManager = {
        getBorrowed: () => JSON.parse(localStorage.getItem('borrowed_books') || '[]'),
        isBorrowed: (title) => BorrowManager.getBorrowed().includes(title),
        borrow: (title) => {
            const borrowed = BorrowManager.getBorrowed();
            if (!borrowed.includes(title)) {
                borrowed.push(title);
                localStorage.setItem('borrowed_books', JSON.stringify(borrowed));
                return true;
            }
            return false;
        },
        returnBook: (title) => {
            let borrowed = BorrowManager.getBorrowed();
            borrowed = borrowed.filter(t => t !== title);
            localStorage.setItem('borrowed_books', JSON.stringify(borrowed));
        },
        returnAll: () => {
            localStorage.setItem('borrowed_books', JSON.stringify([]));
        }
    }; */
// --- 全局借阅数据管理（新增历史记录） ---
const BorrowManager = {
    // 获取当前借阅
    getBorrowed: () => JSON.parse(localStorage.getItem('borrowed_books') || '[]'),
    // 获取所有借阅历史（含已归还）
    getHistory: () => JSON.parse(localStorage.getItem('borrow_history') || '[]'),
    // 判断是否已借出
    isBorrowed: (title) => BorrowManager.getBorrowed().includes(title),
    
    // 借阅图书：同时添加到当前借阅和历史记录
    borrow: (title) => {
        const borrowed = BorrowManager.getBorrowed();
        if (!borrowed.includes(title)) {
            borrowed.push(title);
            localStorage.setItem('borrowed_books', JSON.stringify(borrowed));
            
            // 新增：添加到借阅历史，记录借阅时间
            const history = BorrowManager.getHistory();
            history.push({
                title: title,
                borrowTime: new Date().toISOString().slice(0, 10), // 格式：2026-05-20
                returnTime: null // null表示未归还
            });
            localStorage.setItem('borrow_history', JSON.stringify(history));
            return true;
        }
        return false;
    },
    
    // 归还图书：从当前借阅移除，更新历史记录的归还时间
    returnBook: (title) => {
        // 更新当前借阅
        let borrowed = BorrowManager.getBorrowed();
        borrowed = borrowed.filter(t => t !== title);
        localStorage.setItem('borrowed_books', JSON.stringify(borrowed));
        
        // 更新历史记录：设置归还时间
        const history = BorrowManager.getHistory();
        const record = history.find(item => item.title === title && item.returnTime === null);
        if (record) {
            record.returnTime = new Date().toISOString().slice(0, 10);
            localStorage.setItem('borrow_history', JSON.stringify(history));
        }
    },
    
    // 归还所有图书
    returnAll: () => {
        const borrowed = BorrowManager.getBorrowed();
        const history = BorrowManager.getHistory();
        
        // 批量更新所有未归还记录的归还时间
        borrowed.forEach(title => {
            const record = history.find(item => item.title === title && item.returnTime === null);
            if (record) {
                record.returnTime = new Date().toISOString().slice(0, 10);
            }
        });
        
        localStorage.setItem('borrowed_books', JSON.stringify([]));
        localStorage.setItem('borrow_history', JSON.stringify(history));
    }
};

    const bookData = {
        "物种起源": { author: "达尔文", publisher: "商务印书馆", isbn: "978-7100010122", desc: "进化论的奠基之作，用大量证据提出了自然选择学说，彻底改变了人类对生命起源与演化的认知。" },
        "时间简史": { author: "霍金", publisher: "湖南科学技术出版社", isbn: "978-7535732309", desc: "用通俗语言讲述宇宙起源、黑洞、时间与空间的奥秘，让普通人也能理解复杂的物理学概念。" },
        "自然哲学的数学原理": { author: "牛顿", publisher: "北京大学出版社", isbn: "978-7301085521", desc: "经典力学的里程碑，系统阐述了万有引力定律与三大运动定律，奠定了近代物理学的基础。" },
        "关于两大世界体系的对话": { author: "伽利略", publisher: "上海人民出版社", isbn: "978-7208123456", desc: "以对话形式论证日心说，挑战了当时的权威观点，推动了科学思想的解放与天文学的革命。" },
        "史记": { author: "司马迁", publisher: "中华书局", isbn: "978-7101003048", desc: "中国第一部纪传体通史，记载了从黄帝到汉武帝时期的历史，被誉为 “史家之绝唱，无韵之离骚”。" },
        "资治通鉴": { author: "司马光", publisher: "中华书局", isbn: "978-7101000122", desc: "编年体通史巨著，以时间为线索梳理历代兴衰，旨在为统治者提供治国理政的历史借鉴。" },
        "明朝那些事儿": { author: "当年明月", publisher: "浙江人民出版社", isbn: "978-7213040603", desc: "以幽默通俗的语言讲述明朝三百年历史，让枯燥的史料变得生动有趣，是现象级的历史读物。" },
        "罗马帝国衰亡史": { author: "吉本", publisher: "商务印书馆", isbn: "978-7100023456", desc: "西方史学经典，全面分析了罗马帝国从鼎盛到衰落的过程与原因，影响了后世对古代帝国的研究。" },
        "艺术的故事": { author: "贡布里希", publisher: "广西美术出版社", isbn: "978-7806745532", desc: "艺术史入门经典，以清晰的脉络讲述艺术从原始到现代的发展，帮助读者理解艺术背后的思想与变革。" },
        "机械复制时代的艺术作品": { author: "本雅明", publisher: "浙江摄影出版社", isbn: "978-7805364567", desc: "探讨摄影、电影等复制技术对艺术的影响，提出了 “光晕” 等重要概念，深刻影响了现代艺术理论。" },
        "名画家传": { author: "瓦萨里", publisher: "湖北美术出版社", isbn: "978-7539412345", desc: "西方第一部艺术史著作，记录了文艺复兴时期艺术家的生平与作品，是研究早期艺术的重要文献。" },
        "艺术与错觉": { author: "贡布里希", publisher: "广西美术出版社", isbn: "978-7806745533", desc: "从心理学角度分析艺术创作与感知的关系，探讨艺术家如何利用视觉规律创造出逼真的效果。" },
        "百年孤独": { author: "马尔克斯", publisher: "南海出版公司", isbn: "978-7544253994", desc: "魔幻现实主义文学的代表作，讲述布恩迪亚家族七代人的命运，展现了拉丁美洲的百年沧桑与孤独。" },
        "活着": { author: "余华", publisher: "作家出版社", isbn: "978-7506365437", desc: "以平实的笔触讲述主人公福贵的一生，在苦难中展现生命的韧性与力量，充满对人性与命运的深刻思考。" },
        "红楼梦": { author: "曹雪芹", publisher: "人民文学出版社", isbn: "978-7020002023", desc: "中国古典小说的巅峰之作，以贾府兴衰为背景，描绘了封建社会的人情冷暖与家族命运，细节与思想深度兼具。" },
        "围城": { author: "钱钟书", publisher: "人民文学出版社", isbn: "978-7020019328", desc: "以方鸿渐的人生经历为主线，讽刺了知识分子的虚伪与困境，“围城” 的隐喻成为对婚姻与人生困境的经典概括。" }
    };

    // --- 更新全局图书借阅状态展示 ---
    const updateGlobalBookStatus = () => {
        const bookCards = document.querySelectorAll('.book-card, .book-item');
        bookCards.forEach(card => {
            const title = card.getAttribute('data-title') || card.querySelector('h3').textContent;
            if (BorrowManager.isBorrowed(title)) {
                const statusLabel = card.querySelector('.status');
                if (statusLabel) {
                    statusLabel.textContent = '已借出';
                    statusLabel.className = 'status borrowed';
                }
                // 首页推荐图书没有 .status 标签，可以添加样式或提示
                if (card.classList.contains('book-item')) {
                    card.style.opacity = '0.8';
                }
            } else {
                const statusLabel = card.querySelector('.status');
                if (statusLabel) {
                    statusLabel.textContent = '可借阅';
                    statusLabel.className = 'status available';
                }
                if (card.classList.contains('book-item')) {
                    card.style.opacity = '1';
                }
            }
        });
    };
    updateGlobalBookStatus();

    // --- 4. 图片切换 (Banner Slider) ---
    const initBanner = () => {
        const slides = document.querySelectorAll('.banner-slide');
        const dots = document.querySelectorAll('.banner-nav .dot');
        let currentSlide = 0;
        if (slides.length === 0) return;

        const showSlide = (n) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[n].classList.add('active');
            dots[n].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        let timer = setInterval(nextSlide, 5000);
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(timer);
                currentSlide = index;
                showSlide(index);
                timer = setInterval(nextSlide, 5000);
            });
        });
    };
    initBanner();

    // --- 5. Canvas 图形绘制 (绘制文本) ---
    const initCanvas = () => {
        const canvas = document.getElementById('libraryCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景装饰
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 580, 130);

        // 绘制渐变文字
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(0.5, '#8b7355');
        gradient.addColorStop(1, '#c9a96e');

        ctx.font = 'bold 36px "Noto Serif SC", serif';
        ctx.fillStyle = gradient;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.fillText('博学而笃志，切问而近思', canvas.width / 2, 85);
        
        ctx.font = '16px "Noto Serif SC", serif';
        ctx.fillStyle = '#666';
        ctx.fillText('—— 龚达图书馆，与你一同成长', canvas.width / 2, 120);
    };
    initCanvas();

    // --- 6. 拖放功能 (Drag & Drop) ---
    const initDragDrop = () => {
        const books = document.querySelectorAll('.book-item, .book-card');
        const cartZone = document.getElementById('cartZone');
        const cartItems = document.getElementById('cartItems');
        if (!cartZone || !cartItems) return;

        // 从 localStorage 加载购物车
        const loadCart = () => {
            const savedCart = JSON.parse(localStorage.getItem('library_cart') || '[]');
            cartItems.innerHTML = '';
            if (savedCart.length > 0) {
                document.querySelector('.cart-tip').style.display = 'none';
                savedCart.forEach((title, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>📖 ${title}</span><button class="remove-item" data-index="${index}">×</button>`;
                    cartItems.appendChild(li);
                });
            } else {
                document.querySelector('.cart-tip').style.display = 'block';
            }
        };

        const saveCart = (title) => {
            const savedCart = JSON.parse(localStorage.getItem('library_cart') || '[]');
            savedCart.push(title);
            localStorage.setItem('library_cart', JSON.stringify(savedCart));
            loadCart();
        };

        const removeFromCart = (index) => {
            const savedCart = JSON.parse(localStorage.getItem('library_cart') || '[]');
            savedCart.splice(index, 1);
            localStorage.setItem('library_cart', JSON.stringify(savedCart));
            loadCart();
        };

        loadCart();

        books.forEach(book => {
            book.setAttribute('draggable', 'true');
            book.addEventListener('dragstart', (e) => {
                const title = book.getAttribute('data-title') || book.querySelector('h3').textContent;
                
                // 检查是否已借出
                if (BorrowManager.isBorrowed(title)) {
                    e.preventDefault();
                    alert(`《${title}》已被借出，无法加入购物车。`);
                    return;
                }
                
                e.dataTransfer.setData('text/plain', title);
                book.style.opacity = '0.5';
            });
            book.addEventListener('dragend', () => {
                book.style.opacity = '1';
            });
        });

        cartZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            cartZone.classList.add('drag-over');
        });

        cartZone.addEventListener('dragleave', () => {
            cartZone.classList.remove('drag-over');
        });

        cartZone.addEventListener('drop', (e) => {
            e.preventDefault();
            cartZone.classList.remove('drag-over');
            const bookTitle = e.dataTransfer.getData('text/plain');
            if (bookTitle) {
                saveCart(bookTitle);
            }
        });

        cartItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                removeFromCart(e.target.getAttribute('data-index'));
            }
        });

        // 添加结算按钮
        if (!document.getElementById('checkoutBtn')) {
            const checkoutBtn = document.createElement('button');
            checkoutBtn.id = 'checkoutBtn';
            checkoutBtn.className = 'btn-small';
            checkoutBtn.style.width = '100%';
            checkoutBtn.style.marginTop = '10px';
            checkoutBtn.textContent = '立即借阅';
            checkoutBtn.onclick = () => {
                const username = localStorage.getItem('library_user');
                if (!username) {
                    alert('请先登录后再进行借阅！');
                    window.location.href = 'login.html';
                    return;
                }

                const savedCart = JSON.parse(localStorage.getItem('library_cart') || '[]');
                if (savedCart.length === 0) {
                    alert('购物车是空的！');
                    return;
                }

                let successCount = 0;
                savedCart.forEach(title => {
                    if (BorrowManager.borrow(title)) {
                        successCount++;
                    }
                });

                if (successCount > 0) {
                    alert(`成功借阅 ${successCount} 本书！已同步至您的借阅中心。`);
                    localStorage.removeItem('library_cart');
                    loadCart();
                    updateGlobalBookStatus(); // 更新全局状态显示
                } else {
                    alert('所选书籍均已被借阅，请检查购物车。');
                }
            };
            cartZone.appendChild(checkoutBtn);
        }
    };
    initDragDrop();

    // --- 11. 全局搜索功能 ---
    const initSearch = () => {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        if (!searchInput || !searchBtn) return;

        const performSearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;

            // 搜索逻辑：在 bookData 中查找
            const results = Object.keys(bookData).filter(title => 
                title.toLowerCase().includes(query) || 
                bookData[title].author.toLowerCase().includes(query)
            );

            if (results.length > 0) {
                // 如果只有一个结果，直接跳转到详情页
                if (results.length === 1) {
                    window.location.href = `detail.html?title=${encodeURIComponent(results[0])}`;
                } else {
                    // 多个结果，提示用户（实际开发中应跳转到搜索结果页，这里简化处理）
                    alert(`找到 ${results.length} 本相关书籍：\n${results.join('\n')}\n\n请尝试更精确的搜索。`);
                }
            } else {
                alert('未找到相关书籍，请尝试其他关键词。');
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    };
    initSearch();

    // --- 7. 浮动广告逻辑 ---
    const initFloatAd = () => {
        const floatAd = document.getElementById('floatAd');
        const closeBtn = document.querySelector('.close-ad');
        if (!floatAd) return;

        closeBtn.addEventListener('click', () => {
            floatAd.style.display = 'none';
        });

        // 简单的浮动动画
        let angle = 0;
        setInterval(() => {
            angle += 0.05;
            floatAd.style.transform = `translateY(${Math.sin(angle) * 10}px)`;
        }, 30);
    };
    initFloatAd();

  // --- 8. 表单验证（登录 & 注册 & 联系） ---
// 默认账号列表（以后添加默认账号只需要在这里加，其他地方不用改）
const validUsers = [
    { username: 'admin', password: '123456' },
    { username: 'user', password: '654321' }
];

// 8.1. 标签页切换逻辑
const tabBtns = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.login-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有激活状态
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.style.color = '#666';
            b.style.borderBottom = 'none';
        });
        forms.forEach(f => f.style.display = 'none');

        // 设置当前激活状态
        btn.classList.add('active');
        btn.style.color = '#333';
        btn.style.borderBottom = '2px solid #8B7355';
        const targetTab = btn.dataset.tab;
        document.getElementById(`${targetTab}-form`).style.display = 'block';
    });
});

// 8.2. 登录表单提交（完全复用validUsers数组，同时支持注册用户）
// 8.2. 登录表单提交（完全复用validUsers数组，同时支持注册用户）
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // 基础验证
        if (!username) { alert('请输入用户名！'); return; }

        // 第一步：验证默认账号（validUsers数组）
        let user = validUsers.find(u => u.username === username);
        
        // 第二步：如果不是默认账号，验证本地注册的用户
        if (!user) {
            const registeredUsers = JSON.parse(localStorage.getItem('libraryUsers') || '[]');
            user = registeredUsers.find(u => u.username === username);
        }

        // 验证密码
        if (!user) { alert('用户名不存在！'); return; }
        if (user.password !== password) { alert('密码错误！'); return; }

        // 登录成功：同步设置两个登录状态键（统一状态）
        localStorage.setItem('library_user', username); // 用户名
        localStorage.setItem('isLogin', 'true'); // 登录标记（兼容personal.html）
        alert('登录成功！');
        window.location.href = 'index.html';
    });
}

// 8.3. 注册表单提交
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const repassword = document.getElementById('reg-repassword').value.trim();

        // 基础验证
        if (!username) { alert('请输入用户名！'); return; }
        if (password.length < 6) { alert('密码长度不能少于6位！'); return; }
        if (password !== repassword) { alert('两次输入的密码不一致！'); return; }

        // 检查用户名是否已被使用（默认账号+注册账号）
        const isDefaultUser = validUsers.some(u => u.username === username);
        const registeredUsers = JSON.parse(localStorage.getItem('libraryUsers') || '[]');
        const isRegisteredUser = registeredUsers.some(u => u.username === username);

        if (isDefaultUser || isRegisteredUser) {
            alert('该用户名已被注册，请更换用户名！');
            return;
        }

        // 保存注册用户
        registeredUsers.push({ username, password });
        localStorage.setItem('libraryUsers', JSON.stringify(registeredUsers));
        alert('注册成功！请登录');

        // 自动切换到登录页并清空表单
        tabBtns[0].click();
        registerForm.reset();
    });
}

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的电子邮箱地址！');
                return;
            }
            alert('消息已成功发送！我们会尽快回复您。');
            contactForm.reset();
        });
    }

    // --- 9. 详情页动态数据填充 ---
    const initDetailPage = () => {
        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        if (!title || !bookData[title]) return;

        const book = bookData[title];
        const elements = {
            title: document.getElementById('bookTitle'),
            author: document.getElementById('bookAuthor'),
            publisher: document.getElementById('bookPublisher'),
            isbn: document.getElementById('bookIsbn'),
            desc: document.getElementById('bookDesc'),
            cover: document.querySelector('.book-cover img')
        };

        if (elements.title) elements.title.textContent = title;
        if (elements.author) elements.author.textContent = book.author;
        if (elements.publisher) elements.publisher.textContent = book.publisher;
        if (elements.isbn) elements.isbn.textContent = book.isbn;
        if (elements.desc) elements.desc.textContent = book.desc;
        if (elements.cover) {
            // 处理特殊文件名不匹配的情况
            let fileName = title;
            if (title === "关于两大世界体系的对话") fileName = "关于世界两大体系的对话";
            elements.cover.src = `../images/${fileName}.png`;
            elements.cover.alt = title;
        }
        
        document.title = `${title} - 图书详情`;
    };
    initDetailPage();

    // --- 10. 详情页借阅逻辑 (支持持久化状态) ---
    const initBorrowLogic = () => {
        const borrowButton = document.querySelector('.book-detail .btn');
        if (!borrowButton) return;

        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        
        const updateButtonState = () => {
            if (BorrowManager.isBorrowed(title)) {
                borrowButton.textContent = '该书已借出';
                borrowButton.disabled = true;
                borrowButton.style.opacity = '0.7';
                
                // 如果还没有提示，添加一个
                if (!document.querySelector('.status-notice')) {
                    const infoArea = document.querySelector('.book-info');
                    const statusNotice = document.createElement('p');
                    statusNotice.className = 'status-notice';
                    statusNotice.style.color = '#c62828';
                    statusNotice.style.fontWeight = 'bold';
                    statusNotice.innerHTML = '⚠️ 此图书目前不在馆内，已被您或其他读者借阅。';
                    infoArea.insertBefore(statusNotice, borrowButton);
                }
            } else {
                borrowButton.textContent = '借阅';
                borrowButton.disabled = false;
                borrowButton.style.opacity = '1';
                const notice = document.querySelector('.status-notice');
                if (notice) notice.remove();
            }
        };

        updateButtonState();

        borrowButton.addEventListener('click', () => {
            if (!localStorage.getItem('library_user')) {
                alert('请先登录后再进行借阅！');
                window.location.href = 'login.html';
                return;
            }
            if (BorrowManager.borrow(title)) {
                alert('借阅成功！书籍已加入您的借阅列表。');
                updateButtonState();
                updateGlobalBookStatus(); // 确保全局状态同步
            }
        });
    };
    initBorrowLogic();

    // --- 13. 个人中心逻辑 (profile.html) ---
    const initProfilePage = () => {
        const container = document.getElementById('borrowedListContainer');
        const welcomeUser = document.getElementById('welcomeUser');
        if (!container) return;

        const username = localStorage.getItem('library_user');
        if (!username) {
            window.location.href = 'login.html';
            return;
        }
        if (welcomeUser) welcomeUser.textContent = `${username} 的借阅中心`;

        const renderBorrowedList = () => {
            const borrowedTitles = BorrowManager.getBorrowed();
            if (borrowedTitles.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <p>您目前还没有借阅任何图书</p>
                        <a href="categories.html" class="btn-small">去借阅</a>
                    </div>`;
                return;
            }

            let html = '<ul class="borrowed-list">';
            borrowedTitles.forEach(title => {
                const book = bookData[title] || { author: '未知作者' };
                let fileName = title;
                if (title === "关于两大世界体系的对话") fileName = "关于世界两大体系的对话";
                
                html += `
                    <li class="borrowed-item">
                        <input type="checkbox" class="book-checkbox" data-title="${title}">
                        <img src="../images/${fileName}.png" alt="${title}">
                        <div class="borrowed-info">
                            <h3>${title}</h3>
                            <p>作者：${book.author}</p>
                            <p>借阅时间：2026-05-04</p>
                        </div>
                        <button class="return-btn-small" onclick="handleSingleReturn('${title}')">归还</button>
                    </li>`;
            });
            html += '</ul>';
            container.innerHTML = html;
        };

        // 定义全局函数以便在 HTML 中调用
        window.handleSingleReturn = (title) => {
            if (confirm(`确定要归还《${title}》吗？`)) {
                BorrowManager.returnBook(title);
                renderBorrowedList();
                alert('归还成功！');
            }
        };

        // 全选逻辑
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', () => {
                const checkboxes = document.querySelectorAll('.book-checkbox');
                checkboxes.forEach(cb => cb.checked = selectAll.checked);
            });
        }

        // 批量归还
        const batchBtn = document.getElementById('batchReturnBtn');
        if (batchBtn) {
            batchBtn.addEventListener('click', () => {
                const selected = Array.from(document.querySelectorAll('.book-checkbox:checked'))
                                    .map(cb => cb.getAttribute('data-title'));
                if (selected.length === 0) {
                    alert('请先选择要归还的图书！');
                    return;
                }
                if (confirm(`确定要归还选中的 ${selected.length} 本图书吗？`)) {
                    selected.forEach(title => BorrowManager.returnBook(title));
                    renderBorrowedList();
                    alert('归还成功！');
                }
            });
        }

        // 全部归还
        const returnAllBtn = document.getElementById('returnAllBtn');
        if (returnAllBtn) {
            returnAllBtn.addEventListener('click', () => {
                const borrowed = BorrowManager.getBorrowed();
                if (borrowed.length === 0) return;
                if (confirm('确定要归还所有借阅的图书吗？')) {
                    BorrowManager.returnAll();
                    renderBorrowedList();
                    alert('所有图书已成功归还！');
                }
            });
        }

        renderBorrowedList();
    };
    initProfilePage();

    // --- 12. 分页逻辑 ---
    const initPagination = () => {
        const prevBtn = document.querySelector('.pagination .btn-small:first-child');
        const nextBtn = document.querySelector('.pagination .btn-small:last-child');
        const pageNum = document.querySelector('.pagination .page-num');
        if (!prevBtn || !nextBtn || !pageNum) return;

        let currentPage = 1;
        const totalPages = 1; // 目前只有一页数据

        pageNum.textContent = `${currentPage} / ${totalPages}`;

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                pageNum.textContent = `${currentPage} / ${totalPages}`;
                alert(`已切换至第 ${currentPage} 页`);
            } else {
                alert('已经是第一页了');
            }
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                pageNum.textContent = `${currentPage} / ${totalPages}`;
                alert(`已切换至第 ${currentPage} 页`);
            } else {
                alert('已经是最后一页了');
            }
        });
    };
    initPagination();
});