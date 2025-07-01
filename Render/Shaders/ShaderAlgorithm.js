//后处理着色函数
function PostProcessingMian(color){
    let OutColor = [0,0,0];
    
    //Parameters
    let TonemapParameters = JSON.parse(localStorage.getItem("ToneMapParameters"));
    //Function
    OutColor = Tonemap(color,TonemapParameters.Exposure,TonemapParameters.Contrast,TonemapParameters.Saturation,TonemapParameters.DownSampleScale);
    
    return OutColor;
}