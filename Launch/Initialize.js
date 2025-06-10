function FInitialize(FrameLogDebug){
    let InitializeFrameCalculations = false,bSetEngineClick = false,
        bInitializationParameters = false;
    InitializeFrameCalculations = FrameLog(InitializeFrameCalculations,FrameLogDebug);

    bSetEngineClick = SetEngineClick();
    bInitializationParameters = InitializationParameters();
    
    if(InitializeFrameCalculations && bSetEngineClick)
        Initialize = true;
}

function SetEngineClick(){
    document.querySelectorAll(".MenuList")[1].addEventListener("click", function(){
        //GetJSON->UserClick
        ReadJSON_Editor("Moudels/Cube.json")
            .then(data => {
                localStorage.setItem("EditorMoudels", JSON.stringify(data));
                ShowToast("以重新加载模型文件!");
            })
            .catch(err => {
                console.error("失败:", err);
            });
    });
    
    document.querySelectorAll(".MenuList")[3].addEventListener("click", function(){
        if (document.getElementById("InputProjectsUrl").value !== ""){
            ShowToast("正在开始保存!");
        }else{
            ShowToast("请输入项目的URL!");
        }
    });
    
    return true;
}

function InitializationParameters(){

    localStorage.setItem("EditorMoudelsLoad", JSON.stringify(null));
    
    return true;
}