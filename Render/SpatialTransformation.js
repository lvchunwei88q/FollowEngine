/* 加入模型以及旋转 */
function Space2D(data,GetquerySelectorAll){
    const OPostion = 30;
    
    //这里需要注意Moudel的顶点位置需要对应绘制顺序
    
    //这里我们需要模糊判断坐标点的位置
    if (GetquerySelectorAll[1] !== undefined){
        let GetBScreenViewHigh = JSON.parse(localStorage.getItem("ScreenViewHighPixel"));
        let GetBScreenViewWidth = JSON.parse(localStorage.getItem("ScreenViewWidthPixel"));
        
        let GetDataLength = data.length,ObjectPostion = [];
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

            ObjectPostion.push({
                "X": X,
                "Y": Y,
            })

            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,Y,X);

            GetquerySelectorAll[Postion-1].style.background = "#ffffff";
        });

        ConnectVertices(GetDataLength,ObjectPostion,GetBScreenViewHigh,GetBScreenViewWidth);
 
    }
}

function RotationCalculations(){//旋转计算
    
}

function ConnectVertices(GetDataLength,ObjectPostion,GetBScreenViewHigh,GetBScreenViewWidth){
    for (let i=0;i<GetDataLength;i++){//顶点数量
        let SX,SY,EX,EY;

        SX = ObjectPostion[i].X;
        SY = ObjectPostion[i].Y;
        if (i+1 >= GetDataLength){
            EX = ObjectPostion[0].X;
            EY = ObjectPostion[0].Y;
        }
        else{
            EX = ObjectPostion[i+1].X;
            EY = ObjectPostion[i+1].Y;
        }


        let BresenHamLinePostion = BresenHamLine(SX,SY,EX,EY);

        BresenHamLinePostion.forEach((item)=>{
            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,item.y,item.x);
            GetquerySelectorAll[Postion-1].style.background = "#ffffff";
        });
    }
}