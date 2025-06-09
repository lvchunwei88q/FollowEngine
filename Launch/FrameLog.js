function FrameLog(InitializeFrameCalculations){
    const frameLog = setInterval(function(){
        document.querySelectorAll(".MenuList")[0].innerHTML = `FPS:${BFrame * 2}`;
        BFrame = 0;
    },500);//500ms
    
    return InitializeFrameCalculations = true;
}