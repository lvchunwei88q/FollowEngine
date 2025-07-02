let TickLogicControl_CurrentTickTime;//这个参数是计算CurrentTickTime可能会遇到负数所以这里直接复原记录
function TickLogicControl(EngineLoopStart, EngineLoopEnd) {
    //这里就需要考虑一个问题就是帧之间的生成是不固定尤其在动画系统中我们需要对动画的时间长度与帧生成的时间长度去适配
    //这里的解决思路就是Get上一帧的生成时间这样下一帧也是大差不差了之后依据生成的时间让动画系统决定偏移量
    //依据这样的想法在所有的比如物理模拟这种类似的逻辑处理上都可以使用此方法来做，所以在逻辑控制函数里就规定了调用函数的时间
    
    //首页需要GetCurrentTime,还需要在当前时间获取帧的生成时间也就是在EngineLoopStart - EngineLoopEnd
    let CurrentTime = GetCurrentTime();//Log
    let CurrentTickTime = 0;
    if (EngineLoopEnd !== 0){
        CurrentTickTime = EngineLoopStart - EngineLoopEnd;//这里的EngineLoopEnd是全局参数可能为0所以来个if判断
    }else CurrentTickTime = EngineLoopStart;
    
    //CurrentTickTime就是帧的生成时间CurrentTime是执行到TickLogi  cControl函数的时间
    //这里CurrentTickTime计算出来也可能是个负数这里直接舍弃掉
    if (CurrentTickTime < 0){//这里如果是负数直接回去上一个Tick，但函数调用的是CurrentTickTime不是TickLogicControl_CurrentTickTime
        CurrentTickTime = TickLogicControl_CurrentTickTime;
    }else {
        TickLogicControl_CurrentTickTime = CurrentTickTime;
    }
    //console.log(CurrentTickTime);//这里ms以默认性能30-40为例
    
    //这里的CurrentTickTime是每帧的间隔是需要去计算完的
    AnimationInitialization(CurrentTickTime);
    
    return true;
}