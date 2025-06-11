function isDecimal(num) {//判断是否为小数
    return String(num).includes('.');
}

function truncateNumber(num) {//取整
    return Math.trunc(num);
}

function TruncateNumber4fo5(num){
    return Math.round(num);
}

function CoordinateSystem2D(H,W,PH,PW){//计算二D
    let bOne = false,bTwo = false;
    for (let i=0;i < H;i++){
        if(i === PH){
            bOne = true;
            for (let j=0;j < W;j++){
                if(j === PW){//说明这就是对应位置
                    bTwo = true;
                    let Base_p = (i - 1) * W;//这里计算除找打那一行之外的所有行
                    Base_p += j;
                    return Base_p;//这就是位置
                }
            }
        }
    }
    
    if(bOne ===  false || bTwo ===  false){
        return null;//表示没有找到
    }
}

function CoordinateSystem2D_S(H, W, PH, PW) {
    if (PH < 1 || PH >= H || PW < 0 || PW >= W) {
        return null;  // PH必须≥1
    }
    return (PH - 1) * W + PW;
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
        points.push({x: x0, y: y0});

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

function GetTheObjectID(InputClassName){
    return num = +InputClassName.slice(InputClassName.lastIndexOf('_') + 1); // 9148
}

// 填充算法
function FloodFill(startX, startY,ObjectRandomNumbers,GetBScreenViewHigh,GetBScreenViewWidth,GetquerySelectorAll) {
    let sss = true;
    for (let i=0; i < 4; i++) {
        switch (i){
            case 0:
                if (GetTheObjectID(GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY+1,startX)-1].className) !== ObjectRandomNumbers){
                    sss = false;
                    startY += 1;
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY+1,startX)-1].style.background = "#ffffff";
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX-1)-1].classList.add(`.ObjectID_${ObjectRandomNumbers}`);
                }
                break;
            case 1:
                if (GetTheObjectID(GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY-1,startX)-1].className) !== ObjectRandomNumbers){
                    sss = false;
                    startY -= 1;
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY-1,startX)-1].style.background = "#ffffff";
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX-1)-1].classList.add(`.ObjectID_${ObjectRandomNumbers}`);
                }
                break;
            case 2:
                if (GetTheObjectID(GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX+1)-1].className) !== ObjectRandomNumbers){
                    sss = false;
                    startX += 1;
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX+1)-1].style.background = "#ffffff";
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX-1)-1].classList.add(`.ObjectID_${ObjectRandomNumbers}`);
                }
                break;
            case 3:
                if (GetTheObjectID(GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX-1)-1].className) !== ObjectRandomNumbers){
                    sss = false;
                    startX -= 1;
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX-1)-1].style.background = "#ffffff";
                    GetquerySelectorAll[CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,startY,startX-1)-1].classList.add(`.ObjectID_${ObjectRandomNumbers}`);
                }
                break;
        }
    }
    
    if (!sss){
        FloodFill(startX, startY,ObjectRandomNumbers,GetBScreenViewHigh,GetBScreenViewWidth);
    }
}

//对于任意两点，计算其十字射线的交点
function GetCrossIntersections(p1, p2) {
    return [
        [p1[0], p2[1]], // p1垂直线与p2水平线交点
        [p2[0], p1[1]]  // p1水平线与p2垂直线交点
    ].filter(([x, y], i, arr) =>
        // 去重：只有当两个交点不同时才都保留
        i === 0 || (x !== arr[0][0] || y !== arr[0][1])
    );
}
