let F_bFrameLog, F_bCalculatePercentageDebug, F_TheTimeForCalculatingFullNumberOfPixels, F_PixelComputingLog,
    F_PrintAndWriteTheObjectID;//这里就是json的参数
let E_bRenderPaddingBate = false,E_bTurnOnFramedRendering = false;
let EngineTickTimeEnd = 0;//这里的参数是因为需要将EngineTickTimeEnd传递给TickLogicControl在GetCurrntTime在执行TickLogicControl后面所以如果不定义全局参数TickLogicControlFunctionGet不到参数

function Launch() {//启动
    let bEngineLoop = true;//控制引擎循环

    let bReadJSON = false, bFrameFrameLogTick = false;
    const EngineLoop = setInterval(function () {//SetEngineLoop
        
        if (bEngineLoop) {//只有全部完成之后才会进入下一帧

            bEngineLoop = false;

            if (!Initialize) {//初始化
                // 使用方式
                ReadJSON_Editor("DebugSettings/Editor_DebugSettings.json")
                    .then(data => {
                        bReadJSON = true;

                        //在浏览器中我们调节大小之后使用80%之类可以为我们动态改变长宽但是可能结果存在小数
                        //所以每帧计算前需要先计算出没有小数长宽的比例
                        CalculatePercentageTick(data[0].CalculatePercentageDebug);//计算百分比
                        F_bCalculatePercentageDebug = data[0].CalculatePercentageDebug;

                        F_TheTimeForCalculatingFullNumberOfPixels = data[3].TheTimeForCalculatingFullNumberOfPixels;
                        F_PixelComputingLog = data[2].PixelComputingLog;
                        F_PrintAndWriteTheObjectID = data[4].PrintAndWriteTheObjectID;

                        if (!Initialize) {//初始化
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
            
            let EngineTickStartTime = GetCurrentTime();//这里Get的时间需要传递给TickLogicControl

            //在浏览器中我们调节大小之后使用80%之类可以为我们动态改变长宽但是可能结果存在小数
            //所以每帧计算前需要先计算出没有小数长宽的比例
            if (F_bCalculatePercentageDebug !== undefined) {
                CalculatePercentageTick(F_bCalculatePercentageDebug);//计算百分比
            }
            //逻辑计算要在渲染前面
            let bTickLogicControl = TickLogicControl(EngineTickStartTime,EngineTickTimeEnd);//这里不是异步通讯所以在返回了false时一定是逻辑错误
            
            /* 在一切计算完成之后就可以开始Render了 */
            MainRender(F_TheTimeForCalculatingFullNumberOfPixels, F_PrintAndWriteTheObjectID, F_bFrameLog,
                E_bRenderPaddingBate,E_bTurnOnFramedRendering);

            bFrameFrameLogTick = FrameLogTick();//FrameLogTick

            EngineTickTimeEnd = GetCurrentTime();

            //SetEngineLoop
            if (bFrameFrameLogTick && bReadJSON && bTickLogicControl)
                bEngineLoop = true;
        } else {
            //SetEngineLoop
            if (bFrameFrameLogTick && bReadJSON)
                bEngineLoop = true;
        }
    });
}

function FrameLogTick() {
    BFrame++;
    return true;
}

function ReadJSON_EditorLoop() {
    let Btrue = true, BtrueT = true;
    const readJSON_EditorLoop = setInterval(function () {
        if (Btrue && BtrueT) {
            Btrue = false;
            BtrueT = false;
            // 使用方式
            ReadJSON_Editor("DebugSettings/Editor_DebugSettings.json")
                .then(data => {
                    Btrue = true;

                    if (data[0].CalculatePercentageDebug !== F_bCalculatePercentageDebug) {
                        ShowToast(data[0].CalculatePercentageDebug ? "打印排版计算" : "关闭打印排版计算");
                        F_bCalculatePercentageDebug = data[0].CalculatePercentageDebug;
                    }

                    if (F_bFrameLog !== data[1].FrameLog) {
                        ShowToast("需要重启引擎!", "warning");
                        F_bFrameLog = data[1].FrameLog;
                    }

                    if (F_PixelComputingLog !== data[2].PixelComputingLog) {
                        ShowToast(data[2].PixelComputingLog ? "打印像素需要的时间" : "关闭打印像素需要的时间");
                        F_PixelComputingLog = data[2].PixelComputingLog;
                    }

                    if (F_TheTimeForCalculatingFullNumberOfPixels !== data[3].TheTimeForCalculatingFullNumberOfPixels) {
                        F_TheTimeForCalculatingFullNumberOfPixels = data[3].TheTimeForCalculatingFullNumberOfPixels;
                        ShowToast(F_PixelComputingLog ? "打印全量像素计算时间" : "关闭打印全量像素计算时间");
                    }

                    if (F_PrintAndWriteTheObjectID !== data[4].PrintAndWriteTheObjectID) {
                        ShowToast(data[4].PrintAndWriteTheObjectID ? "打印写入物体ID" : "关闭打印写入物体ID");
                        F_PrintAndWriteTheObjectID = data[4].PrintAndWriteTheObjectID;
                    }

                })
                .catch(err => {
                    console.error("失败:", err);
                });

            // 使用方式
            ReadJSON_Editor("EngineEffects/Editor_CommonEffects.json")
                .then(data => {
                    BtrueT = true;
                    if (data[0].RenderPaddingBate !== E_bRenderPaddingBate) {
                        E_bRenderPaddingBate = data[0].RenderPaddingBate;
                        ShowToast(data[0].RenderPaddingBate ? "开启模型填充" : "关闭模型填充");
                        if (data[0].RenderPaddingBate) setTimeout(function () {
                            ShowToast("这个功能为实验性！", "warning");
                        }, 200);
                    }
                    if (data[1].TurnOnFramedRendering !== E_bTurnOnFramedRendering){
                        E_bTurnOnFramedRendering = data[1].TurnOnFramedRendering;
                        ShowToast(data[1].TurnOnFramedRendering ? "开启分帧计算" : "关闭分帧计算","success",1000);
                    }

                })
                .catch(err => {
                    console.error("失败:", err);
                });
        }
    }, 400);
}