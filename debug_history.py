
import json
import sqlite3
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TLHistoryDebug")

def debug_history():
    conn = sqlite3.connect('verstige_local.db')
    cursor = conn.cursor()
    
    # Get any tradelocker account
    cursor.execute("SELECT encrypted_credentials FROM trading_accounts WHERE encrypted_credentials LIKE '%@%'")
    row = cursor.fetchone()
    if not row:
        print("No TradeLocker account found")
        return

    creds = json.loads(row[0])
    email = creds['email']
    password = creds['password']
    server = creds['server']
    
    print(f"Testing for: {email}")
    
    # Login
    base_url = "https://live.tradelocker.com/backend-api"
    auth_url = f"{base_url}/oauth/token"
    payload = {
        "grant_type": "password",
        "username": email,
        "password": password,
        "server": server
    }
    
    res = requests.post(auth_url, data=payload)
    if res.status_code != 200:
        print(f"Login failed: {res.status_code} - {res.text}")
        return
        
    data = res.json()
    token = data['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get accounts
    acc_res = requests.get(f"{base_url}/trade/accounts", headers=headers)
    accounts = acc_res.json().get('d', acc_res.json()).get('accounts', [])
    
    if not accounts:
        print("No accounts found")
        return
        
    account = accounts[0]
    acc_id = account['id']
    acc_num = account['accNum']
    headers["accNum"] = str(acc_num)
    
    print(f"Using Account ID: {acc_id}, AccNum: {acc_num}")
    
    # Try multiple history endpoints
    endpoints = [
        f"{base_url}/trade/accounts/{acc_id}/ordersHistory",
        f"{base_url}/trade/accounts/{acc_id}/trades",
        f"{base_url}/trade/accounts/{acc_id}/history",
        f"{base_url}/trade/accounts/{acc_id}/fills"
    ]
    
    for url in endpoints:
        print(f"\n--- Testing Endpoint: {url} ---")
        h_res = requests.get(url, headers=headers)
        print(f"Status: {h_res.status_code}")
        if h_res.status_code == 200:
            h_data = h_res.json()
            # Handle 'd' wrapper
            actual_data = h_data.get('d', h_data)
            keys = list(actual_data.keys())
            print(f"Keys found: {keys}")
            
            # Find the first list in the response
            list_key = next((k for k in keys if isinstance(actual_data[k], list)), None)
            if list_key:
                items = actual_data[list_key]
                print(f"Found {len(items)} items in '{list_key}'")
                if items:
                    print("Sample Item Structure:")
                    print(json.dumps(items[0], indent=2))
            else:
                print("No list found in response")
        else:
            print(f"Error: {h_res.text[:200]}")

if __name__ == "__main__":
    debug_history()
