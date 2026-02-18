
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
    print("Error: Supabase credentials not found in env.")
    sys.exit(1)

supabase: Client = create_client(supabase_url, supabase_key)

def debug_trading_accounts():
    print("--- Debugging Trading Accounts ---")
    try:
        # Check trading_accounts
        response = supabase.table("trading_accounts").select("*").execute()
        accounts = response.data
        
        print(f"Found {len(accounts)} accounts in 'trading_accounts'.")
        
        for i, acc in enumerate(accounts):
            print(f"\nAccount #{i+1}:")
            print(f"  User ID: {acc.get('user_id')}")
            print(f"  Platform ID: {acc.get('platform_id')}")
            print(f"  Account ID/Num: {acc.get('account_number')}")
            print(f"  Is Active: {acc.get('is_active')}")
            
            # Check credentials format
            creds_str = acc.get('encrypted_credentials')
            print(f"  Creds (Raw): {creds_str[:50]}..." if creds_str else "  Creds: None")
            
            if creds_str:
                try:
                    creds = json.loads(creds_str)
                    print("  Creds (Parsed JSON): Valid")
                    print(f"    Email: {creds.get('email')}")
                    print(f"    Server: {creds.get('server')}")
                except:
                    print("  Creds (Parsed JSON): Invalid JSON (might be actually encrypted)")

    except Exception as e:
        print(f"Error querying trading_accounts: {e}")

    print("\n--- Checking Platforms ---")
    try:
        resp_platforms = supabase.table("trading_platforms").select("*").execute()
        for p in resp_platforms.data:
            print(f"Platform: {p['name']} (Code: {p['code']}) ID: {p['id']}")
    except Exception as e:
         print(f"Error querying trading_platforms: {e}")

if __name__ == "__main__":
    debug_trading_accounts()
