import requests
import json
from bs4 import BeautifulSoup

def test_login():
    s = requests.Session()
    res = s.post("https://trader.liquidcharts.com/api/auth/login", json={"username":"foo", "password":"bar", "vendor":"liquidbrokers", "domain":"default"})
    print("Login:", res.status_code)
    if res.status_code == 200:
        res2 = s.get("https://trader.liquidcharts.com/api/trading/accounts")
        print("Accounts:", res2.status_code, res2.text)

test_login()
