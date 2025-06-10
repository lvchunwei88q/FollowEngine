/* 加入模型以及旋转 */
function Space2D(data,GetquerySelectorAll){
    //const OPostion = [];//偏移位置
    //这里需要注意Moudel的顶点位置需要对应绘制顺序
    
    //这里我们需要模糊判断坐标点的位置
    if (GetquerySelectorAll[1] !== undefined){
        let BObjectLoad = [],StopSpace2D = false,ObjectRandomNumbers = 0,AddObjectaddEventListener = false;
        BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));

        if (BObjectLoad !== null && BObjectLoad !== []) {
            for (let i = 0; i < BObjectLoad.length; i++) {
                let element = BObjectLoad[i];
                if (element.id === data[data.length-1].Id){
                    StopSpace2D = true;
                }
            }
            if (!StopSpace2D){//这里记录了没有加载的模型
                let ObjectID;
                while (true){
                    let Stopwhile = true;
                    ObjectID = RandomNum(0,100000)//为每个模型生成单独的随机数
                    BObjectLoad.forEach((obj)=>{
                        if (obj.ObjectID === ObjectID)
                            Stopwhile = false;
                    });
                    if (Stopwhile)break;
                }

                BObjectLoad.push({
                    "id" : data[data.length-1].Id,
                    "MoudelPostion":{
                        "X":30,//这是新模型的固定位置
                        "Y":30,
                    },
                    "ObjectID":ObjectID
                });
                ObjectRandomNumbers = ObjectID;
                localStorage.setItem("EditorMoudelsLoad", JSON.stringify(BObjectLoad));
                AddObjectaddEventListener = true;//开启添加绑定事件通道
            }
        }else{
            BObjectLoad = [];
            let ObjectID = RandomNum(0,100000)//为每个模型生成单独的随机数
            BObjectLoad.push({
                "Moudelid" : data[data.length-1].Id,
                "MoudelPostion":{
                    "X":30,
                    "Y":30,
                },
                "ObjectID":ObjectID
            });
            localStorage.setItem("EditorMoudelsLoad", JSON.stringify(BObjectLoad));
            ObjectRandomNumbers = ObjectID;
            AddObjectaddEventListener = true;//开启添加绑定事件通道
        }
        
        let GetBScreenViewHigh = JSON.parse(localStorage.getItem("ScreenViewHighPixel"));
        let GetBScreenViewWidth = JSON.parse(localStorage.getItem("ScreenViewWidthPixel"));
        
        let GetDataLength = data.length-1,ObjectPostion = [];
        for (let i=0; i< GetDataLength; i++){
            let item = data[i];
            //这里对应了每个顶点中的XY
            let X = item[0];
            let Y = item[1];

            X /= 5;//缩小5倍
            Y /= 5;//缩小5倍

            X += BObjectLoad[0].MoudelPostion.X;
            Y += BObjectLoad[0].MoudelPostion.Y;

            X = TruncateNumber4fo5(X);//四舍五入
            Y = TruncateNumber4fo5(Y);//四舍五入

            ObjectPostion.push({
                "X": X,
                "Y": Y,
            });

            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,Y,X);

            GetquerySelectorAll[Postion-1].style.background = "#ffffff";
            GetquerySelectorAll[Postion-1].classList.add(`ObjectID_${ObjectRandomNumbers}`);
        }
        
        ConnectVertices(GetquerySelectorAll,GetDataLength,ObjectPostion,GetBScreenViewHigh,GetBScreenViewWidth,ObjectRandomNumbers
        ,AddObjectaddEventListener);
 
    }
}

function RotationCalculations(){//旋转计算
    
}

let addEventListenerIndex = true;

function ConnectVertices(GetquerySelectorAll,GetDataLength,ObjectPostion,GetBScreenViewHigh,GetBScreenViewWidth,ObjectRandomNumbers
,AddObjectaddEventListener){
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
            GetquerySelectorAll[Postion-1].classList.add(`ObjectID_${ObjectRandomNumbers}`);
        });
    }
    if(AddObjectaddEventListener && addEventListenerIndex){
        addEventListenerIndex = false;
        document.querySelectorAll(`.ObjectID_${ObjectRandomNumbers}`).forEach((item)=>{
            item.addEventListener('click', ()=>{
                //这里写绑定之类的操作
            });
        })
    }else{
        addEventListenerIndex = true;
    }
}