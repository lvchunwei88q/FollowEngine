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