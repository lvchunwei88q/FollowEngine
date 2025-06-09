let F_bFrameLog,F_bCalculatePercentageDebug;//这里就是json的参数

function Launch(){//启动
    let bEngineLoop = true;//控制引擎循环
    
    let bReadJSON = false,bFrameFrameLogTick = false;
    const EngineLoop = setInterval(function () {//SetEngineLoop
        if(bEngineLoop){//只有全部完成之后才会进入下一帧
            
            bEngineLoop = false;

            if(!Initialize){//初始化
                // 使用方式
                ReadJSON_Editor("DebugSettings/Editor_DebugSettings.json")
                    .then(data => {
                        bReadJSON = true;

                        //在浏览器中我们调节大小之后使用80%之类可以为我们动态改变长宽但是可能结果存在小数
                        //所以每帧计算前需要先计算出没有小数长宽的比例
                        CalculatePercentageTick(data[0].CalculatePercentageDebug);//计算百分比
                        F_bCalculatePercentageDebug = data[0].CalculatePercentageDebug;

                        if(!Initialize){//初始化
                            FInitialize(data[1].FrameLog);
                            LoadRenderingInterface();

                            F_bFrameLog = data[1].FrameLog;
                            F_bCalculatePercentageDebug = data[0].CalculatePercentageDebug;
                            ShowToast("初始化已完成!");
                        }
                    })
                    .catch(err => {
                        console.error("失败:", err);
                        bReadJSON = false;
                    });
                //SetLoop
                ReadJSON_EditorLoop();
            }
            
            //在浏览器中我们调节大小之后使用80%之类可以为我们动态改变长宽但是可能结果存在小数
            //所以每帧计算前需要先计算出没有小数长宽的比例
            if(F_bCalculatePercentageDebug !== undefined){
                CalculatePercentageTick(F_bCalculatePercentageDebug);//计算百分比
            }
            
            /* 在一切计算完成之后就可以开始Render了 */
            MainRender();
            
            bFrameFrameLogTick = FrameLogTick();//FrameLogTick
            
            //SetEngineLoop
            if(bFrameFrameLogTick && bReadJSON)
                bEngineLoop = true;
        }else{
            //SetEngineLoop
            if(bFrameFrameLogTick && bReadJSON)
                bEngineLoop = true;
        }
    });
}

function FrameLogTick(){
    BFrame++;
    return true;
}

function ReadJSON_EditorLoop(){
    let Btrue = true;
    const readJSON_EditorLoop = setInterval(function () {
        if(Btrue){
            Btrue = false;
            // 使用方式
            ReadJSON_Editor("DebugSettings/Editor_DebugSettings.json")
                .then(data => {
                    Btrue = true;

                    if(data[0].CalculatePercentageDebug !== F_bCalculatePercentageDebug){
                        ShowToast(data[0].CalculatePercentageDebug ? "打印排版计算" : "关闭打印排版计算");
                        F_bCalculatePercentageDebug = data[0].CalculatePercentageDebug;
                    }

                    if(F_bFrameLog !== data[1].FrameLog){
                        ShowToast("需要重启引擎!","warning");
                        F_bFrameLog = data[1].FrameLog;
                    }

                })
                .catch(err => {
                    console.error("失败:", err);
                });
        }
    },400);
}