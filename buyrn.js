// ==UserScript==
// @name         自动抢购racknerd vps
// @namespace    https://my.racknerd.com
// @version      0.1
// @description  buy racknerd vps
// @author       dabo
// @match        *://my.racknerd.com/*
// @grant        none
// ==/UserScript==

window.onload = function() {
    const CONFIG = {
        forcedReload: false,
        reloadDelay: 1000,
        targetUrl: "https://my.racknerd.com/cart.php?a=add&pid=5999", // 目标产品ID
        locationId: "60", // 洛杉矶机房ID
        errorPages: [
            '502 Bad Gateway',
            '504 Gateway Time-out',
            '503 Service Temporarily Unavailable',
            '500 Internal Server Error'
        ]
    };

    // 统一处理错误页面刷新
    if (CONFIG.errorPages.includes(document.title)) {
        setTimeout(() => window.location.reload(CONFIG.forcedReload), CONFIG.reloadDelay);
        return;
    }

    const currentUrl = document.URL;
    // 页面处理函数映射
    const pageHandlers = {
        'black-friday': () => {
            const cartContent = document.getElementById("order-standard_cart")?.innerHTML;
            if (cartContent?.includes("Out of Stock")) {
                console.log("商品缺货，准备刷新...");
                setTimeout(() => window.location.reload(CONFIG.forcedReload), CONFIG.reloadDelay);
            }
        },
        'confproduct': () => {
            const locationSelect = document.getElementById("inputConfigOption1");
            if (locationSelect) {
                locationSelect.value = CONFIG.locationId;
                locationSelect.dispatchEvent(new Event('change', { bubbles: true }));
                console.log("已选择机房位置：洛杉矶");
            }
            document.getElementById("btnCompleteProductConfig")?.click();
        },
        'cart.php?a=view': () => {
            document.getElementById("checkout")?.click();
        },
        'cart.php?a=checkout': () => {
            document.getElementById("iCheck-accepttos")?.click();
            document.getElementById("btnCompleteOrder")?.click();
        },
        'shared-hosting': () => {
            console.log(`1秒后跳转到目标商品页面: ${CONFIG.targetUrl}`);
            setTimeout(() => window.location.href = CONFIG.targetUrl, CONFIG.reloadDelay);
        }
    };

    // 根据URL执行对应处理函数
    Object.entries(pageHandlers).forEach(([key, handler]) => {
        if (currentUrl.includes(key)) {
            handler();
        }
    });
};
