function ReadJSON_Editor(URL) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `../Content/${URL}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    let data = JSON.parse(xhr.responseText);
                    localStorage.setItem("data", JSON.stringify(data));
                    resolve(data);
                } catch (e) {
                    reject(new Error("JSON解析失败"));
                }
            } else {
                reject(new Error(`HTTP错误: ${xhr.status}`));
            }
        };
        xhr.onerror = () => reject(new Error("网络错误"));
        xhr.send();
    });
}

function ReadJSON_User(URL) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", URL, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    let data = JSON.parse(xhr.responseText);
                    localStorage.setItem("data", JSON.stringify(data));
                    resolve(data);
                } catch (e) {
                    reject(new Error("JSON解析失败"));
                }
            } else {
                reject(new Error(`HTTP错误: ${xhr.status}`));
            }
        };
        xhr.onerror = () => reject(new Error("网络错误"));
        xhr.send();
    });
}

/**
 * 将JSON数据保存为文件并下载
 * @param {object} data - 要保存的JSON数据
 * @param {string} filename - 建议的文件名（如：'data.json'）
 * @param {boolean} [prettyPrint=false] - 是否格式化JSON
 */
function DownloadJson(data, filename, prettyPrint = false) {
    // 转换为JSON字符串
    const jsonString = prettyPrint
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);

    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'data.json';

    // 触发点击下载
    document.body.appendChild(a);
    a.click();

    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}