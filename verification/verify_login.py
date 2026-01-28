from playwright.sync_api import sync_playwright

def verify_login_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to login page...")
            page.goto("http://localhost:3000/login")

            # Wait for the page to load
            page.wait_for_selector('text=Bienvenido')

            # Verify Google button is visible
            google_button = page.get_by_role("button", name="Google")
            if google_button.is_visible():
                print("Google button is visible.")
            else:
                print("Google button NOT found.")

            # Take screenshot
            page.screenshot(path="verification/login_page.png")
            print("Screenshot saved to verification/login_page.png")

        except Exception as e:
            print(f"Error: {e}")
            try:
                page.screenshot(path="verification/error.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    verify_login_page()
