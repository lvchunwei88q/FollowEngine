function FInitialize(FrameLogDebug){
    let InitializeFrameCalculations = false,bSetEngineClick = false;
    InitializeFrameCalculations = FrameLog(InitializeFrameCalculations,FrameLogDebug);

    bSetEngineClick = SetEngineClick();
    
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
    
    return true;
}