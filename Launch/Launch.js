function Launch(){//启动
    let bEngineLoop = true;//控制引擎循环
    const EngineLoop = setInterval(function () {//SetEngineLoop
        if(bEngineLoop){//只有全部完成之后才会进入下一帧
            bEngineLoop = false;
            if(!Initialize){
                FInitialize();
            }
            //在浏览器中我们调节大小之后使用80%之类可以为我们动态改变长宽但是可能结果存在小数
            //所以每帧计算前需要先计算出没有小数长宽的比例
            CalculatePercentageTick();//计算百分比
            
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