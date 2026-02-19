import requests
import json
import logging
from typing import Optional, Dict, List

logger = logging.getLogger(__name__)

class TradeLockerClient:
    """
    Client for TradeLocker Public API integration.
    Documentation: https://public-api.tradelocker.com/docs/getting-started
    """

    # Known wrong prefixes that should be replaced with /backend-api
    _WRONG_SUFFIXES = ["/clientapi/v1", "/clientapi", "/api/v1", "/api"]

    def __init__(self, email: str, password: str, server: str, broker_url: str = "https://demo.tradelocker.com/backend-api"):
        self.email = email
        self.password = password
        self.server = server

        # Normalize the broker_url — always ensure it ends with /backend-api
        # (old stored values may have wrong suffixes like /clientapi/v1)
        base = broker_url.rstrip("/")
        for wrong in self._WRONG_SUFFIXES:
            if base.endswith(wrong):
                root = base[: -len(wrong)]
                base = root + "/backend-api"
                logger.warning(f"[TradeLockerClient] Corrected broker_url: '{broker_url}' → '{base}'")
                break
        if not base.endswith("/backend-api"):
            # If still no /backend-api, append it
            base = base + "/backend-api"
            logger.warning(f"[TradeLockerClient] Appended /backend-api: '{base}'")

        self.base_url = base
        self.access_token = None
        self.refresh_token = None
        self.account_id = None
        self.acc_num = None
        self.last_balance_data = {"balance": 0, "equity": 0}
        self.last_history = []
        self.session = requests.Session()
        logger.info(f"[TradeLockerClient] Initialized with base_url={self.base_url} server={self.server}")


    def login(self) -> bool:
        """Authenticate with TradeLocker using JWT"""
        url = f"{self.base_url}/auth/jwt/token"
        payload = {
            "email": self.email,
            "password": self.password,
            "server": self.server
        }
        
        try:
            response = self.session.post(url, json=payload, headers={"Content-Type": "application/json"})
            if response.status_code in [200, 201]:
                data = response.json()
                # The response structure usually contains access_token and refresh_token
                self.access_token = data.get("accessToken")
                self.refresh_token = data.get("refreshToken")
                
                if self.access_token:
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.access_token}",
                        "accept": "application/json"
                    })
                    return True, ""
                return False, "No access token received"
            else:
                error_msg = f"TradeLocker login failed: {response.status_code} - {response.text}"
                print(error_msg)
                return False, error_msg
        except Exception as e:
            error_msg = f"TradeLocker login error: {str(e)}"
            print(error_msg)
            return False, error_msg

    def refresh_session(self, refresh_token: str) -> bool:
        """Refresh the session using a refresh token"""
        url = f"{self.base_url}/auth/jwt/refresh"
        try:
            response = self.session.post(url, json={"refreshToken": refresh_token}, headers={"Content-Type": "application/json"})
            if response.status_code == 200:
                data = response.json()
                self.access_token = data.get("accessToken")
                # Update session headers
                self.session.headers.update({"Authorization": f"Bearer {self.access_token}"})
                return True
            else:
                print(f"Session refresh failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"Session refresh error: {str(e)}")
            return False

    def get_all_accounts(self) -> (bool, List[Dict], str):
        """Fetch all accounts for the user"""
        if not self.access_token:
            return False, [], "Not authenticated"

        url = f"{self.base_url}/auth/jwt/all-accounts"
        try:
            response = self.session.get(url)
            
            if response.status_code == 200:
                json_data = response.json()
                # Handle 'd' wrapper if present
                data = json_data.get('d', json_data)
                accounts = data.get("accounts", [])
                logger.info(f"DEBUG: Full Accounts Response: {json_data}")
                return True, accounts, ""
            
            msg = f"Account fetch failed: {response.status_code} - {response.text}"
            print(msg)
            return False, [], msg
        except Exception as e:
            msg = f"TradeLocker account fetch error: {str(e)}"
            print(msg)
            return False, [], msg

    def select_account(self, account_id: str) -> bool:
        """Set the active account for trading"""
        # We need the accNum, so we fetch all accounts and find the matching one
        success, accounts, msg = self.get_all_accounts()
        if not success:
            print(f"Failed to fetch accounts during selection: {msg}")
            return False

        account = next((a for a in accounts if a.get("id") == account_id), None)
        if account:
            logger.info(f"DEBUG: Selected Account Details: {account}")
            self.account_id = account.get("id")
            self.acc_num = account.get("accNum")
            
            # Eagerly store balance if present
            bal = float(account.get("accountBalance", 0) or account.get("balance", 0))
            self.last_balance_data = {
                "balance": bal,
                "equity": bal,
                "margin_used": 0,
                "free_margin": bal,
                "currency": account.get("currency", "USD")
            }
            
            if self.acc_num is not None:
                self.session.headers.update({"accNum": str(self.acc_num)})
            return True
        else:
            print(f"Account {account_id} not found")
            return False

    def get_account_balance(self) -> Dict:
        """Fetch account details using /trade/accounts/{accountId}"""
        if not self.access_token:
            if not self.login():
                 logger.error("Failed to login to TradeLocker for balance fetch")
                 return {"balance": 0, "equity": 0}

        url = f"{self.base_url}/trade/accounts/{self.account_id}"
        
        try:
            # Refresh token check could go here if needed, but session usually handles it
            response = self.session.get(url)
            
            logger.info(f"TradeLocker Balance Check URL: {url}")
            logger.info(f"TradeLocker Balance Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"TradeLocker Balance Raw Data: {data}")
                
                # Check for 'd' wrapper which TradeLocker sometimes uses
                account_data = data.get('d', data)
                
                def safe_float(val, default=0.0):
                    try:
                        if val is None: return default
                        return float(val)
                    except (ValueError, TypeError):
                        return default

                return {
                    "balance": safe_float(account_data.get("balance")),
                    "equity": safe_float(account_data.get("equity")),
                    "margin_used": safe_float(account_data.get("marginUsed")),
                    "free_margin": safe_float(account_data.get("marginAvailable")),
                    "currency": account_data.get("currency", "USD")
                }
            
            logger.error(f"TradeLocker Balance Error Response: {response.text}")
            
            # Fallback: check if we can get it from all accounts again
            success, accounts, _ = self.get_all_accounts()
            if success and accounts:
                account = next((a for a in accounts if a.get("id") == self.account_id), accounts[0])
                if account:
                    bal = float(account.get("accountBalance", 0) or account.get("balance", 0))
                    self.last_balance_data = {
                        "balance": bal,
                        "equity": bal, # Fallback equity to balance
                        "margin_used": 0,
                        "free_margin": bal,
                        "currency": account.get("currency", "USD")
                    }
                    return self.last_balance_data
            
            return self.last_balance_data
        except Exception as e:
            logger.error(f"TradeLocker balance fetch error: {str(e)}")
            return self.last_balance_data

    async def login_async(self) -> bool:
        """Authenticate with TradeLocker using JWT (async version)"""
        # Since we are using requests, we'll keep it synchronous for now but provide a wrapper if needed.
        # However, the rest of the backend uses async/await, so we should consider using httpx or similar
        # but for now let's stick to the current pattern and just implement the methods.
        return self.login()

    def get_positions(self) -> List[Dict]:
        """Fetch open positions for the selected account"""
        if not self.access_token:
            if not self.login():
                return []

        url = f"{self.base_url}/trade/accounts/{self.account_id}/positions"
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                data = response.json()
                # Handle 'd' wrapper
                api_data = data.get('d', data)
                positions = api_data.get("positions", [])
                logger.info(f"FETCHED POSITIONS: {len(positions)} found")
                return positions
            return []
        except Exception as e:
            print(f"TradeLocker positions fetch error: {str(e)}")
            return []

    def get_orders(self) -> List[Dict]:
        """Fetch open orders for the selected account"""
        if not self.access_token:
            if not self.login():
                return []

        url = f"{self.base_url}/trade/accounts/{self.account_id}/orders"
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                return response.json().get("orders", [])
            return []
        except Exception as e:
            print(f"TradeLocker orders fetch error: {str(e)}")
            return []

    def get_history(self) -> List[Dict]:
        """Fetch trade history for the selected account"""
        if not self.access_token:
            if not self.login():
                return []

        # Use /trade/accounts/{id}/ordersHistory
        url = f"{self.base_url}/trade/accounts/{self.account_id}/ordersHistory"
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                data = response.json()
                # Handle 'd' wrapper
                api_data = data.get('d', data)
                self.last_history = api_data.get("ordersHistory", api_data.get("history", api_data.get("trades", [])))
                logger.info(f"FETCHED TL HISTORY: {len(self.last_history)} records. Sample: {json.dumps(self.last_history[0]) if self.last_history else 'None'}")
                return self.last_history
            
            if response.status_code == 429:
                logger.warning("TradeLocker history fetch rate limited (429), using cache")
                return self.last_history
                
            logger.error(f"History fetch failed: {response.status_code} - {response.text}")
            return self.last_history
        except Exception as e:
            logger.error(f"TradeLocker history fetch error: {str(e)}")
            return self.last_history

    def get_account_analytics(self) -> Dict:
        """Calculate basic analytics from history and positions"""
        history = self.get_history()
        positions = self.get_positions()
        
        analytics = {
            "total_trades": 0,
            "win_rate": 0,
            "total_pnl": 0,
            "open_positions": len(positions)
        }
        
        if not history:
            logger.info("Analytics: No history found.")
            return analytics
        
        def get_pnl_value(t):
            if not isinstance(t, dict):
                return None
            # Check for multiple possible P&L fields
            for field in ["pnl", "realizedPnL", "profit", "realized_pnl", "realized_profit"]:
                val = t.get(field)
                if val is not None:
                    try: return float(val)
                    except: pass
            return None

        closed_trades = []
        for t in history:
            p = get_pnl_value(t)
            if p is not None:
                closed_trades.append(p)

        if not closed_trades:
            logger.info(f"Analytics: Found {len(history)} history items, but none with valid P&L fields.")
            return analytics

        wins = [p for p in closed_trades if p > 0]
        
        analytics["total_trades"] = len(closed_trades)
        analytics["total_pnl"] = sum(closed_trades)
        analytics["win_rate"] = (len(wins) / len(closed_trades)) * 100
        
        logger.info(f"CALCULATED ANALYTICS: {analytics}")
        return analytics

    def get_instrument_id(self, symbol: str) -> Optional[int]:
        """
        Look up the numeric tradableInstrumentId for a given symbol string.
        Calls /trade/accounts/{accountId}/instruments and matches by name/symbol.
        Results are cached on the instance to avoid repeated API calls.
        """
        if not hasattr(self, '_instrument_cache'):
            self._instrument_cache = {}

        symbol_upper = symbol.upper()
        if symbol_upper in self._instrument_cache:
            logger.info(f"[Instrument] Cache hit: {symbol_upper} → {self._instrument_cache[symbol_upper]}")
            return self._instrument_cache[symbol_upper]

        logger.info(f"[Instrument] Looking up '{symbol_upper}' | account_id={self.account_id} | acc_num={self.acc_num}")

        if not self.account_id:
            logger.error("[Instrument] account_id is None — cannot call instruments endpoint")
            return None

        url = f"{self.base_url}/trade/accounts/{self.account_id}/instruments"
        try:
            response = self.session.get(url)
            logger.info(f"[Instrument] GET {url} → {response.status_code}")
            logger.info(f"[Instrument] Raw response (first 500): {response.text[:500]}")

            if response.status_code == 200:
                data = response.json()
                # Handle 'd' wrapper (TradeLocker wraps most responses)
                api_data = data.get('d', data)
                instruments = api_data.get('instruments', api_data if isinstance(api_data, list) else [])
                logger.info(f"[Instrument] Total instruments found: {len(instruments)}")

                if instruments:
                    # Log a sample to see the actual field names
                    sample = instruments[0] if instruments else {}
                    logger.info(f"[Instrument] Sample instrument fields: {list(sample.keys())}")
                    logger.info(f"[Instrument] Sample instrument: {str(sample)[:300]}")

                for inst in instruments:
                    # Try multiple possible field names for the symbol
                    name = (
                        inst.get('name') or
                        inst.get('symbol') or
                        inst.get('instrumentName') or
                        inst.get('tradingSymbol') or ''
                    ).upper()

                    if name == symbol_upper:
                        tid = (
                            inst.get('tradableInstrumentId') or
                            inst.get('id') or
                            inst.get('instrumentId')
                        )
                        if tid:
                            self._instrument_cache[symbol_upper] = int(tid)
                            logger.info(f"[Instrument] ✅ Resolved {symbol_upper} → id={tid}")
                            return int(tid)

                # Log all instrument names for debugging
                all_names = [(inst.get('name') or inst.get('symbol') or '?') for inst in instruments[:20]]
                logger.warning(f"[Instrument] '{symbol_upper}' not found. First 20 instrument names: {all_names}")
            else:
                logger.error(f"[Instrument] Fetch failed: {response.status_code} - {response.text[:300]}")
        except Exception as e:
            logger.error(f"[Instrument] Lookup error: {e}")
        return None


    def execute_order(self, symbol: str, action: str, quantity: float, stop_loss: float = 0, take_profit: float = 0) -> Dict:
        """Execute a market order on TradeLocker using /trade/accounts/{accountId}/orders"""
        if not self.access_token:
            success, msg = self.login()
            if not success:
                return {"status": "failed", "message": "Not authenticated"}

        # Resolve symbol → numeric tradableInstrumentId (required by TradeLocker API)
        instrument_id = self.get_instrument_id(symbol)
        if instrument_id is None:
            logger.error(f"[Execute] Could not resolve instrument ID for '{symbol}'")
            return {"status": "error", "message": f"Unknown instrument: {symbol}"}

        url = f"{self.base_url}/trade/accounts/{self.account_id}/orders"

        payload = {
            "tradableInstrumentId": instrument_id,
            "side": action.upper(),   # 'BUY' or 'SELL'
            "quantity": quantity,
            "type": "market"
        }
        if stop_loss > 0:
            payload["stopLoss"] = stop_loss
        if take_profit > 0:
            payload["takeProfit"] = take_profit

        logger.info(f"[Execute] Placing order: {payload} → {url}")

        try:
            response = self.session.post(url, json=payload)
            logger.info(f"[Execute] Order response: {response.status_code} - {response.text[:300]}")

            if response.status_code in [200, 201]:
                data = response.json()
                # TradeLocker wraps response in 'd' key
                order_data = data.get('d', data)
                order_id = (
                    order_data.get('orderId') or
                    order_data.get('id') or
                    order_data.get('order', {}).get('id')
                )
                return {"status": "success", "orderId": order_id, "data": order_data}
            else:
                logger.error(f"[Execute] Order failed: {response.status_code} - {response.text}")
                return {"status": "failed", "message": response.text, "code": response.status_code}
        except Exception as e:
            logger.error(f"[Execute] Order exception: {e}")
            return {"status": "error", "message": str(e)}

