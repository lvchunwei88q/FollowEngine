//这里进行全局的捕获事件获取
const GloballyKeysPressed = {//这里初始化一下需要使用的按键
    w : false,
    s : false,
    a: false,
    d: false,
    W : false,
    S : false,
    A: false,
    D: false,
};
let KeyPressTime = 0;//记录按下时间

document.addEventListener('keydown', (e) => {GloballyKeysPressed[e.key] = true;if (KeyPressTime <= 10000)KeyPressTime++;});//这里最大不超过一万
document.addEventListener('keyup', (e) => {GloballyKeysPressed[e.key] = false;KeyPressTime = 0});

// 在游戏循环中检测
function CaptureEventsGlobally() {
    //这里每帧循环一次
    for (const key in GloballyKeysPressed) {
        if (!GloballyKeysPressed[key]) continue;
        //这里使用switch进行用户输入判定
        switch (key) {
            //小写
            case 'w': MoveInputEvents("w"); break;
            case 'a': MoveInputEvents("a"); break;
            case 's': MoveInputEvents("s"); break;
            case 'd': MoveInputEvents("d"); break;
            //大写
            case 'W': MoveInputEvents("w",true); break;
            case 'A': MoveInputEvents("a",true); break;
            case 'S': MoveInputEvents("s",true); break;
            case 'D': MoveInputEvents("d",true); break;
        }
    }
}

function MoveInputEvents(key,bBig = false){//这里处理移动逻辑
    OutputCapture(key,true,bBig);
    //这里需要判断ObjectClassName是否合法
    let TempObjectClassName = ObjectClassName,bInputMovementLogic = false;
    //这里如果为null直接跳过了
    if (TempObjectClassName !== null){
        //这里使用ObjectID来进行判断
        let GetObjectID = JSON.parse(localStorage.getItem("ObjectID"));
        GetObjectID.forEach(item => {
            if (item.ObjectID === GetTheObjectID(TempObjectClassName)) {
                bInputMovementLogic = true;
            }
        });

        let NewKeyPressTime = clamp(KeyPressTime,0,20);//这里clamp一下
        if (bInputMovementLogic)
            InputMovementLogic(key,NewKeyPressTime);
    }
}

function OutputCapture(key,bOutput = false,bBig){
    if (bOutput) 
        document.getElementById("GloballyUserInput").innerText =`${bBig ? "Max" : "Min"}UserInput:${key}-${KeyPressTime >= 999 ? "More" : KeyPressTime}F`;
}