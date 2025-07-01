//ShaderGlobalVariables
let ShaderCalculations = false;

function ShaderLoop(FGetquerySelectorAll){
    if (FGetquerySelectorAll.length > 0){
        //这里才是符合条件的所以开始执行Shader函数
        if (ShaderCalculations)
            ColoringCycle(FGetquerySelectorAll);
    }
    return true;
}

function ColoringCycle(FGetquerySelectorAll) {//使用C++工作模式去计算
    for (let i = 0; i < FGetquerySelectorAll.length; i++) {
        const element = FGetquerySelectorAll[i];
        if (!isNaN(GetTheObjectID(element.className))) {
            const OriginalColor = element.style.background;

            element.style.background = ShaderRendering(OriginalColor);
        }
    }
}

function ReadJSON_Shader(){
    const ShaderJSONLoop = setInterval(function (){
        ReadJSON_Editor("EngineEffects/ShaderParameters.json")
            .then(data => {
                let ToneMapParameters;
                if (ShaderCalculations !== data.ShaderCalculations){
                    ShaderCalculations = data.ShaderCalculations;
                    ShowToast(`${ShaderCalculations ? "开启" : "关闭"}着色器计算`,"success",1000);
                }

                ToneMapParameters = {
                    Exposure : data.ToneMap.Exposure,
                    Contrast : data.ToneMap.Contrast,
                    Saturation : data.ToneMap.Saturation,
                    DownSampleScale : data.ToneMap.DownSampleScale
                }
                localStorage.setItem("ToneMapParameters",JSON.stringify(ToneMapParameters));
            })
            .catch(err => {
                console.error("失败:", err);
            });
    },500);//500ms
    
    return true;
}