from playwright.sync_api import Page, expect, sync_playwright
import time

def test_scroll_behavior(page: Page):
    print("Navigating to test page...")
    # Go to test page
    page.goto("http://localhost:3000/test-design-editor")

    # Wait for content
    print("Waiting for content...")
    page.wait_for_selector("input[value='Test Shop']", timeout=20000)

    # Set Mobile Viewport
    page.set_viewport_size({"width": 390, "height": 844})

    # Check BottomNav is visible
    print("Checking BottomNav visibility...")
    bottom_nav_btn = page.locator("button").filter(has_text="Fondo").first
    expect(bottom_nav_btn).to_be_visible()

    # Initial Screenshot
    page.screenshot(path="verification/initial.png")
    print("Initial screenshot taken.")

    # Find the scrollable container.
    # The ID is "store-preview-container".
    container = page.locator("#store-preview-container")

    # Scroll down inside the container
    print("Scrolling...")
    container.evaluate("element => element.scrollTop = 1000")

    # Take screenshot after scroll
    page.screenshot(path="verification/scrolled.png")
    print("Scrolled screenshot taken.")

    # Verify BottomNav is still visible (should be fixed/flex-none at bottom)
    expect(bottom_nav_btn).to_be_visible()
    print("BottomNav is still visible.")

    # Check if a bottom product is visible
    # We have 8 products.
    # Product 8 should be visible if we scrolled enough.
    # Note: Product 8 text depends on how ProductCard renders it.
    # Assuming "Product 8" is rendered.
    expect(page.get_by_text("Product 8")).to_be_visible()
    print("Product 8 is visible.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_scroll_behavior(page)
            print("Test passed!")
        except Exception as e:
            print(f"Test failed: {e}")
        finally:
            browser.close()
