(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/DashboardHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const DashboardHeader = ({ title, subtitle, badgeText = "Welcome back, Slade Johnson", showStatus = true })=>{
    _s();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date().toLocaleTimeString());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardHeader.useEffect": ()=>{
            const timer = setInterval({
                "DashboardHeader.useEffect.timer": ()=>setTime(new Date().toLocaleTimeString())
            }["DashboardHeader.useEffect.timer"], 1000);
            return ({
                "DashboardHeader.useEffect": ()=>clearInterval(timer)
            })["DashboardHeader.useEffect"];
        }
    }["DashboardHeader.useEffect"], []);
    // Split title to apply gradient to the last word if it's more than one word
    const titleParts = title.split(' ');
    const lastWord = titleParts.length > 1 ? titleParts.pop() : '';
    const firstPart = titleParts.join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "command-header animate-fade-in",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header-bg-glow"
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardHeader.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header-content-centered",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "user-badge glass-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "avatar",
                                children: "SJ"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardHeader.tsx",
                                lineNumber: 34,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: badgeText === "Welcome back, Slade Johnson" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        "Welcome back, ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Slade Johnson"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardHeader.tsx",
                                            lineNumber: 36,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true) : badgeText
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardHeader.tsx",
                                lineNumber: 35,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 33,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "hero-display centered-title",
                        children: [
                            firstPart,
                            " ",
                            lastWord && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "gradient-text-blue",
                                children: lastWord
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardHeader.tsx",
                                lineNumber: 40,
                                columnNumber: 46
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "system-status-indicator",
                        children: [
                            showStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "status-dot green"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardHeader.tsx",
                                lineNumber: 43,
                                columnNumber: 36
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-subtitle",
                                children: [
                                    showStatus ? `System Time: ${time} | ` : '',
                                    subtitle
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardHeader.tsx",
                                lineNumber: 44,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardHeader.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardHeader.tsx",
                lineNumber: 32,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardHeader.tsx",
        lineNumber: 30,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DashboardHeader, "jv+edrtG9vNyfyGh4+I7dCkFwt0=");
_c = DashboardHeader;
const __TURBOPACK__default__export__ = DashboardHeader;
var _c;
__turbopack_context__.k.register(_c, "DashboardHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/compensation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXECUTIVE_BONUS_TIERS",
    ()=>EXECUTIVE_BONUS_TIERS
]);
const EXECUTIVE_BONUS_TIERS = [
    {
        level: "Bronze ED",
        personalPremium: 2100,
        structure: "1 Executive Director Leg",
        description: "Achieve $2,100 in Personal Premium OR have 1 Executive Director leg."
    },
    {
        level: "Silver ED",
        personalPremium: 2800,
        structure: "2 Executive Director Legs",
        description: "Achieve $2,800 in Personal Premium OR have 2 Executive Director legs (Must be ED)."
    },
    {
        level: "Gold ED",
        personalPremium: 3500,
        structure: "3 Executive Director Legs",
        description: "Achieve $3,500 in Personal Premium OR have 3 Executive Director legs."
    },
    {
        level: "Platinum ED",
        personalPremium: 4200,
        structure: "4 Executive Director Legs",
        description: "Achieve $4,200 in Personal Premium OR have 4 Executive Director legs."
    },
    {
        level: "Double Platinum",
        personalPremium: 5600,
        structure: "1 Platinum Leg OR 6 ED Legs",
        description: "Achieve $5,600 in Personal Premium OR 1 Platinum Leg OR 6 ED Legs."
    },
    {
        level: "Triple Platinum",
        personalPremium: 7000,
        structure: "2 Platinum Legs OR 8 ED Legs",
        description: "Achieve $7,000 in Personal Premium OR 2 Platinum Legs OR 8 ED Legs."
    },
    {
        level: "Platinum Elite",
        personalPremium: 8400,
        structure: "3 Platinum Legs OR 10 ED Legs",
        description: "Achieve $8,400 in Personal Premium OR 3 Platinum Legs OR 10 ED Legs."
    },
    {
        level: "Diamond ED",
        personalPremium: 9800,
        structure: "4 Platinum Legs OR 12 ED Legs",
        description: "Achieve $9,800 in Personal Premium OR 4 Platinum Legs OR 12 ED Legs."
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BonusStructure.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compensation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/compensation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
const BonusStructure = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bonus-structure-container glass-panel animate-fade-in",
        style: {
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-between",
                style: {
                    marginBottom: 'var(--spacing-lg)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-title",
                                style: {
                                    fontSize: '1.75rem'
                                },
                                children: "Executive Bonus Levels"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BonusStructure.tsx",
                                lineNumber: 12,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-subtitle",
                                children: "Unlock monthly performance bonuses by scaling your personal premium or organization structure."
                            }, void 0, false, {
                                fileName: "[project]/src/components/BonusStructure.tsx",
                                lineNumber: 13,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BonusStructure.tsx",
                        lineNumber: 11,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                        size: 32,
                        className: "icon-yellow"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BonusStructure.tsx",
                        lineNumber: 15,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BonusStructure.tsx",
                lineNumber: 10,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "payout-table",
                    style: {
                        width: '100%'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left'
                                        },
                                        children: "Bonus Level"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BonusStructure.tsx",
                                        lineNumber: 22,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left'
                                        },
                                        children: "Personal Premium Requirement"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BonusStructure.tsx",
                                        lineNumber: 23,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            textAlign: 'left'
                                        },
                                        children: "Organizational Alternative"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BonusStructure.tsx",
                                        lineNumber: 24,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/BonusStructure.tsx",
                                lineNumber: 21,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/BonusStructure.tsx",
                            lineNumber: 20,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$compensation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXECUTIVE_BONUS_TIERS"].map((tier, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].tr, {
                                    initial: {
                                        opacity: 0,
                                        x: -10
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    transition: {
                                        delay: i * 0.05
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                    size: 14,
                                                    className: i > 3 ? "icon-yellow" : "icon-secondary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/BonusStructure.tsx",
                                                    lineNumber: 36,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: 700,
                                                        color: i > 3 ? '#fff' : 'var(--secondary)'
                                                    },
                                                    children: tier.level
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/BonusStructure.tsx",
                                                    lineNumber: 37,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/BonusStructure.tsx",
                                            lineNumber: 35,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green",
                                                style: {
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "$",
                                                    tier.personalPremium.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/BonusStructure.tsx",
                                                lineNumber: 40,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BonusStructure.tsx",
                                            lineNumber: 39,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                color: 'var(--accent)'
                                            },
                                            children: tier.structure
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BonusStructure.tsx",
                                            lineNumber: 42,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, tier.level, true, {
                                    fileName: "[project]/src/components/BonusStructure.tsx",
                                    lineNumber: 29,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/BonusStructure.tsx",
                            lineNumber: 27,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/BonusStructure.tsx",
                    lineNumber: 19,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/BonusStructure.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 'var(--spacing-md)',
                    fontSize: '0.875rem',
                    color: 'var(--secondary)',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '16px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Note:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/BonusStructure.tsx",
                            lineNumber: 50,
                            columnNumber: 20
                        }, ("TURBOPACK compile-time value", void 0)),
                        " To qualify for Silver ED and above via the organizational route, you must maintain the rank of Executive Director yourself."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/BonusStructure.tsx",
                    lineNumber: 50,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/BonusStructure.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BonusStructure.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = BonusStructure;
const __TURBOPACK__default__export__ = BonusStructure;
var _c;
__turbopack_context__.k.register(_c, "BonusStructure");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RankTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
;
const ranks = [
    {
        name: 'Associate',
        pct: '9.1%',
        qualifier: '3 Sales',
        requirement: '3 personal sales'
    },
    {
        name: 'Senior Associate',
        pct: '11.4%',
        qualifier: '$500 Sales or 3 Assoc + $300 Team',
        requirement: '$500 personal sales OR (3 Associates + $300 team sales)'
    },
    {
        name: 'Manager',
        pct: '15.1%',
        qualifier: '$1500 Premium or 3 Sr Assoc + $1500 Team',
        requirement: '$1500 personal premium sales OR (3 Senior Associates + $1500 team sales)'
    },
    {
        name: 'Director',
        pct: '20%',
        qualifier: '$3000 Personal or 3 Mgrs + $3000 Team',
        requirement: '$3000 personal sales OR (3 Managers + $3000 team sales)'
    },
    {
        name: 'Senior Director',
        pct: '37.5%',
        qualifier: '$700 Personal Prem or Team Split',
        requirement: '$700 personal premium OR ($700 total team premium with max $350 from one leg)'
    },
    {
        name: 'Executive Director',
        pct: '47.5%',
        qualifier: '$1400 Personal Prem or Team Split',
        requirement: '$1400 personal premium OR ($1400 total team premium with max $700 from one leg)'
    },
    {
        name: 'Bronze Executive Director',
        pct: '49%',
        qualifier: '1 ED + $2k Team',
        requirement: '1 Executive Director in downline + $2,000 team premium'
    },
    {
        name: 'Silver Executive Director',
        pct: '51%',
        qualifier: '2 EDs + $4k Team',
        requirement: '2 Executive Directors in downline + $4,000 team premium'
    },
    {
        name: 'Gold Executive Director',
        pct: '53%',
        qualifier: '3 EDs + $8k Team',
        requirement: '3 Executive Directors in downline + $8,000 team premium'
    },
    {
        name: 'Platinum Executive Director',
        pct: '55%',
        qualifier: '5 EDs + $15k Team',
        requirement: '5 Executive Directors in downline + $15,000 team premium'
    },
    {
        name: 'Diamond Executive Director',
        pct: '60%',
        qualifier: '10 EDs + $50k Team',
        requirement: '10 Executive Directors in downline + $50,000 team premium'
    }
];
const RankTracker = ({ simulationRank = 'Senior Associate' })=>{
    // Find index of the simulated rank, defaulting to Associate if not found or if "Associate"
    const currentRankIndex = ranks.findIndex((r)=>r.name === simulationRank);
    const validRankIndex = currentRankIndex >= 0 ? currentRankIndex : 0;
    // Logic to determine "next rank" based on simulation
    // If simulation is ED, next is null or "Maxed"
    // For simulation, we might want to show "How to get HERE" vs "What is NEXT"
    // User requested: "act as a simulation, module and explanation of all commissions and how to grow"
    // Let's assume if I select "Director", I want to see the Director card active/highlighted.
    const nextRank = ranks[validRankIndex + 1] || ranks[validRankIndex];
    const currentRankObj = ranks[validRankIndex] || ranks[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rank-progression-v2 glass-panel animate-fade-in-up",
        style: {
            marginTop: 'var(--spacing-xl)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-between header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "Rank Simulation & Achievement"
                    }, void 0, false, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 96,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "current-status badge green",
                        children: [
                            "Simulating: ",
                            simulationRank
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 97,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RankTracker.tsx",
                lineNumber: 95,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "current-rank-card glass-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rank-info-main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                children: "Simulated Rank"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 102,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "rank-title",
                                children: currentRankObj.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 103,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "qual-logic",
                                children: [
                                    "Earn ",
                                    currentRankObj.pct,
                                    " commission on personal production."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 104,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 101,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rank-progress-circle",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "circle-inner",
                            children: "100%"
                        }, void 0, false, {
                            fileName: "[project]/src/components/RankTracker.tsx",
                            lineNumber: 107,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 106,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RankTracker.tsx",
                lineNumber: 100,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            validRankIndex < ranks.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "next-rank-path",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                children: [
                                    "Next Milestone: ",
                                    nextRank.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 114,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                children: [
                                    "Commission Bump: ",
                                    nextRank.pct
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 115,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 113,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "progress-bar-v2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "progress-fill",
                            style: {
                                width: '0%'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/RankTracker.tsx",
                            lineNumber: 118,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 117,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rank-requirements",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "To reach ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: nextRank.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RankTracker.tsx",
                                        lineNumber: 121,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " from here, achieve:"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 121,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-panel",
                                style: {
                                    padding: '1rem',
                                    marginTop: '1rem'
                                },
                                children: nextRank.requirement
                            }, void 0, false, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 122,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 120,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RankTracker.tsx",
                lineNumber: 112,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rank-scroller",
                children: ranks.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `rank-card-v2 ${r.name === simulationRank ? 'active' : ''} ${i < validRankIndex ? 'completed' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rank-badge-v2",
                                children: r.name === simulationRank ? '★' : i < validRankIndex ? '✓' : i + 1
                            }, void 0, false, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 135,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rank-meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        children: r.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RankTracker.tsx",
                                        lineNumber: 139,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "commission",
                                        children: [
                                            r.pct,
                                            " Commission"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/RankTracker.tsx",
                                        lineNumber: 140,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "qual-desc",
                                        children: r.requirement
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/RankTracker.tsx",
                                        lineNumber: 141,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/RankTracker.tsx",
                                lineNumber: 138,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/RankTracker.tsx",
                        lineNumber: 131,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/RankTracker.tsx",
                lineNumber: 129,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RankTracker.tsx",
        lineNumber: 94,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = RankTracker;
const __TURBOPACK__default__export__ = RankTracker;
var _c;
__turbopack_context__.k.register(_c, "RankTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/development/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DevelopmentPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DashboardHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BonusStructure$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BonusStructure.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RankTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RankTracker.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const commissionSchedule = {
    'Essentials ($49)': {
        'Associate': {
            advance: 53.77,
            overrides: {}
        },
        'Senior Associate': {
            advance: 67.22,
            overrides: {
                'Associate': 13.44
            }
        },
        'Manager': {
            advance: 88.72,
            overrides: {
                'Associate': 34.95,
                'Senior Associate': 21.51
            }
        },
        'Senior Manager': {
            advance: 119.64,
            overrides: {
                'Associate': 65.87,
                'Senior Associate': 52.43,
                'Manager': 30.92
            }
        },
        'Director': {
            advance: 165.35,
            overrides: {
                'Associate': 111.58,
                'Senior Associate': 98.13,
                'Manager': 76.63,
                'Senior Manager': 45.71
            }
        },
        'Senior Director': {
            advance: 222.48,
            overrides: {
                'Associate': 168.71,
                'Senior Associate': 155.27,
                'Manager': 133.76,
                'Senior Manager': 102.84,
                'Director': 57.13
            }
        },
        'Executive Director': {
            advance: 279.62,
            overrides: {
                'Associate': 225.85,
                'Senior Associate': 212.41,
                'Manager': 190.90,
                'Senior Manager': 159.98,
                'Director': 114.27,
                'Senior Director': 57.14
            }
        },
        'Bronze Executive Director': {
            advance: 291.71,
            overrides: {}
        },
        'Silver Executive Director': {
            advance: 303.81,
            overrides: {}
        },
        'Gold Executive Director': {
            advance: 315.91,
            overrides: {}
        },
        'Platinum Executive Director': {
            advance: 328.01,
            overrides: {}
        },
        'Double Platinum': {
            advance: 328.01,
            overrides: {}
        },
        'Triple Platinum': {
            advance: 328.01,
            overrides: {}
        },
        'Platinum Elite': {
            advance: 328.01,
            overrides: {}
        },
        'Diamond Executive Director': {
            advance: 338.77,
            overrides: {}
        }
    },
    'Plus ($99)': {
        'Associate': {
            advance: 108.64,
            overrides: {}
        },
        'Senior Associate': {
            advance: 135.80,
            overrides: {
                'Associate': 27.16
            }
        },
        'Manager': {
            advance: 179.26,
            overrides: {
                'Associate': 70.62,
                'Senior Associate': 43.46
            }
        },
        'Senior Manager': {
            advance: 241.73,
            overrides: {
                'Associate': 133.09,
                'Senior Associate': 105.93,
                'Manager': 62.47
            }
        },
        'Director': {
            advance: 334.07,
            overrides: {
                'Associate': 225.43,
                'Senior Associate': 198.27,
                'Manager': 154.81,
                'Senior Manager': 92.35
            }
        },
        'Senior Director': {
            advance: 449.51,
            overrides: {
                'Associate': 340.86,
                'Senior Associate': 313.70,
                'Manager': 270.25,
                'Senior Manager': 207.78,
                'Director': 115.43
            }
        },
        'Executive Director': {
            advance: 564.94,
            overrides: {
                'Associate': 456.30,
                'Senior Associate': 429.13,
                'Manager': 385.67,
                'Senior Manager': 323.21,
                'Director': 230.87,
                'Senior Director': 115.43
            }
        },
        'Bronze Executive Director': {
            advance: 589.38,
            overrides: {}
        },
        'Silver Executive Director': {
            advance: 613.83,
            overrides: {}
        },
        'Gold Executive Director': {
            advance: 638.27,
            overrides: {}
        },
        'Platinum Executive Director': {
            advance: 662.72,
            overrides: {}
        },
        'Double Platinum': {
            advance: 662.72,
            overrides: {}
        },
        'Triple Platinum': {
            advance: 662.72,
            overrides: {}
        },
        'Platinum Elite': {
            advance: 662.72,
            overrides: {}
        },
        'Diamond Executive Director': {
            advance: 684.44,
            overrides: {}
        }
    },
    'Pro ($169)': {
        'Associate': {
            advance: 92.73,
            overrides: {}
        },
        'Senior Associate': {
            advance: 115.91,
            overrides: {
                'Associate': 23.18
            }
        },
        'Manager': {
            advance: 153.00,
            overrides: {
                'Associate': 60.27,
                'Senior Associate': 37.09
            }
        },
        'Senior Manager': {
            advance: 206.32,
            overrides: {
                'Associate': 113.59,
                'Senior Associate': 90.41,
                'Manager': 53.32
            }
        },
        'Director': {
            advance: 285.14,
            overrides: {
                'Associate': 192.41,
                'Senior Associate': 169.23,
                'Manager': 132.14,
                'Senior Manager': 78.82
            }
        },
        'Senior Director': {
            advance: 383.67,
            overrides: {
                'Associate': 290.94,
                'Senior Associate': 267.76,
                'Manager': 230.67,
                'Senior Manager': 177.35,
                'Director': 98.53
            }
        },
        'Executive Director': {
            advance: 482.19,
            overrides: {
                'Associate': 389.46,
                'Senior Associate': 366.28,
                'Manager': 329.19,
                'Senior Manager': 275.87,
                'Director': 197.05,
                'Senior Director': 98.53
            }
        },
        'Bronze Executive Director': {
            advance: 503.06,
            overrides: {}
        },
        'Silver Executive Director': {
            advance: 523.92,
            overrides: {}
        },
        'Gold Executive Director': {
            advance: 544.79,
            overrides: {}
        },
        'Platinum Executive Director': {
            advance: 565.65,
            overrides: {}
        },
        'Double Platinum': {
            advance: 565.65,
            overrides: {}
        },
        'Triple Platinum': {
            advance: 565.65,
            overrides: {}
        },
        'Platinum Elite': {
            advance: 565.65,
            overrides: {}
        },
        'Diamond Executive Director': {
            advance: 584.20,
            overrides: {}
        }
    }
};
const products = [
    {
        name: 'Business Essentials',
        id: 'Essentials ($49)',
        price: '$49',
        period: '/mo',
        target: 'Small Teams (1-2 Users)',
        features: [
            'Unlimited System Consultation',
            '10 Executive Calls per year',
            '10 Contract Reviews per year',
            'Debt Collection Protocols'
        ],
        highlight: false,
        colorClass: 'text-blue'
    },
    {
        name: 'Business Plus',
        id: 'Plus ($99)',
        price: '$99',
        period: '/mo',
        target: 'Growing Ventures (1-3 Users)',
        features: [
            'Multi-region Infrastructure Support',
            '20 Executive Letters/Calls per year',
            '20 Advanced System Reviews per year',
            'Tax & Audit Defense (25 hrs)'
        ],
        highlight: true,
        colorClass: 'text-gradient'
    },
    {
        name: 'Business Pro',
        id: 'Pro ($169)',
        price: '$169',
        period: '/mo',
        target: 'Elite Enterprises (1-5 Users)',
        features: [
            'Institutional System Access',
            '40 Executive Operations per year',
            '40 Deep System Reviews per year',
            'Tax & Audit Defense (50 hrs)'
        ],
        highlight: false,
        colorClass: 'text-purple'
    }
];
function DevelopmentPage() {
    _s();
    const [selectedRank, setSelectedRank] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Senior Associate');
    const [showPayoutTable, setShowPayoutTable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ranks = [
        'Associate',
        'Senior Associate',
        'Manager',
        'Senior Manager',
        'Director',
        'Senior Director',
        'Executive Director',
        'Bronze Executive Director',
        'Silver Executive Director',
        'Gold Executive Director',
        'Platinum Executive Director',
        'Diamond Executive Director'
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "development-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Business Development",
                subtitle: "Simulate your earnings and map your path to executive leadership."
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "simulation-controls-v2 glass-panel animate-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "control-header",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "title-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            size: 16,
                                            className: "text-accent"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 137,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Simulation Intelligence Mode"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 138,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `payout-toggle ${showPayoutTable ? 'active' : ''}`,
                                    onClick: ()=>setShowPayoutTable(!showPayoutTable),
                                    children: showPayoutTable ? 'Collapse Intelligence' : 'Expand Matrix'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 134,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rank-chips-container",
                        children: ranks.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `rank-chip ${selectedRank === r ? 'active' : ''}`,
                                onClick: ()=>setSelectedRank(r),
                                children: r
                            }, r, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 151,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 149,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RankTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                simulationRank: selectedRank
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 163,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "section-divider",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "Product Commission Protocols"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 166,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Select a rank above to see specific earning potential per unit."
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 167,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 165,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "development-hero glass-panel animate-fade-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hero-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hero-main-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "badge-wrapper",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "badge-new",
                                        children: "PROFIT LOGIC"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 174,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "hero-display",
                                    children: [
                                        "Monetize Business ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "gradient-text-blue",
                                            children: "Infrastructure"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 72
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "hero-description",
                                    children: [
                                        "We leverage an exclusive partnership with ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "LegalShield"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 178,
                                            columnNumber: 71
                                        }, this),
                                        " to provide high-level business insurance and legal protection protocols. By deploying these solutions to businesses and aspiring entrepreneurs, you tap into a high-performance wealth engine."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                    lineNumber: 177,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "value-props",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "v-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                    size: 20,
                                                    className: "icon-yellow"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Daily Payouts:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 39
                                                        }, this),
                                                        " Get paid work-units straight to your bank account every 24 hours."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "v-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                    size: 20,
                                                    className: "icon-blue"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Full Coverage:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                            lineNumber: 189,
                                                            columnNumber: 39
                                                        }, this),
                                                        " Protect businesses from liability while building your legacy."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                    lineNumber: 182,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                            lineNumber: 172,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hero-stats-card glass-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card-inner",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        size: 32,
                                        className: "icon-green"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        children: "The Wealth Protocol"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Deploy protection, scale your network, and receive daily deposits from the platform's execution."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 197,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mini-payout-log",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "log-line",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Deposit Received"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 59
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green",
                                                        children: "+$564.94"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 89
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 199,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "log-line",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Deposit Received"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 59
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green",
                                                        children: "+$482.19"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 89
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 194,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                            lineNumber: 193,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                    lineNumber: 171,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 170,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "commission-overview glass-panel animate-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "meta",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                size: 24,
                                className: "icon-yellow"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 209,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Commission Intelligence"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 211,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "Calculate your potential earnings and overrides based on the current ",
                                            selectedRank,
                                            " level."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 210,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 208,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn-secondary",
                        onClick: ()=>setShowPayoutTable(!showPayoutTable),
                        children: showPayoutTable ? 'Hide Payout Schedule' : 'View Full Schedule'
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 215,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 207,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "plans-grid",
                children: products.map((product)=>{
                    // Fallback to ED if exact rank data missing in future (though we just added it)
                    const comm = commissionSchedule[product.id][selectedRank] || commissionSchedule[product.id]['Executive Director'];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `legal-card glass-panel ${product.highlight ? 'highlighted' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "plan-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "plan-price",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `amount ${product.colorClass ? product.colorClass : ''}`,
                                                children: product.price
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "period",
                                                children: product.period
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 233,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 229,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "payout-box glass-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "payout-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "label",
                                                children: "Direct Sale Advance"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "value text-green",
                                                children: [
                                                    "$",
                                                    comm.advance.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 33
                                    }, this),
                                    Object.keys(comm.overrides).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "override-teaser",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Earn up to ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: [
                                                            "$",
                                                            Math.max(...Object.values(comm.overrides)).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 58
                                                    }, this),
                                                    " in overrides"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 237,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "plan-features",
                                children: product.features.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                size: 14,
                                                className: "icon-blue"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 253,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: f
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 254,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 37
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 250,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn-primary full-width",
                                children: "Copy Referral Link"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 259,
                                columnNumber: 29
                            }, this)
                        ]
                    }, product.id, true, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 228,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 223,
                columnNumber: 13
            }, this),
            showPayoutTable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "payout-schedule glass-panel animate-fade-in-up",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "payout-table-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: [
                                    "Override Matrix: ",
                                    selectedRank
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 268,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "description-text mb-4",
                                children: [
                                    "Your spread income from team production relative to your rank.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 271,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-secondary text-sm",
                                        children: "Calculated as: (Your Advance) - (Downline Rank Advance)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 271,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 269,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "payout-table",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Downline Rank Source"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 37
                                                }, this),
                                                products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: p.name
                                                    }, p.id, false, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 56
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                            lineNumber: 276,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 275,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "highlight-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Personal Production"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                        lineNumber: 284,
                                                        columnNumber: 37
                                                    }, this),
                                                    products.map((p)=>{
                                                        const myComm = commissionSchedule[p.id][selectedRank]?.advance || 0;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "text-green font-bold",
                                                            children: [
                                                                "$",
                                                                myComm.toFixed(2)
                                                            ]
                                                        }, p.id, true, {
                                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 48
                                                        }, this);
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 33
                                            }, this),
                                            ranks.slice(0, ranks.indexOf(selectedRank)).reverse().map((downlineRank)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                "Override on ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: downlineRank
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                                    lineNumber: 294,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                            lineNumber: 294,
                                                            columnNumber: 41
                                                        }, this),
                                                        products.map((p)=>{
                                                            const myComm = commissionSchedule[p.id][selectedRank]?.advance || 0;
                                                            const theirComm = commissionSchedule[p.id][downlineRank]?.advance || 0;
                                                            const spread = Math.max(0, myComm - theirComm);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: spread > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-blue",
                                                                    children: [
                                                                        "+$",
                                                                        spread.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 57
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-secondary",
                                                                    children: "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                                    lineNumber: 304,
                                                                    columnNumber: 57
                                                                }, this)
                                                            }, p.id, false, {
                                                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 49
                                                            }, this);
                                                        })
                                                    ]
                                                }, downlineRank, true, {
                                                    fileName: "[project]/src/app/dashboard/development/page.tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 37
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 274,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 267,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "table-footer",
                        children: "* Commission values are based on the Elite (Performance Club) advance schedule."
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 314,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 266,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "legal-tools-grid",
                style: {
                    marginTop: showPayoutTable ? 'var(--spacing-xl)' : '0'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-panel tool-box",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                size: 20,
                                className: "icon-blue"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 320,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Override Logic"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 321,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Earn the difference between your rank advance and your downline's rank advance."
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 322,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 319,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-panel tool-box",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                size: 20,
                                className: "icon-blue"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 325,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Performance Club"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 326,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Maintain 65%+ retention to unlock Elite commission levels across all protocols."
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 327,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 324,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-panel tool-box",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                size: 20,
                                className: "icon-blue"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 330,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Advance System"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 331,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Receive up to 12 months of commission upfront on every deployed protocol."
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/development/page.tsx",
                                lineNumber: 332,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/development/page.tsx",
                        lineNumber: 329,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 318,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BonusStructure$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/dashboard/development/page.tsx",
                lineNumber: 336,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/development/page.tsx",
        lineNumber: 126,
        columnNumber: 9
    }, this);
}
_s(DevelopmentPage, "TBF0wadmONecXyNGMjkF2Z3epa8=");
_c = DevelopmentPage;
var _c;
__turbopack_context__.k.register(_c, "DevelopmentPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_206fa397._.js.map