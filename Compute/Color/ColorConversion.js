function ConvertHexToRGBA(hex) { //颜色转换 -> HexToRGBA

    // 去除 # 号，处理简写形式（如 "F00" 转为 "FF0000"）
    let hexClean = hex.replace('#', '');
    if (hexClean.length === 3) {
        hexClean = hexClean.split('').map(c => c + c).join('');
    }

    // 提取 R、G、B 分量
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);

    // 组合为 RGB 字符串（默认 Alpha=1.0）
    const rgb = {
        r: r,
        g: g,
        b: b
    };

    // 返回结果
    return rgb;
}

function ConvertRGBToHex(rgb) { //颜色转换 -> RGBAToHex
    // 确保 r, g, b 在 0-255 范围内
    const clamp = (value) => Math.min(255, Math.max(0, value));

    // 提取 R, G, B 值（支持对象或独立参数）
    let r, g, b;
    if (typeof rgb === 'object') {
        r = clamp(rgb.r);
        g = clamp(rgb.g);
        b = clamp(rgb.b);
    } else if (arguments.length >= 3) {
        r = clamp(arguments[0]);
        g = clamp(arguments[1]);
        b = clamp(arguments[2]);
    } else {
        throw new Error("Invalid RGB input");
    }

    // 转换为 2 位十六进制，不足补零
    const toHex = (c) => c.toString(16).padStart(2, '0').toUpperCase();

    // 组合成 Hex 颜色（如 #FF0000）
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}