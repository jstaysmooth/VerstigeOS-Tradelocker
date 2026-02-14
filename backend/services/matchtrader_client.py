
import requests
import json
import time
from typing import Optional, Dict

class MatchTraderClient:
    """Client for Match-Trader API integration"""
    
    def __init__(self, email: str, password: str, broker_url: str = "https://match-trader.com/api"):
        self.email = email
        self.password = password
        self.base_url = broker_url.rstrip("/")
        self.token = None
        self.account_id = None
        self.session = requests.Session()

    def login(self) -> bool:
        """Authenticate with Match-Trader"""
        url = f"{self.base_url}/login"
        payload = {
            "email": self.email,
            "password": self.password
        }
        
        try:
            response = self.session.post(url, json=payload, headers={"Content-Type": "application/json"})
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                self.account_id = data.get("accountId")
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                print(f"Match-Trader login successful for {self.email}")
                return True
            else:
                print(f"Match-Trader login failed: {response.text}")
                return False
        except Exception as e:
            print(f"Match-Trader login error: {str(e)}")
            return False

    def get_account_balance(self) -> Dict:
        """Fetch account balance and metrics"""
        if not self.token:
            if not self.login():
                 return {"balance": 0, "equity": 0}

        url = f"{self.base_url}/trading/accounts/{self.account_id}"
        
        try:
            response = self.session.get(url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "balance": data.get("balance", 0),
                    "equity": data.get("equity", 0),
                    "margin_used": data.get("margin", 0),
                    "free_margin": data.get("freeMargin", 0),
                    "currency": data.get("currency", "USD")
                }
            return {"balance": 0, "equity": 0}
        except Exception as e:
            print(f"Match-Trader balance fetch error: {str(e)}")
            return {"balance": 0, "equity": 0}

    def execute_order(self, symbol: str, action: str, quantity: float, stop_loss: float = 0, take_profit: float = 0) -> Dict:
        """Execute a trade on Match-Trader"""
        if not self.token:
            if not self.login():
                return {"status": "failed", "message": "Not authenticated"}

        url = f"{self.base_url}/trading/orders"
        payload = {
            "accountId": self.account_id,
            "instrument": symbol,
            "side": action.upper(), # BUY/SELL
            "volume": quantity,
            "type": "MARKET"
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
