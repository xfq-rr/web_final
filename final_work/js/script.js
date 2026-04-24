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

    // --- 3. 用户状态显示 (localStorage) ---
    const checkUserStatus = () => {
        const username = localStorage.getItem('library_user');
        const userDisplay = document.getElementById('userDisplay');
        const loginLink = document.getElementById('loginLink');
        if (username && userDisplay && loginLink) {
            userDisplay.textContent = `欢迎, ${username}`;
            userDisplay.style.display = 'block';
            loginLink.textContent = '退出';
            loginLink.href = '#';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('library_user');
                location.reload();
            });
        }
    };
    checkUserStatus();

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
        const books = document.querySelectorAll('.book-item');
        const cartZone = document.getElementById('cartZone');
        const cartItems = document.getElementById('cartItems');
        if (!cartZone || !cartItems) return;

        books.forEach(book => {
            book.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', book.getAttribute('data-title'));
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
                const li = document.createElement('li');
                li.textContent = `📖 ${bookTitle}`;
                cartItems.appendChild(li);
                // 动画提示
                li.style.animation = 'fadeInUp 0.3s forwards';
                document.querySelector('.cart-tip').style.display = 'none';
            }
        });
    };
    initDragDrop();

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

    // --- 8. 表单验证 (登录 & 联系) ---
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        const validUsers = [
            { username: 'admin', password: '123456' },
            { username: 'user', password: '654321' }
        ];
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginForm.querySelector('#username').value.trim();
            const password = loginForm.querySelector('#password').value;
            if (!username) { alert('请输入用户名！'); return; }
            const user = validUsers.find(u => u.username === username);
            if (!user) { alert('用户名不存在！'); return; }
            if (user.password !== password) { alert('密码错误！'); return; }
            
            localStorage.setItem('library_user', username);
            alert('登录成功！');
            window.location.href = 'index.html';
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

        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        if (!title || !bookData[title]) return;

        const book = bookData[title];
        const elements = {
            title: document.getElementById('bookTitle'),
            author: document.getElementById('bookAuthor'),
            publisher: document.getElementById('bookPublisher'),
            isbn: document.getElementById('bookIsbn'),
            desc: document.getElementById('bookDesc')
        };

        if (elements.title) elements.title.textContent = title;
        if (elements.author) elements.author.textContent = book.author;
        if (elements.publisher) elements.publisher.textContent = book.publisher;
        if (elements.isbn) elements.isbn.textContent = book.isbn;
        if (elements.desc) elements.desc.textContent = book.desc;
        
        document.title = `${title} - 图书详情`;
    };
    initDetailPage();

    // --- 10. 详情页借阅逻辑 (智能判断已借出状态) ---
    const initBorrowLogic = () => {
        const borrowButton = document.querySelector('.book-detail .btn');
        if (!borrowButton) return;

        // 从 URL 获取状态参数
        const urlParams = new URLSearchParams(window.location.search);
        const isBorrowed = urlParams.get('status') === 'borrowed';

        if (isBorrowed) {
            borrowButton.textContent = '该书已借出';
            borrowButton.disabled = true;
            borrowButton.style.opacity = '0.7';
            
            // 添加一个状态说明
            const infoArea = document.querySelector('.book-info');
            const statusNotice = document.createElement('p');
            statusNotice.style.color = '#c62828';
            statusNotice.style.fontWeight = 'bold';
            statusNotice.innerHTML = '⚠️ 此图书目前不在馆内，预计归还时间：2026-05-15';
            infoArea.insertBefore(statusNotice, borrowButton);
        } else {
            borrowButton.addEventListener('click', () => {
                alert('借阅成功！书籍已加入您的借阅列表。');
                // 模拟状态改变
                borrowButton.textContent = '已成功借阅';
                borrowButton.disabled = true;
            });
        }
    };
    initBorrowLogic();
});