/* 加入模型以及旋转 */

function Space2D_User(data, GetquerySelectorAll, F_PrintAndWriteTheObjectID, MoudelIndex, MoudelIndexall,
                      E_bRenderPaddingBate){
    
    Space2D(data, GetquerySelectorAll, F_PrintAndWriteTheObjectID, MoudelIndex, MoudelIndexall,
                     E_bRenderPaddingBate);
}

function Space2D(data, GetquerySelectorAll, F_PrintAndWriteTheObjectID, MoudelIndex, MoudelIndexall,
                 E_bRenderPaddingBate) {
    //const OPostion = [];//偏移位置
    //这里需要注意Moudel的顶点位置需要对应绘制顺序

    //这里我们需要模糊判断坐标点的位置
    if (GetquerySelectorAll[1] !== undefined) {
        let BObjectLoad = [], StopSpace2D = false, ObjectRandomNumbers = 0, AddObjectaddEventListener = false,
            ObjectIndex = 0, ObjectIDs = [];
        BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
        if (JSON.parse(localStorage.getItem("ObjectID")) === null) {
            let data = []
            localStorage.setItem("ObjectID", JSON.stringify(data));
        }

        if (BObjectLoad !== null && BObjectLoad !== []) {
            //默认以第一个顶点位置为模型的判断点-》所以模型不能重合！！！
            if (BObjectLoad.length === MoudelIndexall) {
                StopSpace2D = true;
            }

            ObjectIDs = JSON.parse(localStorage.getItem("ObjectID"));

            if (!StopSpace2D) {//这里记录了没有加载的模型
                let ObjectID;
                while (true) {
                    let Stopwhile = true;
                    ObjectID = RandomNum(1, 100000)//为每个模型生成单独的随机数
                    BObjectLoad.forEach((obj) => {
                        if (obj.ObjectID === ObjectID)
                            Stopwhile = false;
                    });
                    if (Stopwhile) break;
                }

                BObjectLoad.push({
                    "id": data[data.length - 1].Id,
                    "MoudelPostion": {
                        "X": 60,//这是新模型的固定位置
                        "Y": 60,
                    },
                    "ObjectID": ObjectID
                });

                ObjectRandomNumbers = ObjectID;
                ObjectIDs.push({
                    ObjectID: ObjectID,
                    ObjectRenderIndex: MoudelIndex
                });
                localStorage.setItem("ObjectID", JSON.stringify(ObjectIDs));
                localStorage.setItem("EditorMoudelsLoad", JSON.stringify(BObjectLoad));

                AddObjectaddEventListener = true;//开启添加绑定事件通道
                if (F_PrintAndWriteTheObjectID)
                    console.log("已生成ObjectID随机数:" + ObjectRandomNumbers);
            }
        } else {
            ObjectIDs = JSON.parse(localStorage.getItem("ObjectID"));
            BObjectLoad = [];
            let ObjectID = RandomNum(1, 100000)//为每个模型生成单独的随机数
            BObjectLoad.push({
                "Moudelid": data[data.length - 1].Id,
                "MoudelPostion": {
                    "X": 30,
                    "Y": 30,
                },
                "ObjectID": ObjectID
            });

            localStorage.setItem("EditorMoudelsLoad", JSON.stringify(BObjectLoad));
            ObjectRandomNumbers = ObjectID;
            ObjectIDs.push({
                ObjectID: ObjectID,
                ObjectRenderIndex: MoudelIndex
            });
            localStorage.setItem("ObjectID", JSON.stringify(ObjectIDs));

            AddObjectaddEventListener = true;//开启添加绑定事件通道

            if (F_PrintAndWriteTheObjectID)
                console.log("已生成ObjectID随机数:" + ObjectRandomNumbers);
        }

        ObjectIndex = MoudelIndex - 1;
        let GetBScreenViewHigh = JSON.parse(localStorage.getItem("ScreenViewHighPixel"));
        let GetBScreenViewWidth = JSON.parse(localStorage.getItem("ScreenViewWidthPixel"));

        let GetDataLength = data.length - 1, ObjectPostion = [];

        for (let i = 0; i < GetDataLength; i++) {
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

            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh, GetBScreenViewWidth, Y, X);

            if (Postion <= (GetBScreenViewHigh * GetBScreenViewWidth) && Postion !== null) {
                if (ObjectRandomNumbers === 0) {
                    let DataObjectID = JSON.parse(localStorage.getItem("ObjectID"));
                    DataObjectID.forEach(item => {//这里如果只有判断GetTheObjectID(GetquerySelectorAll[Postion-1].className)的话是不够的所以加上模型的绘制顺序
                        if (item.ObjectID === GetTheObjectID(GetquerySelectorAll[Postion - 1].className) ||
                            item.ObjectRenderIndex === ObjectIndex + 1) {
                            ObjectRandomNumbers = item.ObjectID;
                        }
                    });
                }
                GetquerySelectorAll[Postion - 1].style.background = "#ffffff";
                if (ObjectRandomNumbers !== GetTheObjectID(GetquerySelectorAll[Postion - 1].className))
                    GetquerySelectorAll[Postion - 1].classList.add(`ObjectID_${ObjectRandomNumbers}`);
                //else console.error("Error!ObjectRandomNumbers = 0");
            }
        }

        if (ObjectRandomNumbers !== 0)
            ConnectVertices(GetquerySelectorAll, GetDataLength, ObjectPostion, GetBScreenViewHigh, GetBScreenViewWidth, ObjectRandomNumbers
                , AddObjectaddEventListener, F_PrintAndWriteTheObjectID, E_bRenderPaddingBate);

    }
}

