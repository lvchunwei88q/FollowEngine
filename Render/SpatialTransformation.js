/* 加入模型以及旋转 */
function Space2D(data,GetquerySelectorAll,F_PrintAndWriteTheObjectID,MoudelIndex,MoudelIndexall){
    //const OPostion = [];//偏移位置
    //这里需要注意Moudel的顶点位置需要对应绘制顺序
    
    //这里我们需要模糊判断坐标点的位置
    if (GetquerySelectorAll[1] !== undefined){
        let BObjectLoad = [],StopSpace2D = false,ObjectRandomNumbers = 0,AddObjectaddEventListener = false,
            ObjectIndex = 0;
        BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));

        if (BObjectLoad !== null && BObjectLoad !== []) {
            //默认以第一个顶点位置为模型的判断点-》所以模型不能重合！！！
            if (BObjectLoad.length === MoudelIndexall){
                StopSpace2D = true;
            }
                
            if (!StopSpace2D){//这里记录了没有加载的模型
                let ObjectID;
                while (true){
                    let Stopwhile = true;
                    ObjectID = RandomNum(1,100000)//为每个模型生成单独的随机数
                    BObjectLoad.forEach((obj)=>{
                        if (obj.ObjectID === ObjectID)
                            Stopwhile = false;
                    });
                    if (Stopwhile)break;
                }

                BObjectLoad.push({
                    "id" : data[data.length-1].Id,
                    "MoudelPostion":{
                        "X":60,//这是新模型的固定位置
                        "Y":60,
                    },
                    "ObjectID":ObjectID
                });
                ObjectRandomNumbers = ObjectID;
                localStorage.setItem("EditorMoudelsLoad", JSON.stringify(BObjectLoad));
                AddObjectaddEventListener = true;//开启添加绑定事件通道
                if (F_PrintAndWriteTheObjectID)
                    console.log("已生成ObjectID随机数:"+ObjectRandomNumbers);
            }
        }else{
            BObjectLoad = [];
            let ObjectID = RandomNum(1,100000)//为每个模型生成单独的随机数
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
            
            if (F_PrintAndWriteTheObjectID)
                console.log("已生成ObjectID随机数:"+ObjectRandomNumbers);
        }
        
        ObjectIndex = MoudelIndex-1;
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

            X += BObjectLoad[ObjectIndex].MoudelPostion.X;
            Y += BObjectLoad[ObjectIndex].MoudelPostion.Y;

            X = TruncateNumber4fo5(X);//四舍五入
            Y = TruncateNumber4fo5(Y);//四舍五入

            ObjectPostion.push({
                "X": X,
                "Y": Y,
            });

            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh,GetBScreenViewWidth,Y,X);
            
            if(Postion <= (GetBScreenViewHigh * GetBScreenViewWidth) && Postion !== null){
                GetquerySelectorAll[Postion-1].style.background = "#ffffff";
                if (ObjectRandomNumbers !== 0)
                    GetquerySelectorAll[Postion-1].classList.add(`ObjectID_${ObjectRandomNumbers}`);
                //else console.error("Error!ObjectRandomNumbers = 0");
            }
        }
        
        ConnectVertices(GetquerySelectorAll,GetDataLength,ObjectPostion,GetBScreenViewHigh,GetBScreenViewWidth,ObjectRandomNumbers
        ,AddObjectaddEventListener,F_PrintAndWriteTheObjectID);
 
    }
}

function RotationCalculations(){//旋转计算
    
}

function ConnectVertices(GetquerySelectorAll,GetDataLength,ObjectPostion,GetBScreenViewHigh,GetBScreenViewWidth,ObjectRandomNumbers
,AddObjectaddEventListener,F_PrintAndWriteTheObjectID){
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
            if(Postion <= (GetBScreenViewHigh * GetBScreenViewWidth) && Postion !== null){
                GetquerySelectorAll[Postion-1].style.background = "#ffffff";
                if (ObjectRandomNumbers !== 0)
                    GetquerySelectorAll[Postion-1].classList.add(`ObjectID_${ObjectRandomNumbers}`);
            }
        });
    }
    //ModelFilling(GetquerySelectorAll,`ObjectID_${ObjectRandomNumbers}`,GetBScreenViewWidth);
    
    if(AddObjectaddEventListener){
        if (F_PrintAndWriteTheObjectID)
        {
            console.log("绑定:"+`ObjectID_${ObjectRandomNumbers}`);
        }
        document.querySelectorAll(`.ObjectID_${ObjectRandomNumbers}`).forEach((item)=>{
            item.addEventListener('click', ()=>{
                //这里写绑定之类的操作
                ObjectClassName = item.className;
                console.log("已经选择:"+ObjectClassName);

                let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
                let GetObjectID = GetTheObjectID(ObjectClassName);//赋值给InputY，X

                for (let i = 1; i <= BObjectLoad.length; i++){
                    if (BObjectLoad[i - 1].ObjectID === GetObjectID){
                        document.getElementById("InputY").value = BObjectLoad[i-1].MoudelPostion.Y;
                        document.getElementById("InputX").value = BObjectLoad[i-1].MoudelPostion.X;
                    }
                }
            });
        });
    }
}

function ModelFilling(GetquerySelectorAll,ClassName,GetBScreenViewWidth){
    let OO = false,GetquerySelectorAllIDIndex = 0;
    
    for (let i = 0; i < GetquerySelectorAll.length; i++){
        let GetquerySelectorAllID =  GetTheObjectID(GetquerySelectorAll[i].className);
        let Classname =  GetTheObjectID(ClassName);
        if (GetquerySelectorAllID === Classname){
            if (OO){
                GetquerySelectorAllIDIndex = i - 1;
                GetquerySelectorAllIDIndex += GetBScreenViewWidth;
            }
            OO = true;
        }
        
    }
}