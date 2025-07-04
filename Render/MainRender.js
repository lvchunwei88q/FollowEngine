let bRenderEngineLoop = true, M_TheTimeForCalculatingFullNumberOfPixels,GShaderLoop = false,
    GetquerySelectorAllIndex = 0, GetquerySelectorAllForEachIndex = 0, RenderF_bFrameLog = false;//循环
let GetquerySelectorAll;
let IndexMoudelOrShader = 0;let IndexShaderRenderTime = 0;

const MaxTickis = 1;const MAXShaderRenderTime = 50;

function MainRender(TTFFNOP, F_PrintAndWriteTheObjectID, F_bFrameLog,
                    E_bRenderPaddingBate,E_bTurnOnFramedRendering) {
    /* 一、渲染管线的主要阶段
1. 应用阶段（Application Stage）
CPU端工作：
准备渲染数据（模型、材质、灯光、摄像机参数）。
执行视锥剔除（Frustum Culling）、遮挡剔除（Occlusion Culling）等优化，减少GPU负担。
提交渲染命令（Draw Calls）到GPU。

2. 几何阶段（Geometry Stage）
GPU端处理，将3D模型转换为屏幕空间的2D坐标：
顶点着色器（Vertex Shader）：
处理每个顶点的位置、法线、UV坐标等属性。
执行模型变换（Model）、视图变换（View）、投影变换（Projection），即 MVP变换。
曲面细分（Tessellation）（可选）：
动态细分模型表面，增加细节（如地形、角色皮肤）。
几何着色器（Geometry Shader）（可选）：
生成或销毁几何图元（如将点扩展为粒子）。

3. 光栅化阶段（Rasterization Stage）
将几何图元（三角形）转换为屏幕上的像素片段（Fragments）：
裁剪（Clipping）：移除视锥外的部分。
屏幕映射（Screen Mapping）：将坐标转换到屏幕空间。
三角形遍历（Triangle Traversal）：确定哪些像素被三角形覆盖。

4. 像素处理阶段（Pixel Stage）
片段着色器（Fragment Shader / Pixel Shader）：
计算每个像素的最终颜色（基于材质、纹理、光照等）。
处理漫反射、高光、阴影、PBR材质等效果。
深度测试（Depth Test） 和 模板测试（Stencil Test）：
决定像素是否被写入帧缓冲（解决遮挡问题）。

5. 输出合并阶段（Output Merger）
将当前渲染结果与帧缓冲（Framebuffer）中的已有数据混合：
透明度混合（Alpha Blending）：处理半透明物体。
抗锯齿（Anti-Aliasing）：平滑边缘锯齿（如MSAA、TAA）。 */

    M_TheTimeForCalculatingFullNumberOfPixels = TTFFNOP;
    RenderF_bFrameLog = F_bFrameLog;

    //渲染与Editor的帧计算分开进行
    if (bRenderEngineLoop) {
        const CCTimeSpace2D = GetCurrentTime();
        if (GetquerySelectorAllIndex >= 16) {
            GetquerySelectorAllIndex = 0;
            GetquerySelectorAll = document.querySelectorAll(".Pixel");
        } else if (GetquerySelectorAllIndex === 0) {
            GetquerySelectorAll = document.querySelectorAll(".Pixel");
        }
        GetquerySelectorAllIndex++;
        IndexShaderRenderTime++;

        if (GetquerySelectorAllForEachIndex >= 6) {
            GetquerySelectorAllForEachIndex = 0;
            GetquerySelectorAll.forEach((item) => {
                if (item.style.background !== "")
                    item.style.background = "#000000";
                item.className = 'Pixel';
                //item.classList.add('Pixel');
            });
        } else if (GetquerySelectorAllForEachIndex === 0) {
        }
        GetquerySelectorAllForEachIndex++;
        
        //分帧计算第一帧计算SpatialTransformation-Function第二帧计算ShaderLoop-Function
        let bSpatialTransformation
        if (E_bTurnOnFramedRendering){
            if(IndexMoudelOrShader === 0){
                bSpatialTransformation = SpatialTransformation(GetquerySelectorAll, F_PrintAndWriteTheObjectID,
                    E_bRenderPaddingBate);//第一步从模型空间转换到世界空间，从世界空间转换到视图空间
            }
        }
        else{
            bSpatialTransformation = SpatialTransformation(GetquerySelectorAll, F_PrintAndWriteTheObjectID,
                E_bRenderPaddingBate);//第一步从模型空间转换到世界空间，从世界空间转换到视图空间
        }
        IndexMoudelOrShader++;
        
        let bRenderingPerformanceTesting = RenderingPerformanceTesting(GetquerySelectorAll, M_TheTimeForCalculatingFullNumberOfPixels);
        
        if (E_bTurnOnFramedRendering){
            if (IndexMoudelOrShader === MaxTickis){
                //接下来就是计算着色器了
                GShaderLoop = ShaderLoop(GetquerySelectorAll);
                const CSTimeRender = GetCurrentTime();
                if (RenderF_bFrameLog && IndexShaderRenderTime > MAXShaderRenderTime) {
                    IndexShaderRenderTime = 0;
                    let RenderTime = CSTimeRender - CCTimeSpace2D;
                    document.getElementById("RenderTime").innerHTML = `RenderTime:${RenderTime}ms`;
                }
            }
        }
        else{
            GShaderLoop = ShaderLoop(GetquerySelectorAll);
            const CSTimeRender = GetCurrentTime();
            if (RenderF_bFrameLog && IndexShaderRenderTime > MAXShaderRenderTime) {
                IndexShaderRenderTime = 0;
                let RenderTime = CSTimeRender - CCTimeSpace2D;
                document.getElementById("RenderTime").innerHTML = `RenderTime:${RenderTime}ms`;
            }
        } 

        if (bSpatialTransformation && bRenderingPerformanceTesting && GShaderLoop) {
            bRenderEngineLoop = true;
        }
        
        if (IndexMoudelOrShader >= MaxTickis)IndexMoudelOrShader = 0;
    }
}

