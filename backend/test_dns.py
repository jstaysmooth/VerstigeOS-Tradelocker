
import socket
import sys

def check_dns(hostname):
    try:
        ip = socket.gethostbyname(hostname)
        print(f"SUCCESS: {hostname} resolved to {ip}")
        return True
    except socket.gaierror as e:
        print(f"FAILURE: {hostname} could not be resolved: {e}")
        return False

if __name__ == "__main__":
    print("Checking DNS resolution...")
    api_host = "llqobekmngowvmwenpda.supabase.co"
    db_host = "db.llqobekmngowvmwenpda.supabase.co"
    
    check_dns(api_host)
    check_dns(db_host)
