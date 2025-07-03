function AnimationInitialization(CurrentTickTime){//CurrentTickTime
    //这里需要线程解开才可进行
    let AnimationPlay = JSON.parse(localStorage.getItem("AnimationPlay"));
    if (!AnimationPlay) return;
    
    //这里负责动画参数的初始化-首先需要GetObject的Postion
    //EditorMoudelsLoad这个是Engine保存Object数据的地方同时也是在生成Object时读取的数组-在获取动作这时一定可以获取
    let EditorMoudelsLoad = JSON.parse(localStorage.getItem("EditorMoudelsLoad"));//GetEditorMoudelsLoad
    let AnimationData = JSON.parse(localStorage.getItem("Animation"));//GetAnimation
    
    if(EditorMoudelsLoad === undefined && AnimationData === null){
        console.error("[AnimationInitialization]:undefined!");//这里防止出错
        return;
    }
    
    //这就是初始化的参数初始化
    if (JSON.parse(localStorage.getItem("Animation_bObjectID")))//初始化一次
    {
        InitializeActionAuxiliaryParameters(AnimationData,1);//这个1是第一帧
        //这里为了动作的连贯性还需要初始化物体的位置也就是第一帧的开始位置
        InitializeObjectPosition(AnimationData,EditorMoudelsLoad);
        
    }
    
    //开始动作计算
    AnimationCalculations(AnimationData,EditorMoudelsLoad,CurrentTickTime);
}

//这个函数初始化一些动作计算需要的辅助参数比如时间计算的
function InitializeActionAuxiliaryParameters(AnimationData,TickIndex){//GetAnimationData
    localStorage.setItem("Animation_Time",JSON.stringify(AnimationData[TickIndex - 1].Time));
    localStorage.setItem("Animation_C_xy",JSON.stringify(AnimationData[TickIndex - 1].S_xy));//这里表示当前位置
    localStorage.setItem("Animation_ObjectID",JSON.stringify(null));
    localStorage.setItem("Animation_Tick",JSON.stringify(AnimationData.length));//记录长度
    localStorage.setItem("Animation_bObjectID",JSON.stringify(true));
    localStorage.setItem("Animation_CurrentTick",JSON.stringify(TickIndex));//这里记录当前是第几帧
    localStorage.setItem("Animation_FrameSpacing",JSON.stringify(null));
}

function InitializeActionAuxiliary(AnimationData,TickIndex){//这里只初始化位置与帧时间
    localStorage.setItem("Animation_Time",JSON.stringify(AnimationData[TickIndex - 1].Time));
    localStorage.setItem("Animation_C_xy",JSON.stringify(AnimationData[TickIndex - 1].S_xy));//这里表示当前位置
    localStorage.setItem("Animation_CurrentTick",JSON.stringify(TickIndex));//这里记录当前是第几帧
    localStorage.setItem("Animation_FrameSpacing",JSON.stringify(null));
}

function DeleteActionAuxiliaryParameters(bDeleteTick,bObjectID){//DeleteAnimationData-这里需要设置是否要删除Animation_Tick
    localStorage.setItem("Animation_Time",JSON.stringify(null));
    localStorage.setItem("Animation_C_xy",JSON.stringify(null));
    if(bDeleteTick) localStorage.setItem("Animation_Tick",JSON.stringify(null));//记录长度
    if(bDeleteTick) localStorage.setItem("Animation_ObjectID",JSON.stringify(null));
    if(bDeleteTick) localStorage.setItem("AnimationBresenHamLine",JSON.stringify(null));
    if(bObjectID) localStorage.setItem("Animation_bObjectID",JSON.stringify(true));
    localStorage.setItem("Animation_CurrentTick",JSON.stringify(null));//这里记录当前是第几帧
}

function InitializeObjectPosition(AnimationData,EditorMoudelsLoad){
    //从这里初始化物体的位置
    let S_ObjectPosition = AnimationData[0].S_xy;
    for (let i = 0; i < EditorMoudelsLoad.length; i++){
        if(GetTheObjectID(ObjectClassName) === EditorMoudelsLoad[i].ObjectID){
            EditorMoudelsLoad[i].MoudelPostion.X = S_ObjectPosition[0];
            EditorMoudelsLoad[i].MoudelPostion.Y = S_ObjectPosition[1];
        }
    }
    localStorage.setItem("EditorMoudelsLoad",JSON.stringify(EditorMoudelsLoad));
    console.log("[InitializeObjectPosition]:初始化物体位置完成！");
}

