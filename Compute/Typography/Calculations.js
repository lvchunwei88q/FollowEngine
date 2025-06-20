let WarningViewport, WarningViewportloop = true;

function CalculatePercentageTick(Debug) {
    let BCalculatePercentageDebug = Debug;
    const ViewportWidth = document.documentElement.clientWidth;  // 视口宽度（含滚动条）
    const ViewportHeight = document.documentElement.clientHeight;
    //这里Get就是整数
    //console.log(`Viewport Width: ${ViewportWidth}, Height: ${ViewportHeight}`);

    if (ViewportWidth < 650 || ViewportHeight < 350) {
        if (WarningViewportloop) {
            WarningViewportloop = false;
            WarningViewport = setInterval(function () {
                ShowToast("设置窗口过于小!", "warning");
            }, 500);
        }
    } else {
        WarningViewportloop = true;
        if (WarningViewport) {
            clearInterval(WarningViewport);
        }
    }

    if (BViewWidth !== ViewportWidth) {
        BViewWidth = ViewportWidth;
        //这里需要取出90和10
        let W90, W10;
        W90 = BViewWidth / 100 * 90;
        W10 = BViewWidth - W90;

        if (isDecimal(W90)) { // 判断是否是小数
            // 初始化变量
            let NoDecimalW90 = "", DecimalW90 = "", BDecimal90 = false;
            let NoDecimalW10 = "", DecimalW10 = "", BDecimal10 = false;

            // 处理 W90
            W90 = String(W90);
            for (let i = 0; i < W90.length; i++) {
                const item = W90[i];
                if (item === '.') {
                    BDecimal90 = true; // 遇到小数点后，后续字符属于小数部分
                } else if (BDecimal90) {
                    DecimalW90 += item;
                } else {
                    NoDecimalW90 += item;
                }
            }

            // 处理 W10
            W10 = String(W10);
            for (let i = 0; i < W10.length; i++) {
                const item = W10[i];
                if (item === '.') {
                    BDecimal10 = true;
                } else if (BDecimal10) {
                    DecimalW10 += item;
                } else {
                    NoDecimalW10 += item;
                }
            }

            if (BCalculatePercentageDebug) {
                console.log(NoDecimalW90 + (DecimalW90 ? "." + DecimalW90 : "")); // 只有小数部分非空时才加小数点
                console.log(NoDecimalW10 + (DecimalW10 ? "." + DecimalW10 : ""));
            }

            NoDecimalW90 = Number(NoDecimalW90);
            DecimalW90 = Number(DecimalW90);
            NoDecimalW10 = Number(NoDecimalW10);
            DecimalW10 = Number(DecimalW10);

            NoDecimalW90 += DecimalW90 ? DecimalW90 >= 0.5 ? 1 : 0 : "";
            //NoDecimalW10 += DecimalW10 ? DecimalW10 >=0.5 ? 1 : 0 : "";这里为了留出排版空地

            if (BCalculatePercentageDebug) {
                console.log(NoDecimalW90 + "-" + NoDecimalW10); // 只有小数部分非空时才加小数点
            }

            W90 = NoDecimalW90;
            W10 = NoDecimalW10;
        }

        if (BCalculatePercentageDebug) {
            console.log("MainInterfaceWidth:" + W90 + "-MenuWidth:" + W10 + "-BViewWidth:" + BViewWidth);
        }
        BScreenViewWidth = W90;
        document.getElementById("MainInterface").style.width = `${W90}px`;
        document.getElementById("Menu").style.width = `${W10}px`;
        LoadRenderingInterface();
    }
    if (BViewHigh !== ViewportHeight) {
        BViewHigh = ViewportHeight;
        BScreenViewHigh = BViewHigh;
        document.getElementById("MainInterface").style.height = `${BViewHigh}px`;
        document.getElementById("Menu").style.height = `${BViewHigh}px`;
        if (BCalculatePercentageDebug) {
            console.log("BViewHigh:" + BViewHigh);
        }
        LoadRenderingInterface();
    }
}