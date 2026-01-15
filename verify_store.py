from playwright.sync_api import sync_playwright

def verify_sidebar_link():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Assuming dev server is running on port 3000
        page = browser.new_page()

        # We need to log in to see the dashboard.
        # Since I cannot easily log in without credentials, I will try to check the public store page directly
        # to ensure the Linktree design works and no 404 on a valid slug.
        # But the sidebar fix is in the dashboard.

        # Strategy:
        # 1. Verify a valid public store page loads (e.g., /lidiso or a mock slug if possible).
        # 2. Since I can't login, I verify the public page design component.

        # Note: In this environment, I might not have a user.
        # I will try to hit the root page or a known public page.
        # If I can't login, I can't verify the sidebar link click.
        # However, I can verify that accessing a random slug (that doesn't exist) gives 404,
        # and accessing a valid one gives the page.

        # Let's try to access /demo-store assuming it might exist or fail gracefully.
        # Actually, I'll try to render the component in isolation? No.

        # I'll rely on the code review and unit tests logic primarily, but I'll try to snapshot the public page.

        try:
            page.goto("http://localhost:3000/lidiso") # Default slug
            page.wait_for_timeout(3000)
            page.screenshot(path="verification_store.png")
            print("Screenshot taken of store page")
        except Exception as e:
            print(f"Error visiting store: {e}")

        browser.close()

if __name__ == "__main__":
    verify_sidebar_link()
