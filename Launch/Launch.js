function Launch(){//启动
    let bEngineLoop = true,bFrameLog,bCalculatePercentageDebug;//控制引擎循环
    const EngineLoop = setInterval(function () {//SetEngineLoop
        if(bEngineLoop){//只有全部完成之后才会进入下一帧
            
            bEngineLoop = false;
            
            // 使用方式
            ReadJSON_Editor("DebugSettings/Editor_DebugSettings.json")
                .then(data => {

                    if(!Initialize){//初始化
                        FInitialize(data[1].FrameLog);
                        bFrameLog = data[1].FrameLog;
                        bCalculatePercentageDebug = data[0].CalculatePercentageDebug;
                    }else{
                        if(bFrameLog !== data[1].FrameLog){
                            ShowToast("需要重启引擎!","warning");
                            bFrameLog = data[1].FrameLog;
                        }
                    }
                    //在浏览器中我们调节大小之后使用80%之类可以为我们动态改变长宽但是可能结果存在小数
                    //所以每帧计算前需要先计算出没有小数长宽的比例
                    CalculatePercentageTick(data[0].CalculatePercentageDebug);//计算百分比
                    if(data[0].CalculatePercentageDebug !== bCalculatePercentageDebug){
                        ShowToast(data[0].CalculatePercentageDebug ? "打印排版计算" : "关闭打印排版计算");
                        bCalculatePercentageDebug = data[0].CalculatePercentageDebug;
                    }
                })
                .catch(err => console.error("失败:", err));
            
            const bFrameCalculations = true;
            FrameLogTick();//FrameLogTick
            
            //SetEngineLoop
            if(bFrameCalculations)
                bEngineLoop = true;
        }
    });
}

function FrameLogTick(){
    BFrame++;
}