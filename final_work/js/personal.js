// 退出登录
function logout() {
    localStorage.removeItem('library_user');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('user_avatar');
    window.location.href = 'login.html';
}

// 初始化用户信息
function initUserInfo() {
    const username = localStorage.getItem('library_user');
    if (username) {
        document.getElementById('userNick').textContent = username;
        document.getElementById('headerUsername').textContent = username;
    }

    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
        document.getElementById('userAvatar').src = savedAvatar;
    }
}

// 编辑昵称
function editNick() {
    const nickSpan = document.getElementById('userNick');
    const oldNick = nickSpan.textContent;
    const newNick = prompt('请输入新昵称：', oldNick);
    if (newNick && newNick.trim() !== '') {
        localStorage.setItem('library_user', newNick.trim());
        nickSpan.textContent = newNick.trim();
        document.getElementById('headerUsername').textContent = newNick.trim();
        alert('昵称修改成功！');
    }
}

// 更换头像
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('userAvatar').src = event.target.result;
            localStorage.setItem('user_avatar', event.target.result);
            alert('头像更换成功！');
        };
        reader.readAsDataURL(file);
    }
});

// 渲染当前借阅
function renderCurrentBorrow() {
    const borrowed = JSON.parse(localStorage.getItem('borrowed_books') || '[]');
    document.getElementById('borrowCount').textContent = borrowed.length;

    const listEl = document.getElementById('currentBorrowList');
    if (borrowed.length === 0) {
        listEl.innerHTML = '<div class="empty-tip">您目前还没有借阅任何图书</div>';
        return;
    }

    let html = '<div class="book-list">';
    borrowed.forEach(title => {
        let fileName = title;
        if (title === "关于两大世界体系的对话") fileName = "关于世界两大体系的对话";
        html += `
            <div class="book-item">
                <img src="../images/${fileName}.png" alt="${title}">
                <p>${title}</p>
                <p style="font-size:13px; color:#666;">借阅时间：2026-05-04</p>
                <p style="font-size:13px; color:#666;">归还状态：未归还</p>
            </div>
        `;
    });
    html += '</div>';
    listEl.innerHTML = html;
}

// 渲染借阅记录
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('borrow_history') || '[]');
    const listEl = document.getElementById('historyList');

    if (history.length === 0) {
        listEl.innerHTML = '<div class="empty-tip">暂无借阅记录</div>';
        return;
    }

    history.sort((a, b) => new Date(b.borrowTime) - new Date(a.borrowTime));
    let html = '<div class="history-list">';
    history.forEach(item => {
        const status = item.returnTime 
            ? `<span class="status-returned">已归还（归还时间：${item.returnTime}）</span>` 
            : `<span class="status-borrowing">借阅中</span>`;
        html += `
            <div class="history-item">
                <span>《${item.title}》（借阅时间：${item.borrowTime}）</span>
                ${status}
            </div>
        `;
    });
    html += '</div>';
    listEl.innerHTML = html;
}

// 页面加载完成后执行
window.onload = function() {
    initUserInfo();
    renderCurrentBorrow();
    renderHistory();
};