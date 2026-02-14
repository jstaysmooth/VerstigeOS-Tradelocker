import requests
import json
import time

API_URL = "http://localhost:8002/api"

def test_full_flow():
    # 1. Create a Test User
    print(" Creating User...")
    username = f"sys_verifier_{int(time.time())}"
    res = requests.post(f"{API_URL}/test/create-user", json={"username": username, "rank": "Associate"})
    if res.status_code != 200:
        print(f" Failed to create user: {res.status_code} - {res.text}")
        return
    user_data = res.json()
    user_id = user_data["user_id"]
    print(f" User created: {user_id} ({username})")

    # 2. Update Stats & Trigger Promotion (Director requires 50k sales)
    print(" Updating Stats to trigger Director rank...")
    verify_stats = {"username": username, "sales": 60000, "trading": 10000}
    res = requests.post(f"{API_URL}/test/update-stats", json=verify_stats)
    if res.status_code != 200:
        print(f" Failed to update stats: {res.status_code} - {res.text}")
        return
    stats_data = res.json()
    print(f" Stats updated: {stats_data}")

    # 3. Verify Leaderboard
    print(" Verifying Leaderboard...")
    res = requests.get(f"{API_URL}/leaderboard")
    if res.status_code != 200:
        print(f" Failed to fetch leaderboard: {res.status_code} - {res.text}")
        return
    leaderboard = res.json()
    found = False
    for u in leaderboard:
        if u["username"] == username:
            print(f" User found on leaderboard: Rank {u['rank']}, Sales {u['sales_revenue']}")
            if u['rank'] != "Director":
                print(f" FAILED: Expected rank Director, got {u['rank']}")
                return
            found = True
            break
    if not found:
        print(" FAILED: User not found on leaderboard")
        return

    # 4. Verify Feed Post (Rank Achievement)
    print(" Verifying Rank Achievement Post...")
    time.sleep(1)
    res = requests.get(f"{API_URL}/feed")
    if res.status_code != 200:
        print(f" Failed to fetch feed: {res.status_code} - {res.text}")
        return
    posts = res.json()
    post_id = None
    for p in posts:
        if p["user"]["username"] == username and p["type"] == "rank_achievement":
            post_id = p["id"]
            print(f" Rank Post found: {post_id}")
            break
    if post_id is None:
        print(" FAILED: Rank achievement post not found")
        return

    # 5. Test Interactivity (Like)
    print(" Testing Like...")
    res = requests.post(f"{API_URL}/feed/{post_id}/like", json={"user_id": user_id})
    if res.status_code != 200:
        print(f" Failed to like post: {res.status_code} - {res.text}")
        return
    like_data = res.json()
    if not like_data.get("liked"):
        print(f" FAILED: Expected liked=True, got {like_data.get('liked')}")
        return
    print(" Like successful")

    # 6. Test Interactivity (Comment)
    print(" Testing Comment...")
    res = requests.post(f"{API_URL}/feed/{post_id}/comment", json={"user_id": user_id, "content": "Congrats!"})
    if res.status_code != 200:
        print(f" Failed to comment: {res.status_code} - {res.text}")
        return
    comment_data = res.json()
    if comment_data.get("comments_count", 0) < 1:
        print(f" FAILED: Expected comments_count >= 1, got {comment_data.get('comments_count')}")
        return
    print(" Comment successful")

    print("\nALL SYSTEM TESTS PASSED!")

if __name__ == "__main__":
    try:
        test_full_flow()
    except Exception as e:
        print(f"\nTEST FAILED: {e}")
        exit(1)
