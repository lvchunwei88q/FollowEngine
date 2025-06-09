function MainRender(){
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

    SpatialTransformation();//第一步从模型空间转换到世界空间，从世界空间转换到视图空间
    
}

function SpatialTransformation(){
    let GetBScreenViewHigh = BScreenViewHigh;
    let GetBScreenViewWidth = BScreenViewWidth;
    if(GetBScreenViewHigh !== 0 && GetBScreenViewWidth !== 0){
        //GetJSON
        ReadJSON_Editor("Moudels/Cube.json")
            .then(data => {
                Space2D(data);
            })
            .catch(err => {
                console.error("失败:", err);
            });
    }
}