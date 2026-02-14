import React, { useEffect, useRef, memo } from 'react';

declare global {
    interface Window {
        TradingView: any;
    }
}

const TradingViewWidget: React.FC = () => {
    const container = useRef<HTMLDivElement>(null);
    const widgetInitialized = useRef(false);

    useEffect(() => {
        if (widgetInitialized.current) return;

        const initWidget = () => {
            if (container.current && window.TradingView && !widgetInitialized.current) {
                widgetInitialized.current = true;
                new window.TradingView.widget({
                    "autosize": true,
                    "symbol": "BINANCE:BTCUSDT",
                    "interval": "15",
                    "timezone": "America/New_York",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#0a0a0a",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "hide_top_toolbar": false,
                    "hide_legend": false,
                    "save_image": false,
                    "backgroundColor": "rgba(10, 10, 10, 1)",
                    "gridColor": "rgba(255, 255, 255, 0.03)",
                    "container_id": "tradingview_widget",
                    "loading_screen": { backgroundColor: "#0a0a0a", foregroundColor: "#2997ff" }
                });
            }
        };

        // If TradingView is already loaded (cached), init immediately
        if (window.TradingView) {
            initWidget();
            return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src*="tradingview.com/tv.js"]');
        if (existingScript) {
            existingScript.addEventListener('load', initWidget);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);

        return () => {
            widgetInitialized.current = false;
        };
    }, []);

    return (
        <div className="tv-chart-wrapper">
            <div id="tradingview_widget" ref={container} className="tv-chart-inner" />
        </div>
    );
};

export default memo(TradingViewWidget);
