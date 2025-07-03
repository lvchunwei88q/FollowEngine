function InputMovementLogic(key,KeyPressTime){//KeyPressTime就是按下的时间-这里的key一定是wasd
    //这里需要修改的的地方就是引擎加载的object和html页面的数值
    //这个Function的调用是已经确保了用户选择了object之后的
    let TravelDistance = 1;//默认的移动距离
    let NewKeyPressTime = TimeBasedInterpolation(KeyPressTime);
    //这里计算出最终速度
    TravelDistance *= NewKeyPressTime;
    let GetObjectID = GetTheObjectID(ObjectClassName);
    let BObjectLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));
    //这里需要改动的地方大差不差
    if (key === "w" || key === "s"){//上下
        let TempValue = Number(document.getElementById("InputY").value);
        TempValue += key === "s" ? TravelDistance : (-TravelDistance);
        
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
        updatedData[IndexBObjectLoad].MoudelPostion.Y = TempValue;
        document.getElementById("InputY").value = TempValue;
        // 保存
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
    }else if (key === "a" || key === "d"){//左右
        let TempValue = Number(document.getElementById("InputX").value);
        TempValue += key === "d" ? TravelDistance : (-TravelDistance);

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
        updatedData[IndexBObjectLoad].MoudelPostion.X = TempValue;
        document.getElementById("InputX").value = TempValue;
        // 保存
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
    }
}