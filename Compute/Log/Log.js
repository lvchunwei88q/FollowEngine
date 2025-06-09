function ShowToast(message, type = 'success', duration = 3000) {
    // 创建弹窗元素
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // 添加内容
    toast.innerHTML = `
	                ${message}
	                <span class="toast-close" onclick="this.parentElement.remove()">×</span>
	                <div class="toast-progress" style="animation-duration: ${duration/1000}s"></div>
	            `;

    // 添加到容器
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);

    // 触发动画
    setTimeout(() => toast.classList.add('show'), 10);

    // 自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300); // 等待过渡动画完成
    }, duration);

    // 点击弹窗快速关闭
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

function GetCurrentTime(){
    const time = performance.now();  // 返回自页面加载以来的毫秒数（浮点数）
    const milliseconds = Math.floor(time % 1000);
    
    return milliseconds;//GetgetMilliseconds
}