// ==UserScript==
// @name         去除 vd_source
// @namespace    no-vd-source
// @version      1.0
// @description  我不想让bilibili知道我为什么访问这个网页
// @author       Luke Zhang
// @license      GPL-3.0-or-later
// @homepage     https://github.com/win-lukezhang/no-vd-source
// @updateURL    https://github.com/win-lukezhang/no-vd-source/raw/refs/heads/main/src/no-vd-source.user.js
// @downloadURL  https://github.com/win-lukezhang/no-vd-source/raw/refs/heads/main/src/no-vd-source.user.js
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 通用参数移除函数
    function removeVdSource(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.searchParams.has('vd_source')) {
                urlObj.searchParams.delete('vd_source');
                return urlObj.toString();
            }
        } catch(e) {
            console.warn('URL解析失败:', e);
        }
        return url;
    }

    // 当前页面重定向逻辑
    (function checkCurrentPage() {
        const cleanUrl = removeVdSource(window.location.href);
        if (cleanUrl !== window.location.href) {
            window.location.replace(cleanUrl);  // 使用replace避免历史记录残留
            return;  // 重定向时中止后续执行
        }
    })();

    // 链接处理逻辑
    function processLinks() {
        document.querySelectorAll('a[href]').forEach(el => {
            const original = el.href;
            const cleaned = removeVdSource(original);
            if (cleaned !== original) {
                el.href = cleaned;
            }
        });
    }

    // 初始化处理 + 动态内容监听
    const observer = new MutationObserver(mutations => {
        if (!mutations.some(m => m.addedNodes.length)) return;
        processLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processLinks(); // 初始处理
})();
