function FInitialize(FrameLogDebug){
    let InitializeFrameCalculations = false;
    InitializeFrameCalculations = FrameLog(InitializeFrameCalculations,FrameLogDebug);
    
    if(InitializeFrameCalculations)
        Initialize = true;
}