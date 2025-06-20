// 缓存容器元素，避免重复查找
const toastContainer = document.getElementById('toastContainer') || (() => {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:1000;';
    document.body.appendChild(container);
    return container;
})();

// 使用事件委托处理关闭操作
toastContainer.addEventListener('click', (e) => {
    const toast = e.target.closest('.toast');
    const closeBtn = e.target.closest('.toast-close');

    if (closeBtn && toast) {
        removeToast(toast);
    } else if (toast && e.target === toast) {
        removeToast(toast);
    }
});

function ShowToast(message, type = 'success', duration = 3000) {
    // 创建弹窗元素
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // 使用文本节点避免XSS风险
    const messageNode = document.createTextNode(message);
    toast.appendChild(messageNode);

    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.className = 'toast-close';
    closeBtn.textContent = '×';
    toast.appendChild(closeBtn);

    // 添加进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';
    progressBar.style.animationDuration = `${duration / 1000}s`;
    toast.appendChild(progressBar);

    // 添加到容器
    toastContainer.appendChild(toast);

    // 使用requestAnimationFrame优化动画触发
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });

    // 自动移除
    const removeTimer = setTimeout(() => removeToast(toast), duration);

    // 存储timer以便提前清除
    toast._removeTimer = removeTimer;
}

// 提取移除操作为独立函数
function removeToast(toast) {
    if (toast._removeTimer) {
        clearTimeout(toast._removeTimer);
        delete toast._removeTimer;
    }

    toast.classList.remove('show');

    // 使用transitionend事件避免固定延迟
    const onTransitionEnd = () => {
        toast.removeEventListener('transitionend', onTransitionEnd);
        toast.remove();
    };

    toast.addEventListener('transitionend', onTransitionEnd);

    // 兜底：如果transitionend未触发，500ms后强制移除
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.remove();
        }
    }, 500);
}

function GetCurrentTime() {
    const time = performance.now();  // 返回自页面加载以来的毫秒数（浮点数）
    const milliseconds = Math.floor(time % 1000);

    return milliseconds;//GetgetMilliseconds
}