function RotationCalculations() {//旋转计算

}

function ConnectVertices(GetquerySelectorAll, GetDataLength, ObjectPostion, GetBScreenViewHigh, GetBScreenViewWidth, ObjectRandomNumbers
    , AddObjectaddEventListener, F_PrintAndWriteTheObjectID, E_bRenderPaddingBate) {
    let OneBresenHamLinePostion, TwoBresenHamLinePostion;
    for (let i = 0; i < GetDataLength; i++) {//顶点数量
        let SX, SY, EX, EY;

        SX = ObjectPostion[i].X;
        SY = ObjectPostion[i].Y;
        if (i + 1 >= GetDataLength) {
            EX = ObjectPostion[0].X;
            EY = ObjectPostion[0].Y;
        } else {
            EX = ObjectPostion[i + 1].X;
            EY = ObjectPostion[i + 1].Y;
        }

        let BresenHamLinePostion = BresenHamLine(SX, SY, EX, EY);
        if (i === 0) OneBresenHamLinePostion = BresenHamLinePostion;
        else if (i === 1) TwoBresenHamLinePostion = BresenHamLinePostion;

        BresenHamLinePostion.forEach((item) => {
            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh, GetBScreenViewWidth, item.y, item.x);
            if (Postion <= (GetBScreenViewHigh * GetBScreenViewWidth) && Postion !== null) {
                GetquerySelectorAll[Postion - 1].style.background = "#ffffff";
                if (ObjectRandomNumbers !== 0)
                    GetquerySelectorAll[Postion - 1].classList.add(`ObjectID_${ObjectRandomNumbers}`);
            }
        });
    }
    if (E_bRenderPaddingBate)
        ModelFilling(GetquerySelectorAll, `ObjectID_${ObjectRandomNumbers}`, GetBScreenViewWidth, GetBScreenViewHigh,
            ObjectPostion);

    if (AddObjectaddEventListener) {
        if (F_PrintAndWriteTheObjectID) {
            console.log("绑定:" + `ObjectID_${ObjectRandomNumbers}`);
        }
        let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
        document.getElementById("MoudelIDArray").innerHTML += `
              <div class="MoudelIDArrayList">MoudelID_${BObjectLoad.length}S:${ObjectRandomNumbers}</div>
        `;//这里显示模型的ID
        document.querySelectorAll(`.ObjectID_${ObjectRandomNumbers}`).forEach((item) => {
            item.addEventListener('click', () => {
                //这里写绑定之类的操作
                ObjectClassName = item.className;
                console.log("已经选择:" + ObjectClassName);

                let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
                let GetObjectID = GetTheObjectID(ObjectClassName);//赋值给InputY，X

                for (let i = 1; i <= BObjectLoad.length; i++) {
                    if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                        document.getElementById("InputY").value = BObjectLoad[i - 1].MoudelPostion.Y;
                        document.getElementById("InputX").value = BObjectLoad[i - 1].MoudelPostion.X;
                    }
                }
            });
        });
    }
}

function ModelFilling(GetquerySelectorAll, ClassName, GetBScreenViewWidth, GetBScreenViewHigh,
                      ObjectPostion) {
    let OX, OY, TX, TY, result;

    //let Lengh = OneBresenHamLinePostion.length >= TwoBresenHamLinePostion.length ? TwoBresenHamLinePostion.length : OneBresenHamLinePostion.length;

    OX = ObjectPostion[0].X;
    OY = ObjectPostion[0].Y;
    //这里跳一个
    TX = ObjectPostion[2].X;
    TY = ObjectPostion[2].Y;

    let BresenHamLinePostion = BresenHamLine(OX, OY, TX, TY);

    if (BresenHamLinePostion[1]) {
        let item = BresenHamLinePostion[1];//这里选择第一个
        let Postion = CoordinateSystem2D_S(GetBScreenViewHigh, GetBScreenViewWidth, item.y, item.x);
        if (Postion <= (GetBScreenViewHigh * GetBScreenViewWidth) && Postion !== null) {
            GetquerySelectorAll[Postion - 1].style.background = "#ffffff";
            let ObjectRandomNumbers = GetTheObjectID(ClassName);
            if (ObjectRandomNumbers !== 0) {
                GetquerySelectorAll[Postion - 1].classList.add(ClassName);
                if (0) {
                    //alert();
                    let a = 5;
                }//算法都会因为移动过于快导致的问题
                //FloodFill(item.x,item.y,ObjectRandomNumbers,GetBScreenViewHigh,GetBScreenViewWidth,GetquerySelectorAll);
                FloodFill_For(item.x, item.y, ObjectRandomNumbers, GetBScreenViewHigh, GetBScreenViewWidth, GetquerySelectorAll);
            }
        }
    }
}