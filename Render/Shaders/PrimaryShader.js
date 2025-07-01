function ShaderRendering(PixelColor){
    //ShaderParameter
    let PixelColorArray = RgbToArray(PixelColor);//这里必须最先进行
    
    let OutColor = PostProcessingMian(PixelColorArray);
    
    //这里必须是最后进行的
    return `rgb(${OutColor[0]},${OutColor[1]},${OutColor[2]})`;
}
