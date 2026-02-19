
import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv
import json

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Error: Supabase credentials not found in .env")
    sys.exit(1)

supabase: Client = create_client(supabase_url, supabase_key)

USER_ID = "420a6e35-7b36-4bb4-a615-b1560784eed2"

print(f"--- Debugging Accounts for User: {USER_ID} ---")

# 1. Check Trading Accounts
try:
    response = supabase.table("trading_accounts").select("*").eq("user_id", USER_ID).execute()
    data = response.data
    print(f"Found {len(data)} accounts in 'trading_accounts'.")
    for acc in data:
        print(json.dumps(acc, indent=2, default=str))
except Exception as e:
    print(f"Error fetching accounts: {e}")

# 2. Check Platforms
try:
    response = supabase.table("trading_platforms").select("*").execute()
    print(f"\n--- Available Platforms ---")
    for p in response.data:
        print(f"ID: {p['id']} | Code: {p['code']} | Name: {p['name']}")
except Exception as e:
    print(f"Error fetching platforms: {e}")
