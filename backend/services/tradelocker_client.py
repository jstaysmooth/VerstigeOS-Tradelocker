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
    
    def __init__(self, email: str, password: str, server: str, broker_url: str = "https://demo.tradelocker.com/backend-api"):
        self.email = email
        self.password = password
        self.server = server
        self.base_url = broker_url.rstrip("/")
        self.access_token = None
        self.refresh_token = None
        self.account_id = None
        self.acc_num = None
        self.last_balance_data = {"balance": 0, "equity": 0}
        self.last_history = []
        self.session = requests.Session()

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

    def execute_order(self, symbol: str, action: str, quantity: float, stop_loss: float = 0, take_profit: float = 0) -> Dict:
        """Execute a trade on TradeLocker using /trade/accounts/{accountId}/orders"""
        if not self.access_token:
            if not self.login():
                return {"status": "failed", "message": "Not authenticated"}

        url = f"{self.base_url}/trade/accounts/{self.account_id}/orders"
        
        # Note: instrument_id needs to be the tradableInstrumentId, not the symbol string usually.
        # For simplicity, we assume symbol is passed correctly or we'd need to look it up.
        payload = {
            "tradableInstrumentId": symbol,
            "side": action.upper(), # 'BUY' or 'SELL'
            "quantity": quantity,
            "type": "market"
        }
        
        if stop_loss > 0:
            payload["stopLoss"] = stop_loss
        if take_profit > 0:
            payload["takeProfit"] = take_profit

        try:
            response = self.session.post(url, json=payload)
            if response.status_code in [200, 201]:
                return {"status": "success", "data": response.json()}
            else:
                return {"status": "failed", "message": response.text}
        except Exception as e:
            return {"status": "error", "message": str(e)}
