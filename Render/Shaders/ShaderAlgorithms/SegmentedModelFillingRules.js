function SegmentedModelFillingRules(TheNumberOfModelSegment,ObjectIndex){//在分段里的
    //在分段里填土需要的参数是CurrentTheNumberOfModelSegmentsAndModelColoring，在每个函数中先判断
    //ModelColoring是否有内容
    let ModelColoring = JSON.parse(localStorage.getItem("ModelColoring"));
    //GetModelColoring
    if (ModelColoring === null) {
        return "rgba(255,0,255,1)";
    }
    //判断完成之后就可以开始了-TheNumberOfModelSegment获取了这是第几个分段
    //还需要Get模型的绘制顺序ObjectIndex
    let OutColor = ModelColoring[ObjectIndex][TheNumberOfModelSegment].Color;
    return `rgba(${OutColor[0]},${OutColor[1]},${OutColor[2]},1)`;
}

function SegmentedModelFillingRulesFor(ObjectIndex){//在For循环里的这里其实可以不用
    //这里开始在顶点里进行填涂颜色
    //ModelColoring是否有内容
    let ModelColoring = JSON.parse(localStorage.getItem("ModelColoring"));
    //GetModelColoring
    if (ModelColoring === null) {
        return "rgba(255,0,255,1)";
    }
    let OutColorLenght = ModelColoring[ObjectIndex].length;
    if (OutColorLenght === 1){
        let OutColor = ModelColoring[ObjectIndex][0].Color;
        return `rgba(${OutColor[0]},${OutColor[1]},${OutColor[2]},1)`;
    }else 
        return "rgba(255,255,255,1)";
}