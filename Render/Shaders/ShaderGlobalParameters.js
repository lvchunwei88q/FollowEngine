function ShaderGlobalParameters(){
    //这里设置默认值
    let ToneMapParameters = {
        Exposure : 1,
        Contrast : 0,
        Saturation : 0,
        DownSampleScale : 1
    }
    localStorage.setItem("ToneMapParameters",JSON.stringify(ToneMapParameters));
    return true;
}