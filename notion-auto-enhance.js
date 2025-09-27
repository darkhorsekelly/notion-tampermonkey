// ==UserScript==
// @name         Notion Tiny H1 + Auto Details
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Reduces H1 size, hides controls, opens details pane, adds section colors, decreases vertical height, swap page content order, hover controls, Rolodex displays full content, move dialogs up
// @author       You
// @match        https://www.notion.so/*
// @match        https://*.notion.site/*
// @updateURL    https://raw.githubusercontent.com/darkhorsekelly/notion-tampermonkey/main/notion-auto-enhance.js
// @downloadURL  https://raw.githubusercontent.com/darkhorsekelly/notion-tampermonkey/main/notion-auto-enhance.js
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

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
            line-height 1.2 !important;
            margin-top: 2px !important;
            margin-bottom: 2px !important;
            padding-top: 2px !important;
            padding-bottom: 2px !important;
        }

        div[role="dialog"] {
            top: -15px !important;
        }

        aside[aria-label="Info"] div[style*="position: absolute"][style*="inset-inline-end: 6px"] {
            top: -2px !important;
        }

        /* Remove padding-bottom: 20px from the container with padding-inline-start: 0px - ONLY in sidebar */
            aside[aria-label="Info"] div[style*="padding-inline-start: 0px"][style*="padding-bottom: 20px"] {
            padding-bottom: 0 !important;
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

        /* Property panel optimizations - ONLY in sidebar */
        aside[aria-label="Info"] div[role="table"][aria-label="Page properties"] {
            margin: 0 !important;
        }

        /* Remove margin-bottom from all children of page properties table - ONLY in sidebar */
        aside[aria-label="Info"] div[role="table"][aria-label="Page properties"] > * {
            margin-bottom: 0 !important;
        }

        /* More specific targeting for div children with margin-bottom - ONLY in sidebar */
        aside[aria-label="Info"] div[role="table"][aria-label="Page properties"] > div[style*="margin-bottom"] {
            margin-bottom: 0 !important;
        }

        /* Target by the specific structure - div containers with cursor: grab - ONLY in sidebar */
        aside[aria-label="Info"] div[role="table"][aria-label="Page properties"] > div[style*="cursor: grab"] {
            margin-bottom: 0 !important;
        }

        /* Remove padding-top from parents of page properties tables - ONLY in sidebar */
        aside[aria-label="Info"] div[style*="padding-top: 8px"]:has(> div[role="table"][aria-label="Page properties"]) {
            padding-top: 0 !important;
        }

        /* Row and cell styling - ONLY in sidebar */
        aside[aria-label="Info"] div[role="row"] {
            margin-bottom: 1px !important;
        }

        aside[aria-label="Info"] div[role="row"] > div:first-child > div > div[style*="height: 34px"] {
            height: 14px !important;
            align-items: center !important;
        }

        aside[aria-label="Info"] div[role="cell"] > div > div {
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        aside[aria-label="Info"] div[role="cell"] {
            padding-top: 1px !important;
            padding-bottom: 1px !important;
        }

        /* Target parent div of role="cell" elements - ONLY in sidebar */
        aside[aria-label="Info"] div[role="row"]:has(> div[role="cell"]) {
            line-height: 1.2 !important;
            font-size: 14px !important;
            padding: 1px 0 !important;
            /* background-color: rgba(255, 255, 0, 0.1) !important; Very light yellow for debugging */
        }

        /* Grid-based layout reordering - target the layout-content that contains notion-page-content - OUTSIDE sidebar */
        div.layout > div:has(> div.notion-page-content) {
            grid-row-start: 4 !important;
        }

        /* Ensure all other children flow naturally after the repositioned element - OUTSIDE sidebar */
        div.layout > *:not(:has(> div.notion-page-content)) {
            grid-row-start: auto !important;
        }

        /* Target the third child of div.layout with class layout-content - OUTSIDE sidebar */
        div.layout > :nth-child(3).layout-content {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
        }

        /* Property value styling - ONLY in sidebar */
        aside[aria-label="Info"] div[data-testid="property-value"] {
            min-height: 14px !important;

            height: auto !important; /* Allow height to grow for content-rich buttons */
            padding-top: 2px !important; /* Add minimal padding for content */
            padding-bottom: 2px !important;
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        aside[aria-label="Info"] div[data-testid="property-value"] > div {
            line-height: 1.2 !important; 
        }

        /* For content-rich property values that contain spans, use more generous spacing */
        div[data-testid="property-value"]:has(span) {
            height: auto !important;
            min-height: 20px !important; /* Allow more height for content */
            padding-top: 4px !important;
            padding-bottom: 4px !important;
        }

        div[data-testid="property-value"] > div:has(span) {
            line-height: 1.2 !important;
        }

        /* Try multiple approaches to target the 34px height buttons - ONLY in sidebar */
        aside[aria-label="Info"] div[role="button"][tabindex="0"][style*="height: 34px"] {
            height: 24px !important;
        }

        aside[aria-label="Info"] div[role="button"][style*="height: 34px"][style*="padding-inline: 6px"] {
            height: 24px !important;
            padding-inline: 3px !important;
        }

        aside[aria-label="Info"] div[role="button"][style*="gap: 6px"][style*="height: 34px"] {
            height: 24px !important;
            gap: 3px !important;
        }

        /* Target the specific div with padding-inline: 6px that contains buttons - ONLY in sidebar */
        aside[aria-label="Info"] div[style*="padding-inline: 6px"] div[role="button"] {
            padding-inline: 0px !important;
        }

        /* Target ONLY elements within the UpdateSidebar context */
        aside[aria-label="Info"] div[style*="padding-inline: 6px"] {
            padding-inline: 0px !important;
        }

        /* More specific: within the sidebar tabpanel */
        #UpdateSidebar-tabpanel-2 div[style*="padding-inline: 6px"] {
            padding-inline: 0px !important;
        }

        /* Target buttons specifically within sidebar property cells */
        aside[aria-label="Info"] div[role="cell"] div[role="button"][style*="padding-inline: 6px"] {
            padding-inline: 0px !important;
        }

        /* Only target expand/collapse buttons within property cells - ONLY in sidebar */
        aside[aria-label="Info"] div[role="cell"] div[role="button"][aria-expanded="true"],
        aside[aria-label="Info"] div[role="cell"] div[role="button"][aria-expanded="false"] {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            margin-bottom: 0px !important;
            height: 14px !important;
            min-height: 14px !important;
        }

        /* Target all buttons in property cells - scoped properly - ONLY in sidebar */
        aside[aria-label="Info"] div[role="cell"] div[role="button"] {
            height: 14px !important;
            min-height: 14px !important;
            padding: 0px !important;
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        /* Target nested buttons within property values (like status buttons) - scoped - ONLY in sidebar */
        aside[aria-label="Info"] div[role="cell"] div[data-testid="property-value"] div[role="button"] {
            height: 14px !important;
            min-height: 14px !important;
            padding: 0px !important;
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        /* Target span elements inside property value buttons - scoped to cells - ONLY in sidebar */
        aside[aria-label="Info"] div[role="cell"] div[data-testid="property-value"] div[role="button"] span {
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        /* Target ONLY buttons within sidebar property cells - with specific inline styles */
        aside[aria-label="Info"] div[role="cell"] div[role="button"][style*="height: 24px"] {
            height: auto !important;
            padding: 0px !important;
            font-size: 14px !important;
            line-height: 1.2 !important;
        }

        /* Target ONLY buttons within sidebar property cells - with padding-inline: 6px */
        aside[aria-label="Info"] div[role="cell"] div[role="button"][style*="padding-inline: 6px"] {
            padding: 0px !important;
            height: auto !important;
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        /* Target ONLY buttons within sidebar property cells - with font-size: 14px */
        aside[aria-label="Info"] div[role="cell"] div[role="button"][style*="font-size: 14px"] {
            font-size: 14px !important;
            line-height 1.2 !important;
        }

        /* Ultra-specific: ONLY buttons within sidebar property-value containers */
        aside[aria-label="Info"] div[data-testid="property-value"] div[role="button"][style*="height: 24px"],
        aside[aria-label="Info"] div[data-testid="property-value"] div[role="button"][style*="padding-inline: 6px"],
        aside[aria-label="Info"] div[data-testid="property-value"] div[role="button"][style*="font-size: 14px"] {
            height: 14px !important;
            padding: 0px !important;
            font-size: 14px !important;
            line-height 1.2 !important;
            min-height: 14px !important;
        }

        /* Sidebar-specific styling - ONLY in sidebar */
        aside[aria-label="Info"] div[style*="cursor: grab"] {
            margin-bottom: 8px !important;
        }

        aside[aria-label="Info"] div[role="cell"] svg {
            width: 14px !important;
            height: 14px !important;
        }

        aside[aria-label="Info"] div[data-testid="property-value"] > div > div[style*="rgb(168, 164, 156)"] {
            min-height: 14px !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }

        aside[aria-label="Info"] .notion-selectable:has([data-testid="property-value"]) {
            margin-bottom: 0 !important;
            padding: 0 !important;
        }

        aside[aria-label="Info"] div[role="cell"],
        aside[aria-label="Info"] div[data-testid="property-value"] {
            border-radius: 2px !important;
        }

        /* Remove padding-top from div with both .notion-scroller and .vertical classes - ONLY in sidebar */
        aside[aria-label="Info"] div.notion-scroller.vertical {
            padding-top: 0 !important;
        }

        /* Row and cell styling - ONLY in sidebar */
        aside[aria-label="Info"] div[role="row"] > div:first-child {
            align-items: center !important;
            padding-top: 0 !important;
            padding-right: 2px !important;
            height: 14px !important;
        }

        aside[aria-label="Info"] div[role="cell"] + div[role="cell"] {
            align-items: center !important;
        }

        aside[aria-label="Info"] div[role="cell"] > div > div > div {
            display: flex !important;
            align-items: center !important;
            min-height: 14px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }

        /* Property section background colors */
        #UpdateSidebar-tabpanel-2 > div > div > div > div.layout-content > div > div > div > div > div:nth-child(1) {
            background-color: #e8e8e8 !important;
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

    // Function to open the details pane
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


    // Function to fix button heights that aren't responding to CSS
    function fixButtonHeights() {
        console.log('[Notion] Looking for buttons with height 34px...');

        // Target buttons with height 34px in inline styles
        const buttons34px = document.querySelectorAll('div[role="button"][style*="height: 34px"]');
        console.log(`[Notion] Found ${buttons34px.length} buttons with height: 34px`);

        buttons34px.forEach((button, index) => {
            console.log(`[Notion] Button ${index + 1} before:`, button.style.height);

            // Directly modify the inline style
            button.style.height = '24px';

            // Also modify padding if it has padding-inline: 6px
            if (button.style.paddingInline === '6px') {
                button.style.paddingInline = '3px';
            }

            // Also modify gap if it has gap: 6px
            if (button.style.gap === '6px') {
                button.style.gap = '3px';
            }

            console.log(`[Notion] Button ${index + 1} after:`, button.style.height);
        });

        // Target buttons with tabindex="0" and height 34px
        const tabButtons = document.querySelectorAll('div[role="button"][tabindex="0"][style*="height: 34px"]');
        console.log(`[Notion] Found ${tabButtons.length} tabbed buttons with height: 34px`);

        tabButtons.forEach((button, index) => {
            button.style.height = '24px';
            console.log(`[Notion] Tabbed button ${index + 1} fixed to:`, button.style.height);
        });
    }

    setTimeout(() => {
        openDetailsPane();
        setTimeout(expandAllToggles, 2000);
        setTimeout(fixButtonHeights, 2500);
    }, 1500);

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(() => {
                openDetailsPane();
                setTimeout(expandAllToggles, 2000);
                setTimeout(fixButtonHeights, 2500);
            }, 1500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run button height fix immediately
    setTimeout(fixButtonHeights, 1000);

    console.log('[Notion] Script loaded - H1 reduced, controls hidden, details auto-open, toggles auto-expand, property panel optimized with section colors');

})();