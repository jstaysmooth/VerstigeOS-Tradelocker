"""
DxTrade API Client for Verstige Trading Platform
Based on the DxTrade-Python-Demo repository pattern
Supports multiple vendors including LiquidBrokers, FTMO, etc.
"""

import requests
import json
import websocket
import uuid
import time
import threading
import ssl
from typing import Optional, Dict, List, Any, Callable
from dataclasses import dataclass, field
from enum import Enum, IntEnum

class OrderSide(IntEnum):
    BUY = 0
    SELL = 1

class DxTradeSubscription(Enum):
    ACCOUNT_PORTFOLIOS = "AccountPortfolios"
    ACCOUNT_METRICS = "AccountMetrics"
    ACCOUNT_EVENTS = "AccountEvents"
    CASH_TRANSFERS = "CashTransfers"
    INSTRUMENT_INFO = "InstrumentInfo"

    def get_request_type(self) -> str:
        mapping = {
            "AccountPortfolios": "AccountPortfoliosSubscriptionRequest",
            "AccountMetrics": "AccountMetricsSubscriptionRequest",
            "AccountEvents": "AccountEventsSubscriptionRequest",
            "CashTransfers": "CashTransfersSubscriptionRequest",
            "InstrumentInfo": "InstrumentSubscriptionRequest",
        }
        return mapping.get(self.value, f"{self.value}SubscriptionRequest")


class OrderSide(IntEnum):
    BUY = 0
    SELL = 1


# Instrument IDs for common trading pairs
INSTRUMENTS = {
    "GBPUSD": 3440,
    "EURUSD": 3438,
    "USDJPY": 3427,
    "EURGBP": 3419,
    "USDCAD": 3433,
    "USDCHF": 3390,
    "AUDUSD": 3411,
    "NZDUSD": 3398,
    "EURJPY": 3392,
    "AUDCHF": 3395,
    "XAUUSD": 3406,
    "US30": 3351,
    "ETHUSD": 3443,
    "BTCUSD": 3425,
}

# Vendor-specific base URLs
VENDOR_URLS = {
    "ftmo": "https://dxtrade.ftmo.com",
    "liquidbrokers": "https://trader.liquidcharts.com",  # LiquidBrokers uses Liquid Charts
    "thefundedtraderprogram": "https://dxtrade.thefundedtraderprogram.com",
    "fundednext": "https://dxtrade.fundednext.com",
    "myforexfunds": "https://dxtrade.myforexfunds.com",
    "fxify": "https://dxtrade.fxify.com",
}


@dataclass
class TradeOrder:
    symbol: str
    side: OrderSide
    quantity: float
    take_profit: float = 0
    stop_loss: float = 0
    limit_price: float = 0  # 0 for market order


