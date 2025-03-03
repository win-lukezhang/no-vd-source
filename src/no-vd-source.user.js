// ==UserScript==
// @name         去除bilibili追踪URL参数
// @namespace    no-vd-source
// @version      1.1
// @description  去除 vd_source 和 spm_id_from。我不想让bilibili知道我为什么访问这个网页！
// @author       Luke Zhang
// @license      GPL-3.0-or-later
// @homepage     https://github.com/win-lukezhang/no-vd-source
// @updateURL    https://github.com/win-lukezhang/no-vd-source/raw/refs/heads/main/src/no-vd-source.user.js
// @downloadURL  https://github.com/win-lukezhang/no-vd-source/raw/refs/heads/main/src/no-vd-source.user.js
// @match        *://*/*
// @grant        none
// @icon         https://www.bilibili.com/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // 通用参数移除函数（同时处理两个参数）
    function removeTrackingParams(url) {
        try {
            const urlObj = new URL(url);
            let changed = false;

            // 同时检查两个参数
            if (urlObj.searchParams.has('vd_source')) {
                urlObj.searchParams.delete('vd_source');
                changed = true;
            }
            if (urlObj.searchParams.has('spm_id_from')) {
                urlObj.searchParams.delete('spm_id_from');
                changed = true;
            }

            return changed ? urlObj.toString() : url;
        } catch(e) {
            console.warn('URL解析失败:', e);
            return url;
        }
    }

    // 当前页面重定向逻辑（立即执行）
    (function checkAndRedirect() {
        const cleanUrl = removeTrackingParams(window.location.href);
        if (cleanUrl !== window.location.href) {
            window.location.replace(cleanUrl);  // 无痕重定向
            return;  // 中止后续执行
        }
    })();

    // 链接处理逻辑
    function processLinks() {
        document.querySelectorAll('a[href]').forEach(el => {
            const original = el.href;
            const cleaned = removeTrackingParams(original);
            if (cleaned !== original) {
                el.href = cleaned;
            }
        });
    }

    // 动态内容监听
    const observer = new MutationObserver(mutations => {
        if (mutations.some(m => m.addedNodes.length)) {
            processLinks();
        }
    });

    // 初始化监听和首次处理
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    processLinks();
})();
