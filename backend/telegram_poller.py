import asyncio
import os
import httpx
import logging
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("TelegramPoller")

# Load environment variables
load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
LOCAL_WEBHOOK_URL = "http://127.0.0.1:8001/api/telegram/webhook"

if not TELEGRAM_BOT_TOKEN:
    logger.error("Error: TELEGRAM_BOT_TOKEN not found in .env")
    exit(1)

async def delete_webhook(client):
    """Delete any existing webhook to enable polling"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/deleteWebhook"
    try:
        resp = await client.get(url)
        if resp.status_code == 200 and resp.json().get("ok"):
            logger.info("Webhook deleted successfully. Polling enabled.")
        else:
            logger.error(f"Failed to delete webhook: {resp.text}")
    except Exception as e:
        logger.error(f"Error deleting webhook: {e}")

async def poll_updates():
    offset = 0
    async with httpx.AsyncClient() as client:
        # First, ensure webhook is deleted
        await delete_webhook(client)
        
        logger.info(f"Starting Telegram Long Polling | Forwarding to {LOCAL_WEBHOOK_URL}")
        logger.info("Send a signal message to your bot now (e.g., 'BUY XAUUSD Entry: 2000 SL: 1990 TP: 2020')")

        while True:
            try:
                # Poll Telegram
                poll_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates?offset={offset}&timeout=30"
                resp = await client.get(poll_url, timeout=40)
                
                if resp.status_code != 200:
                    logger.error(f"Telegram API Error: {resp.status_code} - {resp.text}")
                    await asyncio.sleep(5)
                    continue

                data = resp.json()
                if not data.get("ok"):
                    logger.error(f"Telegram Response Not OK: {data}")
                    await asyncio.sleep(5)
                    continue

                updates = data.get("result", [])
                
                for update in updates:
                    update_id = update.get("update_id")
                    offset = update_id + 1  # Acknowledge logic
                    
                    # Forward to local webhook
                    try:
                        # Include secret header if backend expects it
                        headers = {"X-Telegram-Bot-Api-Secret-Token": os.getenv("TELEGRAM_WEBHOOK_SECRET", "")}
                        
                        # We send the whole update object as the webhook payload
                        local_resp = await client.post(LOCAL_WEBHOOK_URL, json=update, headers=headers)
                        
                        if local_resp.status_code == 200:
                            logger.info(f"Forwarded Update {update_id} -> Success")
                        else:
                            logger.warning(f"Forwarded Update {update_id} -> Local Error: {local_resp.status_code} {local_resp.text}")
                            
                    except Exception as e:
                        logger.error(f"Failed to forward update {update_id}: {e}")

            except httpx.ReadTimeout:
                continue # Normal timeout for long polling
            except Exception as e:
                logger.error(f"Polling loop error: {e}")
                await asyncio.sleep(5)

if __name__ == "__main__":
    try:
        asyncio.run(poll_updates())
    except KeyboardInterrupt:
        logger.info("Poller stopped by user")
