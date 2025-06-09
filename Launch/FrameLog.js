function FrameLog(InitializeFrameCalculations,FrameLogDebug){
    const frameLog = setInterval(function(){
        if(FrameLogDebug){
            document.querySelectorAll(".MenuList")[0].innerHTML = `FPS:${BFrame * 2}`;
        }
        BFrame = 0;
    },500);//500ms
    
    return InitializeFrameCalculations = true;
}