import requests
import json
import uuid
import time
import logging
from typing import Optional, Dict, List, Any
from enum import Enum

logger = logging.getLogger(__name__)

class OrderSide(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class OrderType(str, Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP = "STOP"
    
class TimeInForce(str, Enum):
    GTC = "GTC"
    IOC = "IOC"
    FOK = "FOK"

class DxTradeClient:
    def __init__(self, username: str, password: str, server: str, account_id: int):
        self.username = username
        self.password = password
        self.server = server # e.g. "ftmo"
        self.account_id = account_id
        self.base_url = f"https://dxtrade.{server}.com/api"
        self.session = requests.Session()
        self.csrf_token: Optional[str] = None
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Authority": f"dxtrade.{server}.com"
        }

    def login(self) -> bool:
        url = f"{self.base_url}/auth/login"
        payload = {
            "username": self.username,
            "password": self.password,
            "vendor": self.server,
            "accountId": self.account_id
        }
        
        try:
            response = self.session.post(url, json=payload, headers=self.headers)
            if response.status_code == 200:
                logger.info(f"Logged in successfully as {self.username}")
                # Cookies are automatically handled by self.session
                self.extract_csrf_token()
                return True
            else:
                logger.error(f"Login failed: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Login exception: {e}")
            return False

    def extract_csrf_token(self):
        """
        Fetches the main page to scrape the CSRF token from the meta tag.
        Similar to Go's FetchCSRF.
        """
        url = f"https://dxtrade.{self.server}.com/"
        try:
            response = self.session.get(url, headers=self.headers)
            if response.status_code == 200:
                # Simple parsing strategies to find <meta id="csrf-token" name="csrf" content="...">
                # We can use regex or simple string find/split like the Go implementation
                content = response.text
                if 'name="csrf" content="' in content:
                    parts = content.split('name="csrf" content="')
                    if len(parts) > 1:
                        token_part = parts[1].split('">')[0]
                        self.csrf_token = token_part
                        self.headers["X-CSRF-Token"] = self.csrf_token
                        logger.info(f"CSRF Token extracted: {self.csrf_token[:10]}...")
        except Exception as e:
            logger.error(f"Failed to extract CSRF token: {e}")

    def execute_order(
        self, 
        symbol: str, 
        side: OrderSide, 
        quantity: float, 
        instrument_id: int,
        order_type: OrderType = OrderType.MARKET,
        price: Optional[float] = None,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None
    ) -> Optional[Any]:
        
        if not self.csrf_token:
            self.extract_csrf_token()

        url = f"{self.base_url}/orders/single"
        
        # Prepare Leg
        leg = {
            "instrumentId": instrument_id,
            "positionEffect": "OPENING", # Default for new orders
            "ratioQuantity": 1,
            "symbol": symbol
        }
        
        payload = {
            "directExchange": False,
            "legs": [leg],
            "limitPrice": price if price is not None else 0,
            "orderSide": side.value,
            "orderType": order_type.value,
            "quantity": quantity,
            "requestId": f"gwt-uid-{uuid.uuid4()}",
            "timeInForce": TimeInForce.GTC.value
        }

        # Add Stops if present
        if stop_loss:
            payload["stopLoss"] = {
                "fixedOffset": 0,
                "fixedPrice": stop_loss,
                "orderType": "STOP",
                "priceFixed": True,
                "quantityForProtection": quantity,
                "removed": False
            }
            
        if take_profit:
            payload["takeProfit"] = {
                "fixedOffset": 0,
                "fixedPrice": take_profit,
                "orderType": "LIMIT",
                "priceFixed": True,
                "quantityForProtection": quantity,
                "removed": False
            }

        headers = self.headers.copy()
        headers["X-Requested-With"] = "XMLHttpRequest"
        
        try:
            # We must handle the specialized payload cleaning the Go repo did 
            # if SL/TP are missing, but Python's dict to json usually handles omitting fine 
            # if we construct it properly.
            response = self.session.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                logger.info(f"Order executed: {side} {quantity} {symbol}")
                return response.json()
            else:
                logger.error(f"Order failed: {response.status_code} {response.text}")
                return None
        except Exception as e:
            logger.error(f"Order execution exception: {e}")
            return None

    def get_positions(self) -> List[Dict]:
        url = f"{self.base_url}/positions"
        headers = self.headers.copy()
        headers["X-Requested-With"] = "XMLHttpRequest"
        
        try:
            response = self.session.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data.get("body", [])
            else:
                logger.error(f"Get positions failed: {response.text}")
                return []
        except Exception as e:
            logger.error(f"Get positions exception: {e}")
            return []

    def get_account_metrics(self) -> Optional[Dict]:
        # Implementation similar to get_positions but for account metrics (balance, equity)
        # Note: In Go repo this used WebSocket 'ACCOUNT_METRICS'. 
        # API might also have a REST endpoint for this or we rely on WS.
        # For MVP, we'll try to find a REST endpoint or return mock if only WS is supported.
        # Let's check if there is a common REST endpoint for account info.
        # Often /api/accounts/{accountId}/metrics
        pass
