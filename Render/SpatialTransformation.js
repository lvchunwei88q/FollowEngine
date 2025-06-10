/* 加入模型以及旋转 */
function Space2D(data,GetquerySelectorAll){
    const OPostion = 30;
    
    //这里我们需要模糊判断坐标点的位置
    if (GetquerySelectorAll[1] !== undefined){
        let GetDataLength = data.length;
        data.forEach((item)=>{
            //这里对应了每个顶点中的XY
            let X = item[0];
            let Y = item[1];

            X /= 5;//缩小5倍
            Y /= 5;//缩小5倍

            X += OPostion;
            Y += OPostion;

            X = TruncateNumber4fo5(X);//四舍五入
            Y = TruncateNumber4fo5(Y);//四舍五入

            let GetBScreenViewHigh = JSON.parse(localStorage.getItem("ScreenViewHighPixel"));
            let GetBScreenViewWidth = JSON.parse(localStorage.getItem("ScreenViewWidthPixel"));

            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,Y,X);

            GetquerySelectorAll[Postion-1].style.background = "#ffffff";
        });
    }
}

function RotationCalculations(){//旋转计算
    
}