function isDecimal(num) { //判断是否为小数
    return String(num).includes('.');
}

function truncateNumber(num) { //取整
    return Math.trunc(num);
}

function TruncateNumber4fo5(num) {
    return Math.round(num);
}

function CoordinateSystem2D(H, W, PH, PW) { //计算二D
    let bOne = false,
        bTwo = false;
    for (let i = 0; i < H; i++) {
        if (i === PH) {
            bOne = true;
            for (let j = 0; j < W; j++) {
                if (j === PW) { //说明这就是对应位置
                    bTwo = true;
                    let Base_p = (i - 1) * W; //这里计算除找打那一行之外的所有行
                    Base_p += j;
                    return Base_p; //这就是位置
                }
            }
        }
    }

    if (bOne === false || bTwo === false) {
        return null; //表示没有找到
    }
}

/**
 * 将二维坐标转换为一维索引
 * @param {number} totalRows - 总行数
 * @param {number} totalCols - 总列数
 * @param {number} row - 行索引 (从0开始)
 * @param {number} col - 列索引 (从0开始)
 * @returns {number|null} 一维索引，无效坐标返回null
 */

function CoordinateSystem2D_S(totalRows, totalCols, row, col) {
    // 验证输入是否为有效数字
    if (typeof totalRows !== 'number' || typeof totalCols !== 'number' ||
        typeof row !== 'number' || typeof col !== 'number') {
        return null;
    }

    // 检查坐标是否在有效范围内
    if (row < 0 || row >= totalRows || col < 0 || col >= totalCols) {
        return null;
    }

    // 计算一维索引
    return row * totalCols + col;
}

// 生成从minNum到maxNum的随机整数
function RandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Bresenham直线算法
function BresenHamLine(x0, y0, x1, y1) {
    const points = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        points.push({
            x: x0,
            y: y0
        });

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }

    return points;
}

function GetTheObjectID(InputClassName) {
    return num = +InputClassName.slice(InputClassName.lastIndexOf('_') + 1); // 9148
}

// 填充算法-这是基于递归的算法填充
function FloodFill(startX, startY, ObjectRandomNumbers, GetBScreenViewHigh, GetBScreenViewWidth, GetquerySelectorAll) {
    let Direction = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1]
    ]
    for (let i = 0; i < 4; i++) {
        let GetQuerySelectorAllClassName = GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh, GetBScreenViewWidth, startX + Direction[i][0], startY + Direction[i][1]) - 1];

        let FstartX = startX + Direction[i][0];
        let FstartY = startY + Direction[i][1];

        if (GetTheObjectID(GetQuerySelectorAllClassName.className) !== ObjectRandomNumbers) {
            GetQuerySelectorAllClassName.style.background = "#ffffff";
            GetQuerySelectorAllClassName.classList.add(`ObjectID_${ObjectRandomNumbers}`);
            FloodFill(FstartX, FstartY, ObjectRandomNumbers, GetBScreenViewHigh, GetBScreenViewWidth, GetquerySelectorAll);
        }
    }
}

// 填充算法
function FloodFill_For(startX, startY, ObjectRandomNumbers, GetBScreenViewHigh, GetBScreenViewWidth, GetquerySelectorAll) {
    let Direction = [
        [0, 1],  // 右
        [1, 0],  // 下
        [-1, 0], // 左
        [0, -1]  // 上
    ];

    // 使用栈替代递归
    let stack = [];

    // 初始点入栈
    for (let i = 0; i < 4; i++) {
        let FstartX = startX + Direction[i][0];
        let FstartY = startY + Direction[i][1];
        stack.push({x: FstartX, y: FstartY});
    }

    while (stack.length > 0) {
        let current = stack.pop();
        let currentX = current.x;
        let currentY = current.y;

        let index = CoordinateSystem2D_S(GetBScreenViewHigh, GetBScreenViewWidth, currentX, currentY) - 1;

        // 检查索引是否有效
        if (index < 0 || index >= GetquerySelectorAll.length) {
            continue;
        }

        let element = GetquerySelectorAll[index];

        // 检查是否需要处理
        if (GetTheObjectID(element.className) === ObjectRandomNumbers) {
            //element.style.background = "#ffffff";//这里需要涂成白色
            continue;
        }

        // 处理当前元素
        element.style.background = "#ffffff";
        element.classList.add(`ObjectID_${ObjectRandomNumbers}`);

        // 将邻居入栈
        for (let i = 0; i < 4; i++) {
            let neighborX = currentX + Direction[i][0];
            let neighborY = currentY + Direction[i][1];
            stack.push({x: neighborX, y: neighborY});
        }
    }
}

//对于任意两点，计算其十字射线的交点
function GetCrossIntersections(p1, p2) {
    return [
        [p1[0], p2[1]], // p1垂直线与p2水平线交点
        [p2[0], p1[1]] // p1水平线与p2垂直线交点
    ].filter(([x, y], i, arr) =>
        // 去重：只有当两个交点不同时才都保留
        i === 0 || (x !== arr[0][0] || y !== arr[0][1])
    );
}

function SecondtoMillisecond(x){
    return x * 1000.0;
}

function MillisecondtoSecond(x){
    if (x !== 0)
    return x / 1000.0;
    else {
        console.warn("MillisecondIs:0!");
        return x;
    }
}

let Timingbuffer = null;

function TimingBuffer(Time) {
    // 初始化状态
    if(localStorage.getItem("TimingBuffer") === null) {
        localStorage.setItem("TimingBuffer", JSON.stringify(true));
    }

    // 清除已有定时器避免重复
    if(Timingbuffer) clearTimeout(Timingbuffer);

    if (JSON.parse(localStorage.getItem("TimingBuffer"))) {
        localStorage.setItem("TimingBuffer", JSON.stringify(false));
        Timingbuffer = setTimeout(() => {
            localStorage.setItem("TimingBuffer", JSON.stringify(true));
            Timingbuffer = null; // 清除引用
        }, Math.max(Time, 4)); // 确保不低于4ms
    }
}