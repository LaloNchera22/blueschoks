from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            # Navigate to test page
            print("Navigating to test page...")
            page.goto("http://localhost:3000/test-card-design")

            # Wait for editor to load
            print("Waiting for editor...")
            expect(page.get_by_placeholder("Mi Tienda")).to_be_visible()

            # Click on "Tarjetas" button in toolbar
            print("Clicking 'Tarjetas'...")
            page.get_by_role("button", name="Tarjetas").click()

            # Wait for card styling toolbar
            print("Waiting for toolbar...")
            expect(page.get_by_text("Opacidad")).to_be_visible()

            # Take screenshot of default state
            print("Taking default screenshot...")
            page.screenshot(path="verification/card_design_default.png")

            # Adjust Opacity (Slider)
            print("Adjusting Opacity...")
            slider = page.get_by_role("slider")
            if slider.count() > 0:
                slider.first.focus()
                # Default is 1 (100%). Press Left to decrease.
                for _ in range(5):
                    page.keyboard.press("ArrowLeft")

            # Change Radius (Click "Pill" button)
            print("Changing Radius...")
            page.get_by_title("Pill").click()

            # Toggle Shadow
            print("Toggling Shadow...")
            page.get_by_role("switch").click()

            # Wait a bit for transitions
            page.wait_for_timeout(1000)

            # Take screenshot after changes
            print("Taking changed screenshot...")
            page.screenshot(path="verification/card_design_changed.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
