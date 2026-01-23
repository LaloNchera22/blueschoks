from playwright.sync_api import sync_playwright, expect
import re
import time

def run():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to verify page...")
        try:
            page.goto("http://localhost:3000/verify-changes")
            page.wait_for_load_state("domcontentloaded")
            # Wait a bit more for React hydration
            time.sleep(5)
        except Exception as e:
            print(f"Navigation failed: {e}")
            browser.close()
            return

        print("Page loaded (hopefully). Taking screenshot...")
        page.screenshot(path="verification/verification.png")
        print("Screenshot saved to verification/verification.png")

        print("Verifying Avatar...")
        try:
            avatar_container = page.locator("div.h-32.w-32.border-4")
            # We check if class contains rounded-none.
            expect(avatar_container).to_have_class(re.compile(r"rounded-none"))
            print("Avatar check passed: has 'rounded-none'")
        except Exception as e:
            print(f"Avatar check failed: {e}")

        print("Verifying Price Color...")
        try:
            # Price is a <p> tag with text $100.00
            # Use a more specific locator if possible or just text
            price_el = page.locator("p", has_text="$100.00")
            expect(price_el).to_have_css("color", "rgb(0, 255, 0)")
            print("Price color check passed.")
        except Exception as e:
            print(f"Price check failed: {e}")

        print("Verifying Title Color...")
        try:
            # Verify Title Color (Blue: #0000ff -> rgb(0, 0, 255))
            title_el = page.locator("h3", has_text="Test Product")
            expect(title_el).to_have_css("color", "rgb(0, 0, 255)")
            print("Title color check passed.")
        except Exception as e:
            print(f"Title check failed: {e}")

        browser.close()

if __name__ == "__main__":
    run()
