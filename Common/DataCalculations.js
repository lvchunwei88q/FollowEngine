function isDecimal(num) {//判断是否为小数
    return String(num).includes('.');
}

function truncateNumber(num) {//取整
    return Math.trunc(num);
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
        return null;//表示没有找打
    }
}