function AnimationCalculations(AnimationData,EditorMoudelsLoad,CurrentTickTime){//这个函数的终止条件就是Animation_Tick为0，Animation_Tick每次在一个动作帧计算完成之后就会-1
    if(JSON.parse(localStorage.getItem("Animation_Tick")) === 0 ||
       JSON.parse(localStorage.getItem("Animation_Tick")) <= 0){
        //这里进行结束计算
        localStorage.setItem("AnimationPlay",JSON.stringify(false));//End!
        DeleteActionAuxiliaryParameters(true,true);
        console.log("[AnimationCalculations]:动作计算完成！");
        return;
    }
    //开始动作计算
    //首先记录Animation的ObjectID
    if(JSON.parse(localStorage.getItem("Animation_bObjectID"))){//这里相当于只会初始化一次
        for(let i = 0; i < EditorMoudelsLoad.length; i++){
            if(GetTheObjectID(ObjectClassName) === EditorMoudelsLoad[i].ObjectID){
                let Animation_ObjectID = {
                    ObjectID : EditorMoudelsLoad[i].ObjectID,
                    Index : i,
                }
                localStorage.setItem("Animation_ObjectID",JSON.stringify(Animation_ObjectID));
                localStorage.setItem("Animation_bObjectID",JSON.stringify(false));
                console.log("[Animation_ObjectID]", JSON.parse(localStorage.getItem("Animation_ObjectID")));
                //这里也是相当于一个初始化-所以可以在这里计算出要执行的所有动画
                let AnimationBresenHamLine = [];
                for (let j = 0; j < AnimationData.length; j++){
                    let item = AnimationData[j];
                    AnimationBresenHamLine.push({
                        BresenHamLine : BresenHamLine(item.S_xy[0],item.S_xy[1],item.E_xy[0],item.E_xy[1])//这里填入开始的xy与结束的xy
                    });
                }
                localStorage.setItem("AnimationBresenHamLine",JSON.stringify(AnimationBresenHamLine));
                console.log("[AnimationCalculations]:动画数据准备完成！");
            }
        }
    }
    //GetObjectPostionAnd初始化位置，这里开始与结束可以使用直线算法进行计算
    //首先是时间计算CurrentTickTime是一帧计算时间1s = 1000ms-首先需要使用直线算法计算
    //这里先GetTickTime
    let GetTickTime = JSON.parse(localStorage.getItem("Animation_Time"));
    GetTickTime = SecondtoMillisecond(GetTickTime);//转换为ms
    let AnimationBresenHamLine = JSON.parse(localStorage.getItem("AnimationBresenHamLine"));//移动的范围
    //获取了GetTickTime在函数的参数中也传入了帧计算时间在初始化时也计算了本帧的移动步数所以这样就可以得出来这个帧要移动多少步数
    //这里还需要Animation_CurrentTick来得到这是第几帧
    let AnimationCurrentTick = JSON.parse(localStorage.getItem("Animation_CurrentTick"));//这里首先会得到第一帧
    
    if (GetTickTime <= 0){//这里说明要进入下一帧了
        AnimationCurrentTick++;
        let AnimationTick = JSON.parse(localStorage.getItem("Animation_Tick"));
        if(AnimationCurrentTick - AnimationData.length <= 0) 
            InitializeActionAuxiliary(AnimationData,AnimationCurrentTick);
        else AnimationCurrentTick = AnimationTick;//这里AnimationCurrentTick不可以大于AnimationTick
        AnimationTick -= 1;//Animation_Tick也要减一
        localStorage.setItem("Animation_Tick",JSON.stringify(AnimationTick));
        let NewGetTickTime = JSON.parse(localStorage.getItem("Animation_Time"));//因为要进入一下帧所以需要重新Get
        GetTickTime = SecondtoMillisecond(NewGetTickTime);//转换为ms
    }
    //首先计算出比如1000ms走41次每1ms走多少次
    //接下来就是使用GetTickTime - CurrentTickTime
    if (JSON.parse(localStorage.getItem("Animation_FrameSpacing")) === null){//这里表明是没有计算的
        if (AnimationBresenHamLine === null){
            console.error("[AnimationBresenHamLine]:动画系统初始化错误！已停止");
            localStorage.setItem("AnimationPlay",JSON.stringify(false));//End!
            return;
        }
        let AnimationBresenHamLineLenght = AnimationBresenHamLine[AnimationCurrentTick - 1].BresenHamLine.length;//GetAnimationBresenHamLineLenght
        let FrameSpacing = AnimationBresenHamLineLenght / GetTickTime;//这里的GetTickTime一定是在动画数据里的设置的数
        localStorage.setItem("Animation_FrameSpacing",JSON.stringify(FrameSpacing));//这里写入帧间隔
        console.log(`[AnimationBresenHamLineLenght]:当前帧帧间隔:${FrameSpacing}`);
    }
    //在计算完帧间隔之后依据当前的CurrentTickTime去计算道理走多少步数
    //这里我们不仅需要使用CurrentTickTime还需要使用GetTickTime来判断当前的剩余步数来判断Current在第几步上，那么首先需要GetTickTime - CurrentTickTime，之后GetAnimation_FrameSpacing
    GetTickTime = GetTickTime - CurrentTickTime;//第一步
    if (GetTickTime < 0) GetTickTime = 0;//防错机制
    GetTickTime = TruncateNumber4fo5(GetTickTime);//防错机制
    
    let NewGetTickTime = MillisecondtoSecond(GetTickTime);//这里存入时一定要转换回去
    localStorage.setItem("Animation_Time",JSON.stringify(NewGetTickTime));//这里可以把GetTickTime保存起来了
    
    let GetFrameSpacing = JSON.parse(localStorage.getItem("Animation_FrameSpacing"));//第二步
    //接下来因为需要获取一共走多少帧所以GetAnimationBresenHamLineLenght-比如41
    let AnimationBresenHamLineLenght = AnimationBresenHamLine[AnimationCurrentTick - 1].BresenHamLine.length;//GetAnimationBresenHamLineLenght
    //使用GetTickTime和GetFrameSpacing计算出还剩下几针
    let NoActionFrame = GetTickTime * GetFrameSpacing;//这里就四舍五入一下
    NoActionFrame = TruncateNumber4fo5(NoActionFrame);
    //使用所有的帧减去余下的帧剩下的就是执行的帧，这里还有一个问题就是执行帧会不断的变多的所以可以根据位置来判断改执行第几帧
    let ExecutionFrame = AnimationBresenHamLineLenght - NoActionFrame;
    //这里加入一个错误判断
    if (ExecutionFrame > AnimationBresenHamLineLenght){
        localStorage.setItem("AnimationPlay",JSON.stringify(false));//End!
        //这里的AnimationBresenHamLineLenght不可能小于NoActionFrame
        console.error(`[AnimationCalculations]:AnimationBresenHamLineLenght:${AnimationBresenHamLineLenght} 小于 NoActionFrame:${NoActionFrame}`);
    }
    //接下来就是循环ExecutionFrame
    
    //for (let i=0;i<ExecutionFrame;i++){
    //    //这里的首先需要知道这里是从0开始到AnimationBresenHamLineLenght结束的所以我们判断物体的位置
    //}
    if(ExecutionFrame < 1)ExecutionFrame = 1;//防错机制
    
    //首先GetAnimationBresenHamLinePostion
    let CurrentObjectPostion = AnimationBresenHamLine[AnimationCurrentTick - 1].BresenHamLine[ExecutionFrame - 1];
    //这里在获取i也就是Animation_ObjectID
    let Animation_ObjectID = JSON.parse(localStorage.getItem("Animation_ObjectID"));
    //EditorMoudelsLoad来自于函数传参
    EditorMoudelsLoad[Animation_ObjectID.Index].MoudelPostion.X = CurrentObjectPostion.x;
    EditorMoudelsLoad[Animation_ObjectID.Index].MoudelPostion.Y = CurrentObjectPostion.y;
    localStorage.setItem("EditorMoudelsLoad",JSON.stringify(EditorMoudelsLoad));
    // 更新HTML
    document.getElementById("InputX").value = CurrentObjectPostion.x;
    document.getElementById("InputY").value = CurrentObjectPostion.y;
}