// ==UserScript==
// @name         自动抢购claw vps
// @namespace    https://claw.cloud/
// @version      0.1
// @description  buy claw vps
// @author       dabo
// @match        *://claw.cloud/*
// @grant        none
// ==/UserScript==

window.onload = function() {
    const CONFIG = {
        forcedReload: false,
        reloadDelay: 1000,
        targetUrl: "https://claw.cloud/cart.php?a=confproduct&i=0", // 目标产品ID
        cycle: "annually",
        locationId: "99", //东京344 新加坡99 香港100
        promoCode: "7CLAW", // 添加优惠码配置
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
            // 选择机房位置
            // 先取消所有机房位置的选中状态
            document.querySelectorAll('input[name="configoption[46]"]').forEach(radio => {
                radio.checked = false;
                const radioStyled = radio.closest('.radio-styled');
                const parentLabel = radio.closest('label');
                const panelCheck = radio.closest('.panel-check');

                if (radioStyled) radioStyled.classList.remove('checked');
                if (parentLabel) parentLabel.classList.remove('checked');
                if (panelCheck) panelCheck.classList.remove('checked');
            });
            const locationRadio = document.querySelector(`input[name="configoption[46]"][value="${CONFIG.locationId}"]`);
            if (locationRadio) {
                // 选中单选按钮
                locationRadio.checked = true;
                ['change', 'click', 'input'].forEach(eventType => {
                    locationRadio.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                // 处理父级元素的样式
                const radioStyled = locationRadio.closest('.radio-styled');
                if (radioStyled) {
                    radioStyled.classList.add('checked');
                }

                const parentLabel = locationRadio.closest('label');
                if (parentLabel) {
                    parentLabel.classList.add('checked');
                }

                const panelCheck = locationRadio.closest('.panel-check');
                if (panelCheck) {
                    panelCheck.classList.add('checked');
                }

                console.log(`已选择机房位置：${CONFIG.locationId}`);
            } else {
                console.log("未找到指定的机房位置选项");
            }

            // 选择年付周期
            // 先取消所有周期的选中状态
            document.querySelectorAll('input[name="billingcycle"]').forEach(radio => {
                radio.checked = false;
                const radioStyled = radio.closest('.radio-styled');
                const parentLabel = radio.closest('label');
                const panelCheck = radio.closest('.panel-check');

                if (radioStyled) radioStyled.classList.remove('checked');
                if (parentLabel) parentLabel.classList.remove('checked');
                if (panelCheck) panelCheck.classList.remove('checked');
            });

            const annualRadio = document.querySelector('input[name="billingcycle"][value="annually"]');
            if (annualRadio) {
                // 选中单选按钮
                annualRadio.checked = true;
                ['change', 'click', 'input'].forEach(eventType => {
                    annualRadio.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                // 处理父级元素的样式
                const radioStyled = annualRadio.closest('.radio-styled');
                if (radioStyled) {
                    radioStyled.classList.add('checked');
                }

                const parentLabel = annualRadio.closest('label');
                if (parentLabel) {
                    parentLabel.classList.add('checked');
                }

                const panelCheck = annualRadio.closest('.panel-check');
                if (panelCheck) {
                    panelCheck.classList.add('checked');
                }

                console.log("已选择年付周期");
            } else {
                console.log("未找到年付周期选项");
            }

            // 点击结账按钮
            const checkoutButton = document.querySelector('button.btn-checkout');
            if (checkoutButton) {
                checkoutButton.click();
                console.log("已点击结账按钮");
            } else {
                console.log("未找到结账按钮");
            }
        },
        'cart.php?a=view': () => {
            document.getElementById("checkout")?.click();
        },
        'cart.php?a=checkout': () => {
            // 输入优惠码
            const promoInput = document.getElementById("inputPromotionCode");
            if (promoInput && CONFIG.promoCode) {
                promoInput.value = CONFIG.promoCode;
                promoInput.dispatchEvent(new Event('input', { bubbles: true }));

                // 点击验证按钮
                const validateButton = document.querySelector('button[name="validatepromo"]');
                if (validateButton) {
                    setTimeout(() => {
                        validateButton.click();
                        console.log("已输入优惠码并点击验证按钮");
                    }, 2000);
                    console.log("已输入优惠码并点击验证按钮");

                    // 等待一段时间后选择支付方式并继续下一步
                    setTimeout(() => {
                        // 清除所有支付方式的选中状态
                        document.querySelectorAll('input[name="__paymentmethod"]').forEach(radio => {
                            radio.checked = false;
                            const radioStyled = radio.closest('.radio-styled');
                            const parentLabel = radio.closest('label');
                            const panelCheck = radio.closest('.panel-check');

                            if (radioStyled) radioStyled.classList.remove('checked');
                            if (parentLabel) parentLabel.classList.remove('checked');
                            if (panelCheck) {
                                panelCheck.classList.remove('checked');
                                // 移除可能的支付方式特定类
                                panelCheck.classList.remove('antom', 'alipay_cn', 'alipay_hk');
                            }
                        });

                        // 选择支付宝支付方式
                        const alipayRadio = document.querySelector('input[name="__paymentmethod"][value="alipay_cn"]');
                        if (alipayRadio) {
                            // 选中支付宝
                            alipayRadio.checked = true;
                            ['change', 'click', 'input'].forEach(eventType => {
                                alipayRadio.dispatchEvent(new Event(eventType, { bubbles: true }));
                            });

                            // 添加选中样式
                            const radioStyled = alipayRadio.closest('.radio-styled');
                            if (radioStyled) radioStyled.classList.add('checked');

                            const parentLabel = alipayRadio.closest('label');
                            if (parentLabel) parentLabel.classList.add('checked');

                            const panelCheck = alipayRadio.closest('.panel-check');
                            if (panelCheck) {
                                panelCheck.classList.add('checked');
                                panelCheck.classList.add('alipay_cn');
                            }

                            console.log("已选择支付宝支付方式");
                        }

                        // 勾选服务条款
                        const tosCheckbox = document.querySelector('#tos-checkbox input[data-tos-checkbox]');
                        if (tosCheckbox) {
                            // 选中复选框
                            tosCheckbox.checked = true;
                            ['change', 'click', 'input'].forEach(eventType => {
                                tosCheckbox.dispatchEvent(new Event(eventType, { bubbles: true }));
                            });

                            // 处理父级元素的样式
                            const checkboxStyled = tosCheckbox.closest('.checkbox-styled');
                            if (checkboxStyled) {
                                checkboxStyled.classList.add('checked');
                            }

                            const parentLabel = tosCheckbox.closest('label');
                            if (parentLabel) {
                                parentLabel.classList.add('checked');
                            }

                            // 隐藏错误提示（如果存在）
                            const errorAlert = document.querySelector('#tos-checkbox + .alert-danger');
                            if (errorAlert) {
                                errorAlert.classList.add('hidden');
                            }

                            console.log("已勾选服务条款");
                        } else {
                            console.log("未找到服务条款复选框");
                        }

                        // 点击结账按钮
                        const checkoutButton = document.querySelector('button.btn-checkout');
                        if (checkoutButton) {
                            //checkoutButton.click();
                            console.log("已点击结账按钮");
                        } else {
                            console.log("未找到结账按钮");
                        }
                    }, 3000);
                    return;
                }
            }

            // 如果没有优惠码或输入失败，直接进行下一步
            //document.getElementById("iCheck-accepttos")?.click();
            //document.getElementById("btnCompleteOrder")?.click();
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
