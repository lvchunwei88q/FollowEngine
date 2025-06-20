function LoadRenderingInterface() {
    let GetBScreenViewHigh = BScreenViewHigh;
    let GetBScreenViewWidth = BScreenViewWidth;

    document.getElementById("MainInterface").innerHTML = "";//Null
    let html = "";

    let WIndex = GetBScreenViewWidth / 5;
    let HIndex = GetBScreenViewHigh / 5;

    //这里不仅是取整的作用还是构建坐标系的关键
    WIndex = truncateNumber(WIndex);//取整
    HIndex = truncateNumber(HIndex);//取整
    localStorage.setItem("ScreenViewWidthPixel", JSON.stringify(WIndex));
    localStorage.setItem("ScreenViewHighPixel", JSON.stringify(HIndex));

    for (let i = 0; i < (WIndex * HIndex); i++) {//1920*1080
        html += `
        <div class="Pixel"></div>
        `;
    }
    document.getElementById("MainInterface").innerHTML = html;

    //在渲染屏幕初始化以后构建坐标系
    /* 以左上为原点中心 */

    //测试寻找100个像素需要的时间
    ReadJSON_Editor("DebugSettings/Editor_DebugSettings.json")
        .then(data => {
            if (data[2].PixelComputingLog) {
                let CTime = GetCurrentTime(), PIndex;
                for (let i = 1; i <= 100; i++) {
                    PIndex = CoordinateSystem2D(WIndex, HIndex, WIndex - i, HIndex - i);//GetCoordinateSystem2D
                    if (i === 100) {
                        const CsTime = GetCurrentTime();
                        let Time = CsTime - CTime;
                        console.log("寻找像素耗时:" + Time + "ms" + "-找到:" + PIndex);
                    }
                }
            }
        })
        .catch(err => {
            console.error("失败:", err);
        });
}