class DxTradeClient:
    """DxTrade API Client supporting multiple vendors including LiquidBrokers"""
    
    def __init__(self, username: str, password: str, vendor: str = "liquidbrokers", domain: str = "default"):
        self.username = username
        self.password = password
        self.vendor = vendor
        self.domain = domain
        
        # Determine base URL
        if vendor in VENDOR_URLS:
            self.base_url = VENDOR_URLS[vendor]
        else:
            self.base_url = f"https://dxtrade.{vendor}.com"
            
        self.csrf: Optional[str] = None
        self.account_id: Optional[str] = None
        self.session_token: Optional[str] = None
        self.push_session_id: Optional[str] = None
        self.websocket_url: Optional[str] = None
        
        self.cookies: Dict[str, str] = {}
        self.session = requests.Session()
        self.ws: Optional[websocket.WebSocketApp] = None
        self.ws_thread: Optional[threading.Thread] = None
        self.is_connected = False
        self.callbacks: Dict[str, Callable] = {}
        
        # Heartbeat
        self.heartbeat_interval = 30
        self.last_heartbeat_time = 0
    
    def login(self) -> bool:
        """Authenticate with the DxTrade platform using Token Auth"""
        # Try the modern Token API first (from PHP repo)
        url = f"{self.base_url}/api/auth/login" 
        # Note: The PHP repo uses /login relative to base. 
        # However, VERSTIGE V2 seems to use /api/auth/login.
        # We will try the standard path first, but fallback to the PHP repo's observed path style if needed.
        # Actually, let's try to match the PHP repo's logic first if the user explicitly asked for it.
        # The PHP repo simply does POST /login. But usually that implies a base URL ending in /dx/api
        
        # Let's try the existing Login approach first to get cookies (hybrid support)
        # But allow capturing the session token if returned.
        
        payload = json.dumps({
            "username": self.username,
            "password": self.password,
            "vendor": self.vendor,
            "domain": self.domain
        })
        headers = {'content-type': 'application/json'}
        
        try:
            response = self.session.post(url, headers=headers, data=payload)
            if response.status_code == 200:
                data = response.json()
                # Store cookies
                for cookie in response.cookies:
                    self.cookies[cookie.name] = cookie.value
                
                # Check if we got a session token (some implementations return it)
                if "sessionToken" in data:
                    self.session_token = data["sessionToken"]
                
                # Fetch CSRF just in case we need it for legacy endpoints
                self.fetch_csrf()
                
                # If we didn't get a session token, try the explicit /login endpoint mentioned in PHP repo
                if not self.session_token:
                     self._try_token_login()
                
                self.is_connected = True
                return True
            else:
                print(f"Login failed: {response.status_code} {response.text}")
                return False
        except Exception as e:
            print(f"Login error: {str(e)}")
            return False

    def _try_token_login(self):
        """Attempt to get a session token using the method from the PHP repo"""
        try:
            # The PHP repo uses /login key-values: username, domain, password
            url = f"{self.base_url}/login" # Assuming base_url is the API root
            # If base_url is the site root, we might need /dx/api/login
            
            payload = {
                "username": self.username,
                "domain": self.domain,
                "password": self.password
            }
            res = self.session.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                self.session_token = data.get("sessionToken")
        except Exception:
            pass
    
    def fetch_csrf(self) -> Optional[str]:
        """Fetch CSRF token from the platform"""
        try:
            headers = {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            }
            cookies_in_req = {key: value for key, value in self.cookies.items() if "JSESSIONID" in key}
            response = self.session.get(f"{self.base_url}/", headers=headers, cookies=cookies_in_req)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            csrf_meta_tag = soup.find('meta', attrs={'name': 'csrf'})
            
            if csrf_meta_tag and 'content' in csrf_meta_tag.attrs:
                self.csrf = csrf_meta_tag['content']
                return self.csrf
            else:
                print("CSRF token not found.")
                return None
        except requests.RequestException as e:
            print(f"CSRF fetch error: {str(e)}")
            return None
    
    def create_push_session(self) -> bool:
        """Create a push session to get WebSocket URL (PHP repo method)"""
        if not self.session_token:
            print("No session token available. Cannot create push session.")
            return False
            
        url = f"{self.base_url}/push/session" # PHP repo path: /push/session (relative to API base)
        # Note: In our current setup, base_url is likely https://trader.liquidcharts.com
        # If the API is at /api, we need to adjust.
        # VERSTIGE implementation seems to presume /api/auth.
        # Let's assume /api/push/session if the previous login worked at /api/auth/login
        
        # Adjustable Strategy: Try both common paths
        paths = ["/api/push/session", "/push/session"]
        
        headers = {
            "Authorization": f"DXAPI {self.session_token}",
            "Content-Type": "application/json"
        }
        
        for path in paths:
            try:
                full_url = f"{self.base_url}{path}"
                res = self.session.post(full_url, headers=headers, json={"channel": "accounts"})
                if res.status_code == 200:
                    data = res.json()
                    self.push_session_id = data.get("pushSessionId")
                    self.websocket_url = data.get("websocketUrl")
                    return True
            except Exception:
                continue
                
        return False

    def establish_handshake(self, kill_msg: Optional[str] = None, check_func: callable = None, timeout: int = 15) -> Optional[str]:
        """
        Connect to WebSocket, subscribe, and wait for data.
        Refactored to use the '/push/session' flow if available, else fallback.
        """
        # Try creating a push session first (The 'New' Way)
        if self.session_token and self.create_push_session() and self.websocket_url:
            return self._connect_websocket_new(check_func, timeout)
        
        # Fallback to the old 'Legacy' Way (Atmosphere)
        return self._connect_websocket_legacy(kill_msg, check_func, timeout)

    def _connect_websocket_new(self, check_func: callable, timeout: int) -> Optional[str]:
        """Connect using the new Push API flow"""
        url = self.websocket_url
        headers = {
            "X-Push-Session-Id": self.push_session_id,
        }
        
        result_container = {"data": None}
        
        def on_message(ws, message):
            # Message format: JSON
            # We are looking for the 'check_func' validation
            # Messages come in an envelope type=...
            if check_func and check_func(message):
                result_container["data"] = message
                ws.close()
            elif '"payload"' in message and check_func(message):
                 # Sometimes user check_func checks the inner, so we relax
                result_container["data"] = message
                ws.close()

        def on_open(ws):
            # Send Subscriptions
            # Subscribe to Portfolios and Metrics
            self._send_subscription(ws, DxTradeSubscription.ACCOUNT_PORTFOLIOS)
            self._send_subscription(ws, DxTradeSubscription.ACCOUNT_METRICS)

        # We need to run this briefly to catch the snapshot
        ws_app = websocket.WebSocketApp(url, header=headers, on_message=on_message, on_open=on_open)
        
        # Run in a separate thread so we can timeout
        wst = threading.Thread(target=ws_app.run_forever)
        wst.daemon = True
        wst.start()
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            if result_container["data"]:
                return result_container["data"]
            time.sleep(0.1)
        
        if ws_app.keep_running:
            ws_app.close()
            
        return None

    def _send_subscription(self, ws, subscription: DxTradeSubscription):
        """Send a subscription request"""
        req_id = f"{uuid.uuid4()}"
        msg = {
            "type": subscription.get_request_type(),
            "requestId": req_id,
            "timestamp": int(time.time() * 1000),
            "session": self.session_token,
            "payload": {}
        }
        ws.send(json.dumps(msg))

    def _connect_websocket_legacy(self, kill_msg: Optional[str], check_func: callable, timeout: int) -> Optional[str]:
        """Legacy Atmosphere Connection (Fallback)"""
        cookie_string = "; ".join([f"{name}={value}" for name, value in self.cookies.items()])
        headers = {"Cookie": cookie_string}
        
        ws_url = (
            f"wss://{self.base_url.replace('https://', '')}/client/connector?"
            f"X-Atmosphere-tracking-id=0&X-Atmosphere-Framework=2.3.2-javascript&"
            f"X-Atmosphere-Transport=websocket&X-Atmosphere-TrackMessageSize=true&"
            f"Content-Type=text/x-gwt-rpc;%20charset=UTF-8&X-atmo-protocol=true&"
            f"sessionState=dx-new&guest-mode=false"
        )
        
        ws = None
        try:
            ws = create_connection(ws_url, header=headers, timeout=timeout)
            start_time = time.time()
            while time.time() - start_time < timeout:
                try:
                    message = ws.recv()
                    if check_func and check_func(message):
                        return message
                    elif kill_msg and kill_msg in message:
                        return message
                except Exception:
                    continue
            return None
        except Exception as e:
            print(f"Legacy WS Error: {str(e)}")
            return None
        finally:
            if ws:
                ws.close()
    
    def get_accounts(self) -> Optional[List[Dict]]:
        """Fetch all available trading accounts for the logged-in user"""
        url = f"{self.base_url}/api/accounts"
        headers = {
            'accept': 'application/json',
            'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            'x-csrf-token': self.csrf or "",
            'x-requested-with': 'XMLHttpRequest'
        }
        
        try:
            response = self.session.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                accounts = []
                for account in data.get("accounts", data if isinstance(data, list) else []):
                    account_id = account.get("accountId", account.get("code", ""))
                    accounts.append({
                        "id": account_id,
                        "name": account.get("name", account_id),
                        "balance": account.get("balance", 0),
                        "type": account.get("type", "Live"),
                        "currency": account.get("currency", "USD")
                    })
                return accounts
            else:
                print(f"Failed to fetch accounts: {response.status_code} - {response.text}")
                # Try alternative endpoint for some vendors
                return self._get_accounts_from_trading_history()
        except Exception as e:
            print(f"Error fetching accounts: {str(e)}")
            return None
    
    def _get_accounts_from_trading_history(self) -> Optional[List[Dict]]:
        """Fallback: Get account info from trading activity"""
        try:
            # Get accounts from the platform initialization
            url = f"{self.base_url}/api/trading/accounts"
            headers = {
                'accept': 'application/json',
                'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
                'x-csrf-token': self.csrf or "",
                'x-requested-with': 'XMLHttpRequest'
            }
            response = self.session.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data.get("accounts", [])
        except Exception as e:
            print(f"Fallback account fetch error: {str(e)}")
        return None
    
    def set_active_account(self, account_id: str) -> bool:
        """Set the active trading account"""
        url = f"{self.base_url}/api/accounts/switch"
        headers = {
            'content-type': 'application/json',
            'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            'x-csrf-token': self.csrf or "",
            'x-requested-with': 'XMLHttpRequest'
        }
        
        payload = {"accountId": account_id}
        
        try:
            response = self.session.post(url, headers=headers, data=json.dumps(payload))
            if response.status_code == 200:
                self.account_id = account_id
                print(f"Switched to account: {account_id}")
                return True
            else:
                # Some platforms don't need explicit switch, just store it
                self.account_id = account_id
                return True
        except Exception as e:
            print(f"Account switch error: {str(e)}")
            self.account_id = account_id  # Store anyway
            return True
    
    def get_account_balance(self, account_id: Optional[str] = None) -> Dict:
        """Fetch detailed account balance and equity information"""
        target_account = account_id or self.account_id
        
        # Try multiple endpoints that DxTrade platforms may use
        endpoints = [
            f"{self.base_url}/api/account/balance",
            f"{self.base_url}/api/accounts/{target_account}/balance",
            f"{self.base_url}/api/trading/account",
            f"{self.base_url}/api/account/summary",
            f"{self.base_url}/api/accounts/{target_account}/metrics",
            f"{self.base_url}/api/account/metrics",
            f"{self.base_url}/api/users/me/accounts",
        ]
        
        headers = {
            'accept': 'application/json',
            'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            'x-csrf-token': self.csrf or "",
            'x-requested-with': 'XMLHttpRequest'
        }
        
        for endpoint in endpoints:
            try:
                response = self.session.get(endpoint, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "balance": data.get("balance", data.get("cashBalance", 0)),
                        "equity": data.get("equity", data.get("accountEquity", 0)),
                        "margin_used": data.get("usedMargin", data.get("marginUsed", 0)),
                        "free_margin": data.get("freeMargin", data.get("availableMargin", 0)),
                        "unrealized_pnl": data.get("unrealizedPnL", data.get("floatingPnL", 0)),
                        "realized_pnl": data.get("realizedPnL", data.get("closedPnL", 0)),
                        "currency": data.get("currency", "USD"),
                        "account_id": target_account
                    }
                else:
                    pass
                    # print(f"Endpoint {endpoint} returned status {response.status_code}: {response.text[:200]}")
            except Exception as e:
                print(f"Balance endpoint {endpoint} failed: {str(e)}")
                continue
        
        # Fallback: try to get balance from WebSocket data
        return self._get_balance_from_websocket(target_account)
    
    def _get_balance_from_websocket(self, account_id: str) -> Dict:
        """Fallback: Get balance info from WebSocket handshake"""
        def has_balance_data(msg: str) -> bool:
            return '"balance"' in msg or '"cashBalance"' in msg or '"equity"' in msg or '"margin"' in msg

        try:
            json_str = self.establish_handshake(check_func=has_balance_data, timeout=10)
            if json_str:
                # Handle Legacy Pipe Format
                if "|" in json_str:
                    parts = json_str.split("|")
                    for part in parts:
                        try:
                            data = json.loads(part)
                            if "balance" in data or "equity" in data or "cashBalance" in data:
                                return self._extract_balance_data(data, account_id)
                        except:
                            continue
                # Handle New JSON Format
                else:
                    try:
                        data = json.loads(json_str)
                        # Check payload
                        payload = data.get("payload", {})
                        
                        # AccountMetrics format
                        if "metrics" in payload:
                            metrics = payload["metrics"]
                            # Iterate to find the account
                            for account_key, acct_data in metrics.items():
                                return self._extract_balance_data(acct_data, account_id)
                                
                        # AccountPortfolios format
                        elif "accounts" in payload:
                            for account in payload["accounts"]:
                                return self._extract_balance_data(account, account_id)
                    except:
                        pass
        except Exception as e:
            print(f"WebSocket balance fetch error: {str(e)}")
        
        return {
            "balance": 0, "equity": 0, "margin_used": 0, "free_margin": 0,
            "unrealized_pnl": 0, "realized_pnl": 0, "currency": "USD", "account_id": account_id
        }

    def _extract_balance_data(self, data, account_id):
        return {
            "balance": data.get("balance", data.get("cashBalance", 0)),
            "equity": data.get("equity", data.get("accountEquity", 0)),
            "margin_used": data.get("usedMargin", data.get("margin", 0)),
            "free_margin": data.get("freeMargin", data.get("availableMargin", 0)),
            "unrealized_pnl": data.get("unrealizedPnL", data.get("pl", 0)),
            "realized_pnl": data.get("realizedPnL", 0),
            "currency": "USD",
            "account_id": account_id or data.get("accountId", "unknown")
        }
    
    def get_account_analytics(self, account_id: Optional[str] = None) -> Dict:
        """Fetch trading analytics for the account"""
        target_account = account_id or self.account_id
        
        headers = {
            'accept': 'application/json',
            'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            'x-csrf-token': self.csrf or "",
            'x-requested-with': 'XMLHttpRequest'
        }
        
        analytics = {
            "total_trades": 0,
            "winning_trades": 0,
            "losing_trades": 0,
            "win_rate": 0,
            "total_pnl": 0,
            "daily_pnl": 0,
            "weekly_pnl": 0,
            "max_drawdown": 0,
            "open_positions": 0,
            "pending_orders": 0
        }
        
        # Try to fetch trade history for analytics
        try:
            history_url = f"{self.base_url}/api/trading/history"
            response = self.session.get(history_url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                trades = data.get("trades", data.get("orders", []))
                
                winning = sum(1 for t in trades if t.get("pnl", 0) > 0)
                losing = sum(1 for t in trades if t.get("pnl", 0) < 0)
                total_pnl = sum(t.get("pnl", 0) for t in trades)
                
                analytics["total_trades"] = len(trades)
                analytics["winning_trades"] = winning
                analytics["losing_trades"] = losing
                analytics["win_rate"] = round((winning / len(trades)) * 100, 1) if trades else 0
                analytics["total_pnl"] = total_pnl
        except Exception as e:
            print(f"Analytics fetch error: {str(e)}")
        
        # Get open positions count
        positions = self.get_positions()
        if positions:
            analytics["open_positions"] = len(positions)
        
        return analytics
    
    def get_positions(self) -> Optional[List[Dict]]:
        """Get current open positions"""
        def has_positions_data(msg: str) -> bool:
            return '"positions"' in msg or '"POSITIONS"' in msg
            
        try:
            # We use the check_func to detect when we have position data
            json_str = self.establish_handshake(kill_msg="POSITIONS", check_func=has_positions_data)
            if not json_str:
                return None
            
            # Legacy Pipe Format
            if "|" in json_str:
                try:
                    parts = json_str.split("|")
                    # Usually the second part has the body in legacy
                    for part in parts:
                         if "body" in part:
                             data = json.loads(part)
                             self.account_id = data.get("accountId")
                             positions = data.get("body", [])
                             print(f"Account ID: {self.account_id}")
                             return positions
                except:
                    pass
            
            # New JSON Format
            else:
                 try:
                    data = json.loads(json_str)
                    payload = data.get("payload", {})
                    # In AccountPortfolios, we might have positions
                    if "accounts" in payload:
                        all_positions = []
                        for account in payload["accounts"]:
                            if "positions" in account:
                                all_positions.extend(account["positions"])
                                self.account_id = account.get("accountId")
                        return all_positions
                 except:
                    pass
            
            return []
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {str(e)}")
            return None
    
    def open_trade(
        self,
        symbol: str,
        order_side: OrderSide,
        quantity: float,
        take_profit: float = 0,
        stop_loss: float = 0,
        limit_price: float = 0
    ) -> bool:
        """
        Open a new trade on the platform
        
        Args:
            symbol: Trading pair symbol (e.g., "US30", "XAUUSD")
            order_side: BUY or SELL
            quantity: Lot size
            take_profit: Take profit price (0 for none)
            stop_loss: Stop loss price (0 for none)
            limit_price: Limit price (0 for market order)
        
        Returns:
            True if order executed successfully, False otherwise
        """
        instrument_id = INSTRUMENTS.get(symbol)
        if not instrument_id:
            print(f"Unknown symbol: {symbol}")
            return False
        
        url = f"{self.base_url}/api/orders/single"
        headers = {
            'content-type': 'application/json; charset=UTF-8',
            'cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            'x-csrf-token': self.csrf or "",
            'x-requested-with': 'XMLHttpRequest'
        }
        
        # Adjust quantity for sell orders
        qty = quantity if order_side == OrderSide.BUY else -quantity
        
        payload = {
            "directExchange": False,
            "legs": [{
                "instrumentId": instrument_id,
                "positionEffect": "OPENING",
                "ratioQuantity": 1,
                "symbol": symbol
            }],
            "limitPrice": limit_price,
            "orderSide": "BUY" if order_side == OrderSide.BUY else "SELL",
            "orderType": "MARKET" if limit_price == 0 else "LIMIT",
            "quantity": qty,
            "requestId": f"gwt-uid-931-{str(uuid.uuid4())}",
            "timeInForce": "GTC"  # Good till cancelled
        }
        
        # Add stop loss if specified
        if stop_loss != 0:
            payload["stopLoss"] = {
                "fixedOffset": 5,
                "fixedPrice": stop_loss,
                "orderType": "STOP",
                "priceFixed": True,
                "quantityForProtection": abs(qty),
                "removed": False
            }
        
        # Add take profit if specified
        if take_profit != 0:
            payload["takeProfit"] = {
                "fixedOffset": 5,
                "fixedPrice": take_profit,
                "orderType": "LIMIT",
                "priceFixed": True,
                "quantityForProtection": abs(qty),
                "removed": False
            }
        
        try:
            response = self.session.post(
                url, 
                headers=headers, 
                data=json.dumps(payload).replace(" ", "")
            )
            
            if response.status_code == 200:
                print(f"Order executed successfully! {symbol} {order_side.name} {quantity}")
                return True
            else:
                print(f"Order failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"Order execution error: {str(e)}")
            return False
    
    def buy(
        self,
        symbol: str,
        quantity: float,
        take_profit: float = 0,
        stop_loss: float = 0,
        price: float = 0
    ) -> bool:
        """Place a buy order"""
        return self.open_trade(symbol, OrderSide.BUY, quantity, take_profit, stop_loss, price)
    
    def sell(
        self,
        symbol: str,
        quantity: float,
        take_profit: float = 0,
        stop_loss: float = 0,
        price: float = 0
    ) -> bool:
        """Place a sell order"""
        return self.open_trade(symbol, OrderSide.SELL, quantity, take_profit, stop_loss, price)
    
    def close_trade(
        self,
        position_id: str,
        quantity: float,
        symbol: str,
        instrument_id: int,
        price: float = 0
    ) -> bool:
        """Close an existing position"""
        url = f"{self.base_url}/api/positions/close"
        headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Cookie': '; '.join([f"{key}={value}" for key, value in self.cookies.items()]),
            'X-CSRF-Token': self.csrf or "",
            'X-Requested-With': 'XMLHttpRequest',
        }
        
        payload = {
            "legs": [{
                "instrumentId": instrument_id,
                "positionCode": position_id,
                "positionEffect": "CLOSING",
                "ratioQuantity": 1,
                "symbol": symbol
            }],
            "limitPrice": price,
            "orderType": "MARKET" if price == 0 else "LIMIT",
            "quantity": -quantity,
            "timeInForce": "GTC"
        }
        
        try:
            response = self.session.post(url, headers=headers, data=json.dumps(payload))
            return response.status_code == 200
        except Exception as e:
            print(f"Close trade error: {str(e)}")
            return False
    
    def close_all(self) -> bool:
        """Close all open positions"""
        positions = self.get_positions()
        if not positions:
            return True
        
        success = True
        for position in positions:
            pos_key = position.get("positionKey", {})
            result = self.close_trade(
                position_id=pos_key.get("positionCode"),
                quantity=position.get("quantity", 0),
                symbol=pos_key.get("symbol", ""),
                instrument_id=pos_key.get("instrumentId", 0)
            )
            if not result:
                success = False
        
        return success
    
    def get_account_info(self) -> Dict:
        """Get account information"""
        return {
            "account_id": self.account_id,
            "vendor": self.vendor,
            "is_connected": self.is_connected
        }

    def start_listening(self, callback: Optional[Callable[[Dict], None]] = None):
        """
        Start a long-running WebSocket listener.
        """
        # Ensure we have a session
        if not self.session_token and not self.login():
            print("Failed to login for listener.")
            return

        # Get Push Session if needed
        if not self.push_session_id:
             if not self.create_push_session():
                 print("Failed to create push session.")
                 return

        url = self.websocket_url
        headers = {"X-Push-Session-Id": self.push_session_id}
        
        def on_message(ws, message):
            try:
                # KeepAlive/Pong handling could be here
                if callback:
                    try:
                        data = json.loads(message)
                        callback(data)
                    except:
                        pass
            except:
                pass

        def on_open(ws):
            print("WebSocket Listener Connected")
            # Subscribe to all
            for sub in DxTradeSubscription:
                self._send_subscription(ws, sub)
            # Start Heartbeat
            self._start_heartbeat(ws)

        def on_error(ws, error):
            print(f"WebSocket Error: {error}")

        def on_close(ws, close_status_code, close_msg):
            print("WebSocket Closed")

        # Disable SSL verification if needed for debug, but generally safe to keep default
        ws_app = websocket.WebSocketApp(
            url, 
            header=headers, 
            on_message=on_message, 
            on_open=on_open,
            on_error=on_error,
            on_close=on_close
        )
        
        ws_app.run_forever()

    def _start_heartbeat(self, ws):
        """Send application level heartbeats"""
        def run():
            while ws.keep_running:
                time.sleep(self.heartbeat_interval)
                try:
                    # Send a KeepAlive ping
                    ws.send(json.dumps({"type": "Ping", "timestamp": int(time.time()*1000)}))
                except:
                    break
        t = threading.Thread(target=run)
        t.daemon = True
        t.start()


# Example usage
if __name__ == "__main__":
    # Initialize with LiquidBrokers (default)
    client = DxTradeClient(
        username="your_account_id",
        password="your_password",
        vendor="liquidbrokers"  # or "ftmo", "thefundedtraderprogram", etc.
    )
    
    # Login
    if client.login():
        print("Connected to LiquidBrokers DxTrade!")
        
        # Place a US30 trade
        client.buy(
            symbol="US30",
            quantity=0.5,
            stop_loss=38700,
            take_profit=38200
        )
