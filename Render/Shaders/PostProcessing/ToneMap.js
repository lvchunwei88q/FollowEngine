//Tonemap色调映射函数
function Tonemap(
    color,
    TExposure,     // 范围 [0.1, 5.0]
    TContrast,      // 范围 [-100, 100]
    TSaturation,     // 范围 [-100, 100]
    TDownSampleScale // 混合度 [0 , 1]
)
{
    //首先需要clamp一下
    TExposure = clamp(TExposure,0.1,5.0);
    TContrast = clamp(TContrast,-100,100);
    TSaturation = clamp(TSaturation,-100,100);
    TDownSampleScale = clamp(TDownSampleScale,0,1);

    // 辅助函数
    const vec3 = (x = 0) => [x, x, x];
    const applyEach = (v, fn) => [fn(v[0]), fn(v[1]), fn(v[2])];

    // 曝光调整
    color = applyEach(color, x => x * TExposure);

    // ===== 2. 色调映射核心 =====
    let c0 = vec3(), c1 = vec3();
    for (let i = 0; i < 3; i++) {
        const c = color[i];
        c0[i] = (1.36 * c + 0.047) * c;
        c1[i] = (0.93 * c + 0.56) * c + 0.14;
    }

    let C01 = vec3();
    for (let i = 0; i < 3; i++) {
        C01[i] = c1[i] !== 0 ? c0[i] / c1[i] : 0;
    }

    // ===== 3. 对比度调整 =====
    const contrastExponent = lerp(0.1, 10.0, (TContrast + 100) / 200);
    let result = applyEach(C01, v =>
        TContrast < 0
            ? 1 - Math.pow(1 - v, contrastExponent)
            : Math.pow(v, contrastExponent)
    );

    // ===== 4. 饱和度调整 =====
    const saturationFactor = lerp(-1.0, 2.0, (TSaturation + 100) / 200);
    const srgb = applyEach(result, toSRGB);
    const luminance = dotN(srgb, [0.299, 0.587, 0.114]);

    if (saturationFactor < 0) {
        const inverted = applyEach(result, v => 1 - v);
        result = lerpN(inverted, result, saturationFactor + 1);
    } else {
        result = lerpN(vec3(luminance), result, saturationFactor);
    }

    // ===== 5. 最终输出 =====
    return saturateN(lerpN(color, result, TDownSampleScale));
}