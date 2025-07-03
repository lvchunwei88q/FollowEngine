function FInitialize(FrameLogDebug) {
    let InitializeFrameCalculations = false, bSetEngineClick = false,
        bInitializationParameters = false;
    InitializeFrameCalculations = FrameLog(InitializeFrameCalculations, FrameLogDebug);

    bSetEngineClick = SetEngineClick();
    bInitializationParameters = InitializationParameters();
    let ShaderJSONLoop = ReadJSON_Shader();
    let Shaderglobalparameters = ShaderGlobalParameters();
    DeleteActionAuxiliaryParameters(true,true);//保险起见初始化时清空动画数据

    if (InitializeFrameCalculations && bSetEngineClick && bInitializationParameters
    && ShaderJSONLoop && Shaderglobalparameters)
        Initialize = true;
}

function SetEngineClick() {
    document.querySelectorAll(".MenuList")[1].addEventListener("click", function () {
        //GetJSON->UserClick
        if (document.getElementById("InputProjectsUrl").value === "") {
            ReadJSON_Editor("Moudels/Cube.json")
                .then(data => {
                    localStorage.setItem("EditorMoudels", JSON.stringify(data));
                    ShowToast("已重新加载模型文件!");
                })
                .catch(err => {
                    console.error("失败:", err);
                });
        }else ShowToast("已加载用户项目!","warning",1000);
    });

    document.querySelectorAll(".MenuList")[3].addEventListener("click", function () {
        if (document.getElementById("InputProjectsUrl").value !== "") {
            ShowToast("正在开始保存!");
        } else {
            ShowToast("请输入项目的URL!", "warning");
        }
    });

    document.querySelectorAll(".MenuList")[4].addEventListener("click", function () {
        if (document.getElementById("InputProjectsUrl").value !== "") {
            //这里加载项目
            ProjectManagement(document.getElementById("InputProjectsUrl").value);
        } else {
            ShowToast("请输入项目的URL!", "warning");
        }
    });

    document.getElementById("InputX").addEventListener("input", function () {
        if (ObjectClassName != null) {
            let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
            let GetObjectID = GetTheObjectID(ObjectClassName);
            let IndexBObjectLoad;

            for (let i = 1; i <= BObjectLoad.length; i++) {
                if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                    IndexBObjectLoad = i - 1;
                }
            }

            // 获取数据
            const storageKey = "EditorMoudelsLoad";
            let originalData;
            try {
                originalData = JSON.parse(localStorage.getItem(storageKey)) || {MoudelPostion: []};
            } catch {
                originalData = {MoudelPostion: []};
            }

            // 深拷贝并修改
            const updatedData = JSON.parse(JSON.stringify(originalData));
            updatedData[IndexBObjectLoad].MoudelPostion.X = Number(document.getElementById("InputX").value);

            // 保存
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
        } else {
            ShowToast("未选择Object!", "warning");
            document.getElementById("InputX").value = 30;//默认值
        }
    });
    document.getElementById("InputY").addEventListener("input", function () {
        if (ObjectClassName != null) {
            let GetObjectID = GetTheObjectID(ObjectClassName);
            let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
            let IndexBObjectLoad;

            for (let i = 1; i <= BObjectLoad.length; i++) {
                if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                    IndexBObjectLoad = i - 1;
                }
            }

            // 获取数据
            const storageKey = "EditorMoudelsLoad";
            let originalData;
            try {
                originalData = JSON.parse(localStorage.getItem(storageKey)) || {MoudelPostion: []};
            } catch {
                originalData = {MoudelPostion: []};
            }

            // 深拷贝并修改
            const updatedData = JSON.parse(JSON.stringify(originalData));
            updatedData[IndexBObjectLoad].MoudelPostion.Y = Number(document.getElementById("InputY").value);

            // 保存
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
        } else {
            ShowToast("未选择Object!", "warning");
            document.getElementById("InputY").value = 30;//默认值
        }
    });

    document.querySelectorAll(".MenuList")[7].addEventListener("click", function () {
        //GetJSON
        ReadJSON_Editor("Moudels/ModelDynamicEnumeration.json")
            .then(data => {
                ObjectClassName = data.ModelObjectID;
                ObjectClassName = `Pixel ObjectID_${ObjectClassName}`;
                ShowToast("已选择!" + ObjectClassName, "success", 1000);
                let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
                let GetObjectID = GetTheObjectID(ObjectClassName), BokGetObjectID = false;//赋值给InputY，X

                for (let i = 1; i <= BObjectLoad.length; i++) {
                    if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                        BokGetObjectID = true;
                        document.getElementById("InputY").value = BObjectLoad[i - 1].MoudelPostion.Y;
                        document.getElementById("InputX").value = BObjectLoad[i - 1].MoudelPostion.X;
                        //加入InputZYandInputZX
                        document.getElementById("InputZY").value = BObjectLoad[i - 1].ModelZoom.Y * 5;
                        document.getElementById("InputZX").value = BObjectLoad[i - 1].ModelZoom.X * 5;
                    }
                }
                if (!BokGetObjectID) {
                    setTimeout(function () {
                        ShowToast(ObjectClassName + "不是一个有效的ObjectID!", "warning");
                    }, 500);
                }
            })
            .catch(err => {
                console.error("失败:", err);
            });
    })
    
    document.querySelectorAll(".MenuList")[12].addEventListener("click", function () {
        //这里负责StartAnimation
        //GetJSON
        if(JSON.parse(localStorage.getItem("AnimationPlay")) === true) {
            ShowToast("已经开始播放请勿再次点击!", "warning",1000);
            return;
        }
        let Url = document.getElementById("InputProjectsUrl").value;
        if (Url === ""){
            ShowToast("InputURL!", "warning",1000);
            return;
        }
        let Base_Url = "../FollowEngine_Project/"+Url;//这里是绝对路径
        let AnimationUrl = "/Animation/";
        
        let AnimationName = document.getElementById("InputAnimation").value;//这里只需要输入动作的Name就OK
        if (AnimationName === ""){
            ShowToast("请输入动作Name!", "warning",1000);
            return;
        }
        if (ObjectClassName === null) {
            ShowToast("请选择动作物体!", "warning",1000);
            return;
        }
        ReadJSON_User(Base_Url + AnimationUrl + AnimationName + ".json")
            .then(data => {
                ShowToast("开始播放!", "success",500);
                //这里需要整合动作
                let AnimationLenght = data.Tick,AnimationArray = [];
                for (let i = 0; i < AnimationLenght; i++) {
                    AnimationArray.push({
                        S_xy : data.Animation[i].S_xy,
                        E_xy : data.Animation[i].E_xy,
                        Time : data.Animation[i].Time,
                    });
                }
                localStorage.setItem("Animation", JSON.stringify(AnimationArray));//写入
                localStorage.setItem("AnimationPlay",JSON.stringify(true));//开始
            })
            .catch(err => {
                ShowToast("未找到此动作请重新输入!", "error",1000);
                console.error("失败:", err);
            });
    });
    
    document.querySelectorAll(".MenuList")[14].addEventListener("click", function () {
        let InputObjectID = document.getElementById("InputObjectID").value;
        if (InputObjectID === "") {
            ShowToast("请输入ObjectID!", "warning",1000);
            return;
        }
        
        ObjectClassName = InputObjectID;
        ObjectClassName = `Pixel ObjectID_${ObjectClassName}`;
        ShowToast("已选择!" + ObjectClassName, "success", 1000);
        let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
        let GetObjectID = GetTheObjectID(ObjectClassName), BokGetObjectID = false;//赋值给InputY，X

        for (let i = 1; i <= BObjectLoad.length; i++) {
            if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                BokGetObjectID = true;
                document.getElementById("InputY").value = BObjectLoad[i - 1].MoudelPostion.Y;
                document.getElementById("InputX").value = BObjectLoad[i - 1].MoudelPostion.X;
                //加入InputZYandInputZX
                document.getElementById("InputZY").value = BObjectLoad[i - 1].ModelZoom.Y * 5;
                document.getElementById("InputZX").value = BObjectLoad[i - 1].ModelZoom.X * 5;
            }
        }
        if (!BokGetObjectID) {
            setTimeout(function () {
                ShowToast(ObjectClassName + "不是一个有效的ObjectID!", "warning");
            }, 500);
        }
    });

    document.getElementById("InputZX").addEventListener("input", function () {
        if (ObjectClassName != null) {
            let GetObjectID = GetTheObjectID(ObjectClassName);
            let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
            let IndexBObjectLoad;

            // 通过ID获取元素
            const checkbox = document.getElementById("ModelScaleLocks");
            // 检查是否被选中
            const isChecked = checkbox.checked; // 返回 true/false

            for (let i = 1; i <= BObjectLoad.length; i++) {
                if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                    IndexBObjectLoad = i - 1;
                }
            }

            // 获取数据
            const storageKey = "EditorMoudelsLoad";
            let originalData;
            try {
                originalData = JSON.parse(localStorage.getItem(storageKey)) || {ModelZoom: []};
            } catch {
                originalData = {ModelZoom: []};
            }

            // 深拷贝并修改
            const updatedData = JSON.parse(JSON.stringify(originalData));
            if (isChecked)
            {
                let tempvalueX = updatedData[IndexBObjectLoad].ModelZoom.X;
                let tempvalueY = updatedData[IndexBObjectLoad].ModelZoom.Y;
                let ZoomX = Number(document.getElementById("InputZX").value) * (1/5);
                updatedData[IndexBObjectLoad].ModelZoom.X = ZoomX;
                let ZoomY;
                if (tempvalueX !== 0 && tempvalueY !== 0) 
                    ZoomY = (ZoomX / tempvalueX) * tempvalueY;
                else ZoomY = tempvalueY;
                ZoomY = SmartRound(ZoomY);//数学方法舍弃过于小的数
                updatedData[IndexBObjectLoad].ModelZoom.Y = ZoomY;
                document.getElementById("InputZY").value = ZoomY * 5.0;
            }else 
                updatedData[IndexBObjectLoad].ModelZoom.X = Number(document.getElementById("InputZX").value) * (1/5);

            // 保存
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
        } else {
            ShowToast("未选择Object!", "warning");
            document.getElementById("InputZX").value = 5;//默认值
        }
    });

    document.getElementById("InputZY").addEventListener("input", function () {
        if (ObjectClassName != null) {
            let GetObjectID = GetTheObjectID(ObjectClassName);
            let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
            let IndexBObjectLoad;
            // 通过ID获取元素
            const checkbox = document.getElementById("ModelScaleLocks");
            // 检查是否被选中
            const isChecked = checkbox.checked; // 返回 true/false

            for (let i = 1; i <= BObjectLoad.length; i++) {
                if (BObjectLoad[i - 1].ObjectID === GetObjectID) {
                    IndexBObjectLoad = i - 1;
                }
            }

            // 获取数据
            const storageKey = "EditorMoudelsLoad";
            let originalData;
            try {
                originalData = JSON.parse(localStorage.getItem(storageKey)) || {ModelZoom: []};
            } catch {
                originalData = {ModelZoom: []};
            }

            // 深拷贝并修改
            const updatedData = JSON.parse(JSON.stringify(originalData));
            if (isChecked)
            {
                let tempvalueX = updatedData[IndexBObjectLoad].ModelZoom.X;
                let tempvalueY = updatedData[IndexBObjectLoad].ModelZoom.Y;
                let ZoomY = Number(document.getElementById("InputZY").value) * (1/5);
                updatedData[IndexBObjectLoad].ModelZoom.Y = ZoomY;
                let ZoomX;
                if (tempvalueX !== 0 && tempvalueY !== 0)
                    ZoomX = (ZoomY / tempvalueY) * tempvalueX;
                else ZoomX = tempvalueX;
                ZoomX = SmartRound(ZoomX);//数学方法舍弃过于小的数
                updatedData[IndexBObjectLoad].ModelZoom.X = ZoomX;
                document.getElementById("InputZX").value = ZoomX * 5.0;
            }else 
                updatedData[IndexBObjectLoad].ModelZoom.Y = Number(document.getElementById("InputZY").value * (1/5));

            // 保存
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
        } else {
            ShowToast("未选择Object!", "warning");
            document.getElementById("InputZY").value = 5;//默认值
        }
    });

    return true;
}

