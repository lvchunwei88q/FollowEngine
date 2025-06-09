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