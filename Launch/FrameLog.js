function FrameLog(InitializeFrameCalculations, FrameLogDebug) {
    const frameLog = setInterval(function () {
        if (FrameLogDebug) {
            document.querySelectorAll(".MenuList")[0].innerHTML = `FPS:${BFrame * 2}`;
            document.querySelectorAll(".MenuList")[10].innerHTML = `LogicTime:${TickLogicControl_CurrentTickTime}ms`;
        }
        BFrame = 0;
    }, 500);//500ms

    return InitializeFrameCalculations = true;
}