function InitializationParameters() {

    localStorage.setItem("EditorMoudelsLoad", JSON.stringify(null));
    localStorage.setItem("ObjectID", JSON.stringify(null));
    localStorage.setItem("UserMoudelIndexall",JSON.stringify(0));//默认一个
    localStorage.setItem("TheNumberOfModelSegments",JSON.stringify(null));
    localStorage.setItem("ModelSegmentationArray",JSON.stringify(null));
    localStorage.setItem("IUColor",JSON.stringify(`rgba(255,255,255,1)`));
    //这里加入一个锁来阻断过快加载用户模型
    localStorage.setItem("UserProjectLoading",JSON.stringify(false));
    //这里加入一个锁用来控制动作播放的
    localStorage.setItem("AnimationPlay",JSON.stringify(false));//默认为false
    //这里是存放Animation的地方
    localStorage.setItem("Animation",JSON.stringify(null));//默认为null
    //这里的锁是在一开始时停止原有的2D函数渲染
    localStorage.setItem("EditorRenderView",JSON.stringify(true));
    //这里是防止一时间内过快的点击
    localStorage.setItem("TimingBuffer",JSON.stringify(true));
    //这里初始化读取用户模型Shader
    localStorage.setItem("ModelColoring",JSON.stringify(null));//初始化为Null
    return true;
}