function SpatialTransformation(GetquerySelectorAll, F_PrintAndWriteTheObjectID,
                               E_bRenderPaddingBate) {
    let GetBScreenViewHigh = BScreenViewHigh;
    let GetBScreenViewWidth = BScreenViewWidth;

    if (GetBScreenViewHigh !== 0 && GetBScreenViewWidth !== 0) {
        //GetUserMoudelIndexall
        let UserMoudelIndexall = JSON.parse(localStorage.getItem("UserMoudelIndexall"));
        
        let data,UserData;
        if (MoudelIndexall !== 0){
            if (!JSON.parse(localStorage.getItem("EditorMoudels"))) {
                //GetJSON
                ReadJSON_Editor("Moudels/Cube.json")
                    .then(data => {
                        localStorage.setItem("EditorMoudels", JSON.stringify(data));
                    })
                    .catch(err => {
                        console.error("失败:", err);
                    });
            }

            data = JSON.parse(localStorage.getItem("EditorMoudels"));
            
        }else if(UserMoudelIndexall !== 0 || UserMoudelIndexall !== null){
            UserData = JSON.parse(localStorage.getItem("UserMoudels"));
        }


        if (data !== null && data !== undefined && (UserMoudelIndexall === 0 || UserMoudelIndexall == null)
        && JSON.parse(localStorage.getItem("EditorRenderView"))) {
            
            for (let i = 1; i <= MoudelIndexall; i++) {
                Space2D(data, GetquerySelectorAll, F_PrintAndWriteTheObjectID, i, MoudelIndexall,
                    E_bRenderPaddingBate);//这个时Editor模型使用的
            }
        }
        
        if (UserData !== null && UserData !== undefined && JSON.parse(localStorage.getItem("UserProjectLoading"))){
            let IU_Color = JSON.parse(localStorage.getItem("IUColor"));//默认颜色
            //要支持多用户模型的化可以在这里做文章UserData
            /*
            [
               [
                 [].....
                 {
                 id:..
                 }
               ]
               [
                 [].....
                 {
                 id:..
                 }
               ]
            ] 理想的用户模型文件
             */
            //UserMoudelIndexall表示用户模型的数量
            
                for (let i = 1; i <= UserMoudelIndexall; i++) {//这个用户模型使用
                    let UserDatas = UserData[i-1];
                Space2D_User(UserDatas, GetquerySelectorAll, F_PrintAndWriteTheObjectID, i, UserMoudelIndexall,
                    E_bRenderPaddingBate,IU_Color);//这个时Editor模型使用的
            }
        }
    }
    return true;
}

function RenderingPerformanceTesting(GetquerySelectorAll, M_TheTimeForCalculatingFullNumberOfPixels) {
    if (!M_TheTimeForCalculatingFullNumberOfPixels) return true;

    let GetBScreenViewHigh = JSON.parse(localStorage.getItem("ScreenViewHighPixel"));
    let GetBScreenViewWidth = JSON.parse(localStorage.getItem("ScreenViewWidthPixel"));
    let X = 0, Y = 1;
    const CCTime = GetCurrentTime();

    if (GetquerySelectorAll[1] !== undefined) {
        let ForIndex = GetBScreenViewHigh * GetBScreenViewWidth;
        for (let i = 0; i < ForIndex; i++) {
            let Postion = CoordinateSystem2D_S(GetBScreenViewHigh, GetBScreenViewWidth, Y, X);

            let rgb = [];

            rgb.push({
                "r": RandomNum(1, 255),
                "g": RandomNum(1, 255),
                "b": RandomNum(1, 255)
            });

            if (Postion !== null) {
                GetquerySelectorAll[Postion].style.background = `rgb(${rgb[0].r},${rgb[0].g},${rgb[0].b})`;
            }
            X++;
            if (X > GetBScreenViewWidth) {
                Y++;
                X = 0;
            }
        }
    }

    const CSTime = GetCurrentTime();
    let Time = CSTime - CCTime;
    console.log("全像素计算耗时:" + Time + "ms");

    return true;
}