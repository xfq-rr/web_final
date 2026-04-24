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

    // --- 9. 详情页借阅逻辑 (智能判断已借出状态) ---
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