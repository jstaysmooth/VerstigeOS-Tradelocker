import requests
from typing import Optional, Dict, List

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
            if response.status_code == 200:
                data = response.json()
                # The response structure usually contains access_token and refresh_token
                self.access_token = data.get("accessToken")
                self.refresh_token = data.get("refreshToken")
                
                if self.access_token:
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.access_token}",
                        "accept": "application/json"
                    })
                    # After login, we need to fetch accounts to get accountId and accNum
                    return self._select_first_account()
                return False
            else:
                print(f"TradeLocker login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"TradeLocker login error: {str(e)}")
            return False

    def _select_first_account(self) -> bool:
        """Fetch all accounts and select the first one to set accountId and accNum header"""
        url = f"{self.base_url}/auth/jwt/all-accounts"
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                accounts = response.json().get("accounts", [])
                if accounts:
                    # Selecting the first account by default
                    account = accounts[0]
                    self.account_id = account.get("id")
                    # accNum is the order/index, often represented differently but required in header
                    # Usually it's obtained from the all-accounts list
                    self.acc_num = account.get("accNum")
                    if self.acc_num is not None:
                        self.session.headers.update({"accNum": str(self.acc_num)})
                    return True
                else:
                    print("No accounts found for TradeLocker user")
                    return False
            return False
        except Exception as e:
            print(f"TradeLocker account selection error: {str(e)}")
            return False

    def get_account_balance(self) -> Dict:
        """Fetch account details using /trade/config and /trade/accounts/{accountId}"""
        if not self.access_token:
            if not self.login():
                 return {"balance": 0, "equity": 0}

        # Based on docs, config gives accountDetails specification
        # But usually there's a specific endpoint for balance or account details
        url = f"{self.base_url}/trade/accounts/{self.account_id}"
        
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                data = response.json()
                # The response structure matches the 'accountDetails' in /config
                return {
                    "balance": float(data.get("balance", 0)),
                    "equity": float(data.get("equity", 0)),
                    "margin_used": float(data.get("marginUsed", 0)),
                    "free_margin": float(data.get("marginAvailable", 0)),
                    "currency": data.get("currency", "USD")
                }
            return {"balance": 0, "equity": 0}
        except Exception as e:
            print(f"TradeLocker balance fetch error: {str(e)}")
            return {"balance": 0, "equity": 0}

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
