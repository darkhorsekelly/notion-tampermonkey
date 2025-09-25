// ==UserScript==
// @name         Notion Tiny H1 + Auto Details
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Reduces H1 size, hides controls, opens details pane, adds section colors
// @author       You
// @match        https://www.notion.so/*
// @match        https://*.notion.site/*
// @updateURL    https://raw.githubusercontent.com/darkhorsekelly/notion-tampermonkey/main/notion-auto-enhance.js
// @downloadURL  https://raw.githubusercontent.com/darkhorsekelly/notion-tampermonkey/main/notion-auto-enhance.js
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS to make H1 tiny with minimal vertical space
    GM_addStyle(`
        /* Target all H1 elements and title blocks */
        h1,
        h1.notion-header-block,
        .notion-header-block,
        [placeholder="Untitled"][contenteditable],
        .notion-title-block,
        [data-block-id] h1,
        .notion-page-content h1,
        [data-content-editable-root="true"] h1 {
            font-size: 14px !important;
            line-height: 1.1 !important;
            margin-top: 2px !important;
            margin-bottom: 2px !important;
            padding-top: 2px !important;
            padding-bottom: 2px !important;
        }

        /* Remove extra spacing around H1 containers */
        .notion-header-block,
        .notion-title-block,
        div:has(> h1) {
            margin-top: 0 !important;
            margin-bottom: 4px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }

        /* Reduce spacing for the page title specifically */
        [data-block-id]:has(h1),
        .notion-page-block:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }

        /* Hide page controls */
        .notion-page-controls {
            display: none !important;
        }

        /* Property panel optimizations */
        div[role="table"][aria-label="Page properties"] {
            margin: 0 !important;
        }

        div[role="row"] {
            margin-bottom: 1px !important;
        }

        div[role="row"] > div:first-child > div > div[style*="height: 34px"] {
            height: 24px !important;
            align-items: center !important;
        }

        div[role="cell"] > div > div {
            font-size: 12px !important;
            line-height: 16px !important;
        }

        div[role="cell"] {
            padding-top: 1px !important;
            padding-bottom: 1px !important;
        }

        div[data-testid="property-value"] {
            min-height: 24px !important;
            padding-top: 2px !important;
            padding-bottom: 2px !important;
            font-size: 12px !important;
            line-height: 16px !important;
        }

        div[data-testid="property-value"] > div {
            line-height: 16px !important;
        }

        div[role="button"][aria-expanded="true"],
        div[role="button"][aria-expanded="false"] {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            margin-bottom: 4px !important;
        }

        div[style*="cursor: grab"] {
            margin-bottom: 8px !important;
        }

        div[role="cell"] svg {
            width: 12px !important;
            height: 12px !important;
        }

        div[role="row"] > div:first-child {
            padding-right: 2px !important;
        }

        div[data-testid="property-value"] > div > div[style*="rgb(168, 164, 156)"] {
            min-height: 20px !important;
            padding-top: 1px !important;
            padding-bottom: 1px !important;
        }

        .notion-selectable:has([data-testid="property-value"]) {
            margin-bottom: 0 !important;
            padding: 0 !important;
        }

        div[role="cell"],
        div[data-testid="property-value"] {
            border-radius: 2px !important;
        }

        div[role="row"] > div:first-child {
            align-items: center !important;
            padding-top: 0 !important;
        }

        div[role="cell"] + div[role="cell"] {
            align-items: center !important;
        }

        div[role="cell"] > div > div > div {
            display: flex !important;
            align-items: center !important;
        }

        /* Property section background colors */
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(1) {
            background-color: #f5f0e8 !important;
        }
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(2) {
            background-color: #fff9e6 !important;
        }
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(3) {
            background-color: #fff2e6 !important;
        }
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(4) {
            background-color: #e6f3ff !important;
        }
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(5) {
            background-color: #f0e6ff !important;
        }
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(6) {
            background-color: #f5f5f5 !important;
        }
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(7) {
            background-color: #e8e8e8 !important;
        }
    `);

    function isDetailsPaneOpen() {
        const sidebar = document.querySelector('.notion-update-sidebar');
        if (sidebar) return true;

        const hideButton = Array.from(document.querySelectorAll('div[role="button"]'))
            .find(el => el.textContent?.trim() === 'Hide details');
        if (hideButton) return true;

        return false;
    }

    function openDetailsPane() {
        if (isDetailsPaneOpen()) {
            console.log('[Notion] Details pane already open');
            return;
        }

        const buttons = document.querySelectorAll('div[role="button"][tabindex="0"]');
        for (const btn of buttons) {
            const text = btn.textContent?.trim();
            const ariaLabel = btn.getAttribute('aria-label');

            if (text === 'View details' || ariaLabel === 'View/hide details') {
                console.log('[Notion] Found details button, clicking...');
                btn.click();
                console.log('[Notion] Opened details pane');
                return;
            }
        }

        console.log('[Notion] Could not find View details button');
    }

    function expandAllToggles() {
        const collapsedToggles = document.querySelectorAll('div[role="button"][aria-expanded="false"][aria-label="Open"]');

        if (collapsedToggles.length === 0) {
            console.log('[Notion] No collapsed toggles found');
            return;
        }

        console.log(`[Notion] Found ${collapsedToggles.length} collapsed toggles`);

        collapsedToggles.forEach((toggle, index) => {
            const hasArrowIcon = toggle.querySelector('svg.arrowCaretDownFillSmall');

            if (hasArrowIcon) {
                setTimeout(() => {
                    console.log(`[Notion] Expanding toggle ${index + 1}`);
                    toggle.click();
                }, index * 50);
            }
        });
    }

    setTimeout(() => {
        openDetailsPane();
        setTimeout(expandAllToggles, 2000);
    }, 1500);

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(() => {
                openDetailsPane();
                setTimeout(expandAllToggles, 2000);
            }, 1500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[Notion] Script loaded - H1 reduced, controls hidden, details auto-open, toggles auto-expand, property panel optimized with section colors');

})();