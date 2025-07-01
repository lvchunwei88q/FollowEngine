function RgbToArray(rgbStr) {
    const matches = rgbStr.match(/\d+(\.\d+)?/g);
    return matches ? matches.map(Number) : [];
}

// 定义变量的定义类

function saturate(x) {//saturate范围是0-255
    return Math.max(0, Math.min(255, x));
}
function saturateN(vec) {//saturate范围是0-255
    return vec.map(x => Math.max(0, Math.min(255, x)));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpN(a, b, t) {
    // 新增：验证输入是否为数组
    if (!Array.isArray(a) || !Array.isArray(b)) {
        throw new Error("lerp() requires array inputs");
    }
    // 检查维度一致性
    if (a.length !== b.length) {
        throw new Error("Vectors must have same dimension");
    }

    // 处理标量t
    if (typeof t === 'number') {
        return a.map((val, i) => val + (b[i] - val) * t);
    }
    // 处理向量t（每个分量独立插值）
    else if (Array.isArray(t) && t.length === a.length) {
        return a.map((val, i) => val + (b[i] - val) * t[i]);
    } else {
        throw new Error("t must be number or vector of same dimension");
    }
}

/**
 * 一维点积（实际就是乘法）
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function dot(a, b) {
    return a * b;
}

//通用 N 维向量点积
function dotN(a, b) {
    if (a.length !== b.length) throw new Error("Vectors must have same dimension");
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;
}

function pow(x, exponent) {
    return Math.pow(x, exponent);
}

function powN(vec, exponent) {
    // 检查输入合法性
    if (!Array.isArray(vec)) throw new Error("Input must be an array");
    if (typeof exponent !== 'number' && !Array.isArray(exponent)) {
        throw new Error("Exponent must be number or array");
    }

    // 标量指数（所有分量用同一指数）
    if (typeof exponent === 'number') {
        return vec.map(x => Math.pow(x, exponent));
    }
    // 向量指数（每个分量独立指数）
    else {
        if (vec.length !== exponent.length) {
            throw new Error("Vector and exponent dimension mismatch");
        }
        return vec.map((x, i) => Math.pow(x, exponent[i]));
    }
}

function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

// Gamma校正
function toSRGB(v) {
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1/2.4) - 0.055;
}